import DefaultPageLayout from "../../layout/DefaultPageLayout";
import LegendModal from "../../modal/LegendModal";
import {useLocation, useNavigate, useParams, useSearchParams} from "react-router-dom";
import ResultTable from "./ResultTable";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import PaginationRow from "./PaginationRow";
import {DEFAULT_PAGE, DEFAULT_PAGE_SIZE, LOCAL_RESULTS, PERMITTED_PAGE_SIZES, TITLE} from "../../../constants/const";
import DownloadModal from "../../modal/DownloadModal";
import {getMapping} from "../../../services/ProtVarService";
import {PagedMappingResponse} from "../../../types/PagedMappingResponse";

import {ResultRecord} from "../../../types/ResultRecord";
import useLocalStorage from "../../../hooks/useLocalStorage";
import {APP_URL} from "../../App";
import {HelpButton} from "../../components/help/HelpButton";
import {HelpContent} from "../../components/help/HelpContent";
import {ShareLink} from "../../components/common/ShareLink";
import Spaces from "../../elements/Spaces";
import Loader from "../../elements/Loader";
import {
  extractFilters,
  mapUiCaddToBackend,
  mapUiStabilityToBackend,
  normalizeFilterValues
} from "../../components/search/filterUtils";
import {fromString/*, normalize, resolve*/} from "../../../utills/InputTypeResolver";
import {InputType} from "../../../types/InputType";
import {MappingRequest} from "../../../types/MappingRequest";
import SearchFilters, {
  SearchFilterParams
} from "../../components/search/SearchFilters";
import {VALID_AM_VALUES, VALID_CADD_VALUES} from "../../components/search/filterConstants";

const INVALID_PAGE = `The requested page number is invalid or out of range. Displaying page ${DEFAULT_PAGE} by default.`
const INVALID_PAGE_SIZE = `The specified page size is invalid. Using the default page size of ${DEFAULT_PAGE_SIZE} instead.`
const MAX_PAGE_EXCEEDED = `The requested page number exceeds the total number of available pages (total pages: {totalPages}).`
export const NO_DATA = 'No data'
export const NO_RESULT = 'No result to display'
export const UNEXPECTED_ERR = 'An unexpected error occurred'

function ResultPageContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { input } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputType, setInputType] = useState<InputType | null>(null);
  const [resultTitle, setResultTitle] = useState(input)

  // components that alter search params:
  // 1) PaginationRow
  // 2) ShareAnnotation
  // ?
  // change in page,pageSize,assembly - requires reload
  // change in annotation - toggleAnnotation
  // maybe map searchParams into an interface for expected params where all fields will be optional?

  const page = parseInt(searchParams.get('page') || `${DEFAULT_PAGE}`, 10);
  const pageSize = parseInt(searchParams.get('pageSize') || `${DEFAULT_PAGE_SIZE}`, 10);
  const assembly = searchParams.get("assembly")
  const filters = useMemo(() => extractFilters(searchParams), [searchParams]);
  // Add local state for immediate UI feedback
  const [localFilters, setLocalFilters] = useState<SearchFilterParams>(filters);

  const [data, setData] = useState<PagedMappingResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [warning, setWarning] = useState('')
  const {getItem, setItem} = useLocalStorage();

  const viewedRecord = useCallback((input: string, url: string) => {
    const now = new Date().toISOString();
    let savedRecords = getItem<ResultRecord[]>(LOCAL_RESULTS) || [];

    // Find the index of the record to update
    const index = savedRecords.findIndex(record => record.id === input);

    if (index !== -1) {
      // Update the record in the array
      // update url to current page view
      savedRecords[index] = {...savedRecords[index], url, lastViewed: now};
      // Move the updated record to the beginning of the array
      const [movedRecord] = savedRecords.splice(index, 1);
      savedRecords.unshift(movedRecord);
    } else { // if no matching record is found
      // add new record to beginning of array
      savedRecords = [{id: input, url, lastViewed: now}, ...savedRecords]
    }
    setItem(LOCAL_RESULTS, savedRecords);
  }, [getItem, setItem]);

  const updatingTypeParam = useRef(false);

  const loadData = useCallback((
    providedType: InputType | null,
    input: string,
    page: number,
    pageSize: number,
    assembly: string | null,
    filters?: SearchFilterParams
  ) => {
    setLoading(true)
    // for testing, add a delay here

    const pageIsValid = !isNaN(page) && page > 0;
    const pageSizeIsValid = !isNaN(pageSize) && PERMITTED_PAGE_SIZES.includes(pageSize);

    if (!pageIsValid) {
      setWarning(INVALID_PAGE)
      page = DEFAULT_PAGE
    }

    if (!pageSizeIsValid) {
      setWarning(INVALID_PAGE_SIZE)
      pageSize = DEFAULT_PAGE_SIZE
    }

    // Map UI categories to backend categories
    const backendCaddCategories = filters?.cadd ?
      mapUiCaddToBackend(filters.cadd) : [];
    const backendStabilityCategories = filters?.stability ?
      mapUiStabilityToBackend(filters.stability) : [];

    // page null or 1, no param
    // pageSize null or PAGE_SIZE, no param
    // assembly null or DEFAULT, no param
    const request: MappingRequest = {
      input,
      type: providedType ?? undefined,  // Send user's type hint to backend
      page,
      pageSize,
      assembly: assembly ?? undefined,
      cadd: backendCaddCategories.length > 0 ? backendCaddCategories : undefined,
      am: filters?.am ?? [],
      stability: backendStabilityCategories.length > 0 ? backendStabilityCategories : undefined,
      known: filters?.known,
      pocket: filters?.pocket,
      interact: filters?.interact,
      sort: filters?.sort,
      order: filters?.order,
    };

    getMapping(request)
      .then((response) => {
        if (response.data) {
          // checks each level of response obj hierarchy exists and if inputs is non-empty.
          // if any part of the chain is null or undefined, the entire expr short-circuits
          // returns false.

          if (response.data.content?.inputs?.length > 0) {
            setData(response.data)
            setInputType(response.data.type); // Backend returns resolved type

            // Only update URL if backend resolved a different type than what user provided
            const resolvedType = response.data.type;
            if (resolvedType && resolvedType !== providedType) {
              updatingTypeParam.current = true; // Flag that we're updating
              setSearchParams(prev => {
                const newParams = new URLSearchParams(prev);
                newParams.set('type', resolvedType);
                return newParams;
              });
            }

            viewedRecord(response.data.input, location.pathname + location.search)

            if (response.data.type === 'input_id') {
              const totalItems = response.data.totalItems
              const firstInputLine = totalItems === 1 ?
                response.data.content.inputs[0].inputStr :
                `${response.data.content.inputs[0].inputStr} ...+${totalItems - 1} more `
              setResultTitle(firstInputLine)
            } else {
              setResultTitle(`${input} (${response.data.totalItems} variants)`)
            }
          } else {
            setData(null) // clear prev data
            setWarning(NO_RESULT)
          }
          // if no result warning has been set, the following will override it
          const totalPages = response.data.totalPages ?? 0
          if (page !== DEFAULT_PAGE && page > totalPages) {
            // Handle case where page exceeds totalPages
            setWarning(MAX_PAGE_EXCEEDED.replace("{totalPages}", totalPages.toString()))
            //page = response.data.totalPages
            // navigate to last page?
          }
        } else {
          setData(null) // clear prev data
          setWarning(NO_DATA)
        }
      })
      .catch((err) => {
        setData(null) // clear prev data
        if (err.response) {
          if (err.response?.status === 400) {
            // Backend returns descriptive error for type mismatches
            setWarning(err.response.data || 'Invalid input or type mismatch');
          } else if (err.response.status === 404) { // Not found
            setWarning(NO_RESULT);
          } else {
            setWarning(`Error ${err.response.status}: ${err.message}`);
          }
        } else {
          setWarning(UNEXPECTED_ERR);
        }
      }).finally(() => {
      setLoading(false)
    })
  }, [viewedRecord, location, setSearchParams])

  useEffect(() => {
    // Skip if we just updated the type parameter ourselves
    if (updatingTypeParam.current) {
      updatingTypeParam.current = false;
      return;
    }

    setWarning("");
    if (!input) return;

    const trimmedInput = input.trim();
    const type = searchParams.get('type');
    const providedType = type ? fromString(type) : null;
/*
    // Infer type
    const detectedType = resolve(trimmedInput);

    let finalType: InputType | null = null;

    if (parsedType) {
      if (detectedType && parsedType !== detectedType) {
        setWarning(`Type mismatch: URL says "${parsedType}" but input looks like "${detectedType}". Using detected type.`);
        finalType = detectedType;
      } else {
        finalType = parsedType;
      }
    } else {
      finalType = detectedType;
    }

    if (!finalType) {
      setWarning("Could not determine input type.");
      return;
    }

    setInputType(finalType);

    const normalized = normalize(trimmedInput, finalType);
    setResultTitle(normalized);
    loadData(finalType, input, page, pageSize, assembly, filters);
*/
    setResultTitle(trimmedInput);
    loadData(providedType, trimmedInput, page, pageSize, assembly, filters);
  }, [input, searchParams, page, pageSize, assembly, filters, loadData]) // listening for change in input, and searchParams

  // Update local filters when URL changes
  useEffect(() => {
    setLocalFilters(extractFilters(searchParams));
  }, [searchParams]);

  const handleApplyFilters = () => {
    const newSearchParams = new URLSearchParams(searchParams);

    // Clear existing filter params
    ["page", "annotation", "cadd", "am", "stability", "sort", "order", "known", "pocket", "interact"]
      .forEach(key => newSearchParams.delete(key));

    // Apply new filters
    const normalizedCadd = normalizeFilterValues(localFilters.cadd, VALID_CADD_VALUES);
    const normalizedAm = normalizeFilterValues(localFilters.am, VALID_AM_VALUES);

    // Only add params if not all selected (to keep URLs clean)
    if (normalizedCadd.length > 0 && normalizedCadd.length < 3) {
      normalizedCadd.forEach(val => newSearchParams.append("cadd", val));
    }
    if (normalizedAm.length > 0 && normalizedAm.length < 3) {
      normalizedAm.forEach(val => newSearchParams.append("am", val));
    }

    // diff from cadd/am where all stability categories will still limit results based available prediction
    localFilters.stability.forEach(val => newSearchParams.append("stability", val));

    if (localFilters.known === true) newSearchParams.set("known", "true");
    if (localFilters.pocket === true) newSearchParams.set("pocket", "true");
    if (localFilters.interact === true) newSearchParams.set("interact", "true");
    if (localFilters.sort) newSearchParams.set("sort", localFilters.sort);
    if (localFilters.order) newSearchParams.set("order", localFilters.order);

    const queryString = newSearchParams.toString();
    navigate(`${location.pathname}${queryString ? `?${queryString}` : ''}`);
  };

  document.title = `${resultTitle} | ${TITLE}`

  const shareUrl = `${APP_URL}${location.pathname}${location.search}`

  return <div className="search-results">
    <div>
      <h5 className="page-header">Result <i className="bi bi-chevron-compact-right"></i> {resultTitle}</h5>
      <span className="help-icon">
      <HelpButton title="" content={<HelpContent name="result-page"/>}/>
        </span>
    </div>

    {
      /*
      Page components:
      if data
        && totalPages>1 [pagination]
        [shareResults][viewLegends][downloadResults]
      if warning
        [warning]
      if data (else nothing)
        [resultTable]
      if data && totalPages>1
        [pagination]

      To check: data (null), warning (''), loading (true)
      Order updated:
      - warning reset every time on load
      - loadData
        -- set loading true
        -- if page/Size invalid, set warning
        -- getResult -> set warning if page requested > totalPage and set data if any
        -- finally set loading false

      1. Warning is always displayed at the top of the table. It remains visible even when the table is hidden,
          such as when there are no results to display.
      2. If no data (on first load) and loading, show Loader (not shown when navigating between pages using Next/Prev).
      3. All other conditions will show an appropriate message (warning) e.g. No data
       */
    }

    {data &&
      <div style={{display: 'flex', justifyContent: data.totalPages > 1 ? 'space-between' : 'flex-end', width: '100%'}}>
        {data.totalPages > 1 && <PaginationRow loading={loading} data={data}/>}
        <span style={{alignSelf: 'flex-end'}}>
          <div className="legend-container">
            <ShareLink url={shareUrl} linkText="Share Results"/>
            <Spaces count={2}/>
            <LegendModal/>
            <DownloadModal input={input!} type={inputType!} numPages={(data && data.totalPages) ?? 0}/>
          </div>
      </span>
      </div>}

    {warning && (<div className="result-warning">
      <i className="file-warning bi bi-exclamation-triangle-fill"></i>{' '}
      {warning}
    </div>)}

    {!data && loading && <Loader/>}
    {inputType !== 'input_id' && inputType !== 'variant' && (
      <SearchFilters
        filters={localFilters}
        onFiltersChange={setLocalFilters}
        onApply={handleApplyFilters}
        loading={loading}
        showSorting={true} // Show sorting on results page
      />
    )}

    <ResultTable data={data}/>
    {data && data.totalPages > 1 && <PaginationRow loading={loading} data={data}/>}
  </div>
}

function ResultPage() {
  return <DefaultPageLayout content={<ResultPageContent />}/>
}

export default ResultPage;