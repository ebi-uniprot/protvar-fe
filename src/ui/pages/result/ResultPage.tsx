import DefaultPageLayout from "../../layout/DefaultPageLayout";
import {LegendContent} from "../../modal/LegendModal";
import {useLocation, useNavigate, useParams, useSearchParams} from "react-router-dom";
import ResultTable from "./ResultTable";
import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import PaginationRow from "./PaginationRow";
import {DEFAULT_PAGE, DEFAULT_PAGE_SIZE, LOCAL_RESULTS, PERMITTED_PAGE_SIZES, TITLE} from "../../../constants/const";
import {DownloadContent} from "../../modal/DownloadModal";
import {getMapping} from "../../../services/ProtVarService";
import {PagedMappingResponse} from "../../../types/PagedMappingResponse";
import "./ResultPage.css";

import {ResultRecord} from "../../../types/ResultRecord";
import useLocalStorage from "../../../hooks/useLocalStorage";
import {APP_URL} from "../../App";
import {HelpButton} from "../../components/help/HelpButton";
import {HelpContent} from "../../components/help/HelpContent";
import {ShareLink} from "../../components/common/ShareLink";
import Loader from "../../elements/Loader";
import {AppContext} from "../../App";
import { FILTER_PARAM_KEYS } from "../../components/search/filterParams";
import {
  extractFilters,
  buildFilterParams,
  mapUiCaddToBackend, mapUiPopeveToBackend,
  mapUiStabilityToBackend, mapUiAlleleFreqToBackend
} from "../../components/search/filterUtils";
import {fromString/*, normalize, resolve*/} from "../../../utills/InputTypeResolver";
import {InputType} from "../../../types/InputType";
import {MappingRequest} from "../../../types/MappingRequest";
import SearchFilters, {
  SearchFilterParams
} from "../../components/search/SearchFilters";

const INVALID_PAGE = `The requested page number is invalid or out of range. Displaying page ${DEFAULT_PAGE} by default.`
const INVALID_PAGE_SIZE = `The specified page size is invalid. Using the default page size of ${DEFAULT_PAGE_SIZE} instead.`
const MAX_PAGE_EXCEEDED = `The requested page number exceeds the total number of available pages (total pages: {totalPages}).`
export const NO_DATA = 'No data'
export const NO_RESULT = 'No result to display'
export const UNEXPECTED_ERR = 'An unexpected error occurred'

function ResultPageContent() {
  const appState = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { input } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputType, setInputType] = useState<InputType | null>(null);
  const [resultTitle, setResultTitle] = useState(input)
  const [titleFlash, setTitleFlash] = useState(false);

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
  const resultsTopRef = useRef<HTMLDivElement>(null);

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
    const backendPopeveCategories = filters?.popeve ?
      mapUiPopeveToBackend(filters.popeve) : [];  // NEW: Map popEVE
    const backendStabilityCategories = filters?.stability ?
      mapUiStabilityToBackend(filters.stability) : [];
    const backendAlleleFreqCategories = filters?.freq ?
      mapUiAlleleFreqToBackend(filters.freq) : [];

    // Determine 'known' boolean from variantType
    // Default is 'known' (true), unless explicitly set to 'potential' (undefined/false)
    const knownVariants = filters?.variant !== 'potential' ? true : undefined;

    // page null or 1, no param
    // pageSize null or PAGE_SIZE, no param
    // assembly null or DEFAULT, no param
    const request: MappingRequest = {
      input,
      type: providedType ?? undefined,  // Send user's type hint to backend
      page,
      pageSize,
      assembly: assembly ?? undefined,
      // Variant Type (mapped to existing 'known' backend field)
      known: knownVariants,

      // Functional (not yet implemented in backend - will be added later)
      ptm: filters?.ptm,
      mutagenesis: filters?.mutagen,
      conservationMin: filters?.consMin,
      conservationMax: filters?.consMax,
      functionalDomain: filters?.domain,

      // Population (not yet implemented in backend - will be added later)
      diseaseAssociation: filters?.disease,
      alleleFreq: backendAlleleFreqCategories.length > 0 ? backendAlleleFreqCategories : undefined,

      // Structural
      experimentalModel: filters?.expModel,
      interact: filters?.interact,
      pocket: filters?.pocket,
      stability: backendStabilityCategories.length > 0 ? backendStabilityCategories : undefined,

      // Consequence
      cadd: backendCaddCategories.length > 0 ? backendCaddCategories : undefined,
      am: filters?.am ?? [],
      popeve: backendPopeveCategories.length > 0 ? backendPopeveCategories : undefined,
      esm1bMin: filters?.esmMin,
      esm1bMax: filters?.esmMax,

      // Sorting
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
              // Trigger flash animation
              setTitleFlash(true);
              setTimeout(() => setTitleFlash(false), 600);
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

    // Clear existing filter params using the centralized list
    FILTER_PARAM_KEYS.forEach(key => newSearchParams.delete(key));

    // Use shared utility to build filter params
    const filterParams = buildFilterParams(localFilters);

    // Append all filter params to the cleared search params
    filterParams.forEach((value, key) => {
      newSearchParams.append(key, value);
    });

    const queryString = newSearchParams.toString();
    navigate(`${location.pathname}${queryString ? `?${queryString}` : ''}`);

    // Scroll to the top of the results section after navigation
    setTimeout(() => {
      resultsTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  useEffect(() => {
    document.title = `${resultTitle} | ${TITLE}`;
  }, [resultTitle]);

  const shareUrl = `${APP_URL}${location.pathname}${location.search}`

  return <div className="search-results">
    <div ref={resultsTopRef}>
      <h5 className="page-header">
        <span className={titleFlash ? 'title-sparkle' : ''}>Result <i className="bi bi-chevron-compact-right"></i> {resultTitle}</span>
      </h5>
      <span className="help-icon">
        <HelpButton title="" content={<HelpContent name="result-page"/>}/>
      </span>
    </div>

    {/* ── Response-level messages from API (just under heading) ── */}
    {(data?.content.messages?.length ?? 0) > 0 && (
      <div className="result-notices">
        {data!.content.messages!.map((message, i) => (
          <div key={`response-msg-${i}`} className={`result-notice result-notice--${message.type.toLowerCase()}`}>
            {message.text}
          </div>
        ))}
      </div>
    )}

    {/* ── Toolbar: pagination (left) | actions (right) ── */}
    <div className="result-toolbar">
      <div>
        {data && data.totalPages > 1 && <PaginationRow loading={loading} data={data}/>}
      </div>
      {data && (
        <div className="result-toolbar-actions">
          <ShareLink url={shareUrl} linkText="Share" />
          <span className="toolbar-divider" />
          <i className="bi bi-circle-half icon-btn"
             title="View colour legends"
             onClick={() => appState.updateState("drawer", <LegendContent />)}
          > Legends</i>
          <i className="bi bi-download icon-btn"
             title="Download results"
             onClick={() => appState.updateState("drawer", <DownloadContent input={input!} type={inputType!} numPages={(data && data.totalPages) ?? 0} />)}
          > Download</i>
        </div>
      )}
    </div>

    {/* ── Colour toggle row ── */}
    {data && (
      <div className="result-colour-row">
        <label className="toggle-switch" title="Toggle between ProtVar standardised and original source colours">
          <input type="checkbox" checked={appState.stdColor} onChange={() => appState.updateState("stdColor", !appState.stdColor)} />
          <span className="toggle-track"><span className="toggle-thumb"></span></span>
          <span className="toggle-label">ProtVar colours</span>
        </label>
      </div>
    )}

    {/* ── Page-level warning (invalid page, no data, etc.) ── */}
    {warning && (
      <div className="result-notices">
        <div className="result-notice result-notice--warn">{warning}</div>
      </div>
    )}

    {!data && loading && <Loader/>}
    {inputType !== 'input_id' && inputType !== 'variant' && (
      <SearchFilters
        filters={localFilters}
        onFiltersChange={setLocalFilters} // todo: reset page to 1!
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