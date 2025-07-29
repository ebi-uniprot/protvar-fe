import DefaultPageLayout from "../../layout/DefaultPageLayout";
import LegendModal from "../../modal/LegendModal";
import {useLocation, useParams, useSearchParams} from "react-router-dom";
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
import AdvancedSearch, {SearchFilterParams} from "./AdvancedSearch";
import {extractFilters} from "./SearchFiltersUtils";
import {fromString/*, normalize, resolve*/} from "../../../utills/InputTypeResolver";
import {InputType} from "../../../types/InputType";
import {MappingRequest} from "../../../types/MappingRequest";

const INVALID_PAGE = `The requested page number is invalid or out of range. Displaying page ${DEFAULT_PAGE} by default.`
const INVALID_PAGE_SIZE = `The specified page size is invalid. Using the default page size of ${DEFAULT_PAGE_SIZE} instead.`
const MAX_PAGE_EXCEEDED = `The requested page number exceeds the total number of available pages (total pages: {totalPages}).`
export const NO_DATA = 'No data'
export const NO_RESULT = 'No result to display'
export const UNEXPECTED_ERR = 'An unexpected error occurred'

function ResultPageContent() {
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


    // page null or 1, no param
    // pageSize null or PAGE_SIZE, no param
    // assembly null or DEFAULT, no param
    const request: MappingRequest = {
      input,
      type: providedType ?? undefined,  // Send user's type hint to backend
      page,
      pageSize,
      assembly: assembly ?? undefined,
      cadd: filters?.cadd ?? [],
      am: filters?.am ?? [],
      stability: filters?.stability ?? [],
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
    {inputType !== 'input_id' && inputType !== 'variant' && <AdvancedSearch loading={loading}/>}
    <ResultTable data={data}/>
    {data && data.totalPages > 1 && <PaginationRow loading={loading} data={data}/>}
  </div>
}

function ResultPage() {
  return <DefaultPageLayout content={<ResultPageContent />}/>
}

export default ResultPage;