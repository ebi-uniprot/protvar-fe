import DefaultPageLayout from "../../layout/DefaultPageLayout";
import {LegendContent} from "../../modal/LegendContent";
import ColumnChooser from "./ColumnChooser";
import ViewSwitch from "./ViewSwitch";
import {useLocation, useNavigate, useParams, useSearchParams} from "react-router-dom";
import ResultTable from "./ResultTable";
import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import PaginationRow from "./PaginationRow";
import {DEFAULT_PAGE, DEFAULT_PAGE_SIZE, PERMITTED_PAGE_SIZES} from "../../../constants/const";
import {SESSION_REDIRECT} from "../../../constants/storage";
import {HOME, RESULT} from "../../../constants/BrowserPaths";
import {DownloadPanel} from "../../modal/DownloadPanel";
import {getMapping, singleVariant} from "../../../services/ProtVarService";
import {PagedMappingResponse} from "../../../types/PagedMappingResponse";
import { toast } from '../../toast/toast';

import {ResultRecord} from "../../../types/ResultRecord";
import {useStorage} from "../../../context/StorageContext";
import {APP_URL} from "../../App";
import {HelpButton} from "../../components/help/HelpButton";
import {HelpContent} from "../../components/help/HelpContent";
import {ShareLink} from "../../components/common/ShareLink";
import {usePageMeta} from "../../../hooks/usePageMeta";
import Loader from "../../elements/Loader";
import {AppContext} from "../../App";
import { FILTER_PARAM_KEYS } from "../../components/search/filterParams";
import {
  extractFilters,
  buildFilterParams,
  describeFilters,
  mapUiCaddToBackend, mapUiPopeveToBackend,
  mapUiStabilityToBackend, mapUiAlleleFreqToBackend
} from "../../components/search/filterUtils";
import {parseIdParam} from "../../../utills/InputTypeResolver";
import {effectiveTotalPages, formatTotalCount} from "../../../utills/PaginationFormat";
import {Identifier, IdentifierType, InputType} from "../../../types/InputType";
import {MappingRequest} from "../../../types/MappingRequest";
import SearchFilters, {
  SearchFilterParams
} from "../../components/search/SearchFilters";

const INVALID_PAGE = `The requested page number is invalid or out of range. Displaying page ${DEFAULT_PAGE} by default.`
const INVALID_PAGE_SIZE = `The specified page size is invalid. Using the default page size of ${DEFAULT_PAGE_SIZE} instead.`
const MAX_PAGE_EXCEEDED = `The requested page number exceeds the total number of available pages (total pages: {totalPages}).`
const INVALID_QUERY = 'Invalid or unrecognised query'
export const NO_DATA = 'No data'
export const NO_RESULT = 'No result to display'
export const UNEXPECTED_ERR = 'An unexpected error occurred'

/** A failed load (not an empty result): what the error page says instead of "No results found". */
interface LoadError { title: string; text: string }

function loadErrorOf(err: any, badRequestMsg?: string): LoadError {
  const status: number | undefined = err?.response?.status;
  if (status === 400)
    return { title: "Can't show these results", text: badRequestMsg || 'The request was not valid.' };
  if (status !== undefined && status >= 500)
    return { title: 'Something went wrong',
             text: `The server took too long to respond or hit an error (HTTP ${status}). Filtering or sorting a large `
                 + 'upload for the first time can take a while. Please try again in a moment.' };
  return { title: 'Something went wrong', text: status ? `Error ${status}: ${err.message}` : 'Could not reach the server. Check your connection and try again.' };
}

// Regex used for backward-compat chromosome_protein route parsing
const chromosomeRegex = /^chr([1-9]|1[0-9]|2[0-2]|X|Y|MT)$/;
const proteinAccessionRegex = /^([OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2})$/;
const positionRegex = /^\d+$/;
const positionRangeRegex = /^(\d+)-(\d+)$/;

/**
 * Build the canonical new URL for a deprecated URL pattern.
 * Returns null if the URL is already canonical (no redirect needed).
 */
function buildCanonicalUrl(
  queryType: QueryType | undefined,
  pathname: string,
  searchParams: URLSearchParams,
  param1?: string, param2?: string, param3?: string, param4?: string
): string | null {
  const assembly = searchParams.get('assembly');
  const suffix = (p: URLSearchParams) => p.toString() ? `?${p.toString()}` : '';

  if (queryType === 'chromosome_protein') {
    // Old /:chrXX/:pos[/:ref/:alt] → /g/:XX/:pos[/:ref/:alt]
    if (chromosomeRegex.test(param1 ?? '') && param2) {
      const chr = param1!.substring(3); // strip 'chr' prefix
      const segs = [chr, param2, param3, param4].filter(Boolean).join('/');
      const p = new URLSearchParams();
      if (assembly) p.set('assembly', assembly);
      return `/g/${segs}${suffix(p)}`;
    }
    // Old /:acc/:pos[/:ref/:alt] → /p/:acc/:pos[/:ref/:alt]
    if (proteinAccessionRegex.test(param1 ?? '') && param2) {
      const segs = [param1, param2, param3, param4].filter(Boolean).join('/');
      const p = new URLSearchParams();
      if (assembly) p.set('assembly', assembly);
      return `/p/${segs}${suffix(p)}`;
    }
  }

  if (queryType === 'search') {
    const p = new URLSearchParams();
    // Rename old param names → new short names
    const q = searchParams.get('search') ?? searchParams.get('q');
    const chr = searchParams.get('chromosome');
    const pos = searchParams.get('genomic_position') ?? searchParams.get('protein_position') ?? searchParams.get('position');
    const acc = searchParams.get('accession');
    const ref = searchParams.get('reference_allele') ?? searchParams.get('reference_AA') ?? searchParams.get('ref');
    const alt = searchParams.get('alternative_allele') ?? searchParams.get('variant_AA') ?? searchParams.get('alt');

    if (q) p.set('q', q);
    if (chr) p.set('chromosome', chr);
    if (pos) p.set('position', pos);
    if (acc) p.set('accession', acc);
    if (ref) p.set('ref', ref);
    if (alt) p.set('alt', alt);
    if (assembly) p.set('assembly', assembly);

    const isOldPath = pathname.endsWith('/query');
    const hasOldParams = ['search', 'genomic_position', 'protein_position',
                          'reference_allele', 'alternative_allele', 'reference_AA', 'variant_AA']
                          .some(k => searchParams.has(k));
    if (isOldPath || hasOldParams) {
      return `/search${suffix(p)}`;
    }
  }

  return null; // already canonical
}

export type QueryType = 'search' | 'genomic' | 'protein' | 'chromosome_protein';
export type PageMode = 'query' | 'browse';

export interface ResultPageProps {
  mode?: PageMode;           // explicit override; omit to auto-detect from URL params
  queryType?: QueryType;     // only relevant when mode='query' (path-based routes)
  idType?: IdentifierType;   // set by type-prefixed routes (/gene/:id, /pdb/:id, etc.)
}

// Build "chr pos [ref alt]" query string from parts
function buildQueryString(p1: string, p2: string, p3?: string | null, p4?: string | null): string {
  return `${p1} ${p2}${p3 ? ` ${p3}${p4 ? ` ${p4}` : ''}` : ''}`;
}

function splitFirst(input: string | null): string | undefined {
  if (!input) return undefined;
  return input.split(/[\n,|]/)[0]?.trim() || undefined;
}

function ResultPageContent({ mode: modeProp, queryType, idType }: ResultPageProps) {
  const appState = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  // :input for /:input browse; :id for type-prefixed routes; :param* for query routes
  const { input, id: idParam, param1, param2, param3, param4 } = useParams();
  const [searchParams] = useSearchParams();
  const [inputType, setInputType] = useState<InputType | null>(null);

  // Auto-detect mode when no explicit prop is given (/search route).
  // idParamValues MUST be memoized — searchParams.getAll() returns a new array reference on every
  // render. Without useMemo, the browse effect re-runs after every setResultTitle call (new ref →
  // effect dep changed → setResultTitle again → re-render → new ref → ...) causing the title and
  // data to reload in a tight loop.
  const idParamValues = useMemo(() => searchParams.getAll('id'), [searchParams]);
  const hasQ = !!(searchParams.get('q') || searchParams.get('search') ||
                  searchParams.get('chromosome') || searchParams.get('accession'));
  // /p/:acc/:start-:end → browse mode with position range filter
  const isRangeQuery = queryType === 'protein'
    && proteinAccessionRegex.test(param1 ?? '')
    && positionRangeRegex.test(param2 ?? '');
  const mode: PageMode = isRangeQuery ? 'browse'
                       : modeProp === 'query' ? 'query'
                       : modeProp === 'browse' ? 'browse'
                       : hasQ ? 'query'
                       : 'browse';
  const [resultTitle, setResultTitle] = useState(input)
  const [titleFlash, setTitleFlash] = useState(false);

  const page = parseInt(searchParams.get('page') || `${DEFAULT_PAGE}`, 10);
  const pageSize = parseInt(searchParams.get('pageSize') || `${DEFAULT_PAGE_SIZE}`, 10);
  const assembly = searchParams.get("assembly")
  const filters = useMemo(() => extractFilters(searchParams), [searchParams]);
  const [localFilters, setLocalFilters] = useState<SearchFilterParams>(filters);

  const [data, setData] = useState<PagedMappingResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [warning, setWarning] = useState('')
  const [loadError, setLoadError] = useState<LoadError | null>(null)
  const { touchResult, saveResult, getHistory } = useStorage()
  // An upload is named by the user's label for it in History, else by a short form of its id
  const uploadLabel = useCallback((id: string) =>
    getHistory().find(r => r.id === id)?.name || `Upload ${id.slice(0, 8)}`, [getHistory])
  const resultsTopRef = useRef<HTMLDivElement>(null);
  // De-dupe identical consecutive data loads. Annotation panels keep their
  // open/closed state in the URL (?annotation=…), so toggling one navigates and
  // re-runs the data effects — but with unchanged data inputs. Skipping the
  // refetch when the load key matches avoids a spurious reload + loader flash;
  // a real change (ids/filters/page/assembly/query) yields a new key and loads.
  const lastLoadKeyRef = useRef<string | null>(null);
  // Upload filter/sort being prepared by the BE: progress, and the pending re-poll
  const [preparing, setPreparing] = useState<number | null>(null);
  const [pollNonce, setPollNonce] = useState(0);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollingRef = useRef(false);   // the next browse load is a background poll: don't flip `loading`
  // Poll interval: 2 s first (small builds finish fast), ×1.5 per poll up to 10 s. Progress only moves per
  // 2,000-line chunk, and each poll is a full /mapping request.
  const pollDelayRef = useRef(2000);
  useEffect(() => () => { if (pollTimerRef.current) clearTimeout(pollTimerRef.current); }, []);
  // Track browse identifiers so DownloadPanel and Save button can reference them
  const [currentBrowseIds, setCurrentBrowseIds] = useState<Identifier[] | undefined>()

  // On first load / refresh, smooth-scroll to the top — browsers can restore
  // a stale scroll position on refresh, leaving the user mid-page.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Show redirect toast when we arrive after being redirected from a deprecated URL.
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_REDIRECT)) {
      sessionStorage.removeItem(SESSION_REDIRECT);
      toast.info(
        <><i className="bi bi-arrow-return-left" /> You arrived via a deprecated URL —{' '}
          <a href={`${process.env.PUBLIC_URL}/help#protvar-links`} target="_blank" rel="noopener noreferrer">
            see updated format
          </a>
        </>,
        7000
      );
    }
  }, [location.pathname, location.search]);

  // ── Browse mode loader (POST /mapping) ─────────────────────────────────────
  const loadBrowseData = useCallback((
    options: {
      resultId?: string;    // uploaded result ID → resultId path
      ids?: Identifier[];   // identifier browse — single id, multi-id, or empty (filter-only)
      startPos?: number;     // position range start (for /p/:acc/:start-:end routes)
      endPos?: number;       // position range end
    },
    page: number,
    pageSize: number,
    assembly: string | null,
    filters?: SearchFilterParams
  ) => {
    const loadKey = `browse|${JSON.stringify(options)}|${page}|${pageSize}|${assembly}|${JSON.stringify(filters ?? {})}`;
    if (loadKey === lastLoadKeyRef.current) return;
    lastLoadKeyRef.current = loadKey;
    // A poll while an upload is being prepared stays silent: toggling `loading` swaps the page loader and the
    // filter panel's busy state in and out every couple of seconds, which jumps the layout.
    const isPoll = pollingRef.current;
    pollingRef.current = false;
    if (!isPoll) { setLoading(true); setLoadError(null); pollDelayRef.current = 2000; }

    const pageIsValid = !isNaN(page) && page > 0;
    const pageSizeIsValid = !isNaN(pageSize) && PERMITTED_PAGE_SIZES.includes(pageSize);

    if (!pageIsValid) { setWarning(INVALID_PAGE); page = DEFAULT_PAGE; }
    if (!pageSizeIsValid) { setWarning(INVALID_PAGE_SIZE); pageSize = DEFAULT_PAGE_SIZE; }

    const backendCadd = filters?.cadd ? mapUiCaddToBackend(filters.cadd) : [];
    const backendPopeve = filters?.popeve ? mapUiPopeveToBackend(filters.popeve) : [];
    const backendStability = filters?.stability ? mapUiStabilityToBackend(filters.stability) : [];
    const backendFreq = filters?.freq ? mapUiAlleleFreqToBackend(filters.freq) : [];
    // Browse defaults to known variants (a driver filter); an upload shows all submitted variants unless the
    // user picks "known" — sending known=true by default would filter every upload view.
    const knownVariants = options.resultId
      ? (filters?.variant === 'known' ? true : undefined)
      : (filters?.variant !== 'potential' ? true : undefined);

    const request: MappingRequest = {
      ...options,
      page, pageSize,
      assembly: assembly ?? undefined,
      known: knownVariants,
      ptm: filters?.ptm,
      mutagen: filters?.mutagen,
      domain: filters?.domain,
      binding: filters?.binding,
      actsite: filters?.actsite,
      transmem: filters?.transmem,
      conservationMin: filters?.consMin,
      conservationMax: filters?.consMax,
      diseaseAssociation: filters?.disease,
      alleleFreq: backendFreq.length > 0 ? backendFreq : undefined,
      experimentalModel: filters?.expModel,
      interact: filters?.interact,
      pocket: filters?.pocket,
      stability: backendStability.length > 0 ? backendStability : undefined,
      cadd: backendCadd.length > 0 ? backendCadd : undefined,
      aviMin: filters?.aviMin,
      am: filters?.am ?? [],
      popeve: backendPopeve.length > 0 ? backendPopeve : undefined,
      esm1bMin: filters?.esmMin,
      esm1bMax: filters?.esmMax,
      sort: filters?.sort,
      order: filters?.order,
    };

    if (pollTimerRef.current) { clearTimeout(pollTimerRef.current); pollTimerRef.current = null; }
    getMapping(request)
      .then((response) => {
        if (response.data?.preparing != null) {
          // upload still being prepared for filter/sort: show progress, ask again shortly
          setPreparing(response.data.preparing);
          setData(null);   // the old page doesn't match the new filters
          lastLoadKeyRef.current = null;
          const delay = pollDelayRef.current;
          pollDelayRef.current = Math.min(delay * 1.5, 10000);
          pollTimerRef.current = setTimeout(() => { pollingRef.current = true; setPollNonce(n => n + 1); }, delay);
          return;
        }
        setPreparing(null);
        pollDelayRef.current = 2000;
        if (response.data) {
          if (response.data.content?.inputs?.length > 0) {
            setData(response.data)

            if (options.resultId) {
              // Uploaded result: type is effectively 'input_id'; titled by its name, not by its rows (which
              // change with the filters)
              setInputType('input_id');
              setResultTitle(uploadLabel(options.resultId));
              touchResult(options.resultId, location.pathname + location.search);
            } else {
              // Identifier browse: derive type and label from what we sent
              const sentType = options.ids?.length === 1 ? options.ids[0].type : null;
              setInputType(sentType ?? null);
              setCurrentBrowseIds(options.ids)
              const displayLabel = options.ids?.map(i => i.value).join(', ') ?? '';
              // Only update lastViewed if already saved — browse is not auto-saved
              if (displayLabel) touchResult(displayLabel, location.pathname + location.search);
              setResultTitle(displayLabel);
              setTitleFlash(true);
              setTimeout(() => setTitleFlash(false), 600);
            }
          } else {
            setData(null); setWarning(NO_RESULT)
          }
          const totalPages = effectiveTotalPages(response.data)
          if (totalPages != null && page !== DEFAULT_PAGE && page > totalPages) {
            setWarning(MAX_PAGE_EXCEEDED.replace("{totalPages}", totalPages.toString()))
          }
        } else {
          setData(null); setWarning(NO_DATA)
        }
      })
      .catch((err) => {
        setData(null)
        setPreparing(null)
        if (err.response) {
          if (err.response?.status === 400) {
            const errData = err.response.data;
            let msg: string;
            if (typeof errData === 'string') {
              msg = errData;
            } else if (errData && typeof errData === 'object') {
              // BE returns Map<String,String> for both validation and enum parse errors.
              // Generic "error" / "message" keys carry a user-facing sentence and
              // shouldn't be prefixed; field-specific keys (e.g. "cadd") get the
              // "field: detail" formatting so the user can locate the bad input.
              const entries = Object.entries(errData as Record<string, string>);
              msg = entries.map(([field, detail]) =>
                (field === 'error' || field === 'message') ? detail : `${field}: ${detail}`
              ).join('; ') || 'Invalid input or type mismatch';
            } else {
              msg = 'Invalid input or type mismatch';
            }
            setWarning(msg);
            setLoadError(loadErrorOf(err, msg));
          } else if (err.response.status === 404) {
            setWarning(NO_RESULT);
          } else {
            setWarning(`Error ${err.response.status}: ${err.message}`);
            setLoadError(loadErrorOf(err));
          }
        } else {
          setWarning(UNEXPECTED_ERR);
          setLoadError(loadErrorOf(err));
        }
      }).finally(() => setLoading(false))
  }, [touchResult, location, uploadLabel])

  // ── Query mode loader (GET /mapping?input=) ─────────────────────────────────
  const loadQueryData = useCallback((q: string, assembly: string | null) => {
    const loadKey = `query|${q}|${assembly}`;
    if (loadKey === lastLoadKeyRef.current) return;
    lastLoadKeyRef.current = loadKey;
    setLoading(true)
    setLoadError(null)
    singleVariant(q, assembly ?? undefined)
      .then((response) => {
        if (response.data?.content?.inputs?.length > 0) {
          setData(response.data)
          setInputType('variant')
        } else {
          setData(null); setWarning(NO_RESULT)
        }
      })
      .catch((err) => {
        setData(null)
        if (err.response?.status === 404) {
          setWarning(NO_RESULT)
        } else {
          setWarning(err.response ? `Error ${err.response.status}: ${err.message}` : UNEXPECTED_ERR)
          setLoadError(loadErrorOf(err))
        }
      }).finally(() => setLoading(false))
  }, [])

  // ── Parse URL into a query string for query mode ────────────────────────────
  const parseQueryInput = useCallback((): string | null => {
    const ref = searchParams.get('ref') || searchParams.get('reference_allele') || searchParams.get('reference_AA');
    const alt = searchParams.get('alt') || searchParams.get('alternative_allele') || searchParams.get('variant_AA');
    const pos = searchParams.get('position') || searchParams.get('genomic_position') || searchParams.get('protein_position');

    if (queryType === 'search') {
      const freeText = searchParams.get('q') || searchParams.get('search');
      if (freeText) return splitFirst(freeText) ?? null;
      const chr = searchParams.get('chromosome');
      const acc = searchParams.get('accession');
      if (chr && pos) return buildQueryString(chr, pos, ref, alt);
      if (acc && pos) return buildQueryString(acc, pos, ref, alt);
    } else if (queryType === 'genomic' && param1 && positionRegex.test(param2 ?? '')) {
      return buildQueryString(param1, param2!, param3, param4);
    } else if (queryType === 'protein' && proteinAccessionRegex.test(param1 ?? '') && positionRegex.test(param2 ?? '')) {
      return buildQueryString(param1!, param2!, param3, param4);
    } else if (queryType === 'chromosome_protein') {
      if (chromosomeRegex.test(param1 ?? '') && positionRegex.test(param2 ?? ''))
        return buildQueryString(param1!.substring(3), param2!, param3, param4);
      if (proteinAccessionRegex.test(param1 ?? '') && positionRegex.test(param2 ?? ''))
        return buildQueryString(param1!, param2!, param3, param4);
    }
    return null;
  }, [queryType, searchParams, param1, param2, param3, param4])

  // ── Query mode effect ───────────────────────────────────────────────────────
  useEffect(() => {
    if (mode !== 'query') return;
    setWarning('')

    // Redirect deprecated URLs to canonical form before loading
    const canonicalUrl = buildCanonicalUrl(queryType, location.pathname, searchParams, param1, param2, param3, param4);
    if (canonicalUrl) {
      sessionStorage.setItem(SESSION_REDIRECT, '1');
      navigate(canonicalUrl, { replace: true });
      return; // navigation triggers re-render with the new URL
    }

    const q = parseQueryInput();
    if (!q) { setWarning(INVALID_QUERY); setLoading(false); return; }
    setResultTitle(q);
    loadQueryData(q, assembly);
  }, [mode, queryType, location.pathname, searchParams, param1, param2, param3, param4, parseQueryInput, assembly, loadQueryData, navigate, hasQ])

  // ── Browse mode effect ──────────────────────────────────────────────────────
  useEffect(() => {
    if (mode !== 'browse') return;
    setWarning('');

    if (isRangeQuery && param1 && param2) {
      // /p/:acc/:start-:end — protein position range browse
      const match = positionRangeRegex.exec(param2)!;
      const startPos = parseInt(match[1], 10);
      const endPos = parseInt(match[2], 10);
      const [from, to] = startPos <= endPos ? [startPos, endPos] : [endPos, startPos];
      setResultTitle(`${param1} ${from}–${to}`);
      loadBrowseData({ ids: [{ type: 'uniprot', value: param1 }], startPos: from, endPos: to }, page, pageSize, assembly, filters);

    } else if (idType && idParam) {
      // Type-prefixed single-ID route: /gene/:id, /pdb/:id, etc.
      const trimmed = idParam.trim();
      setResultTitle(trimmed);
      loadBrowseData({ ids: [{ type: idType, value: trimmed }] }, page, pageSize, assembly, filters);

    } else if (idParamValues.length > 0) {
      // Multi-identifier browse: /search?id=...&id=...
      const ids = idParamValues.map(parseIdParam);
      const label = ids.map(i => i.value).join(', ');
      setResultTitle(label);
      loadBrowseData({ ids }, page, pageSize, assembly, filters);

    } else if (input) {
      const trimmedInput = input.trim();
      setResultTitle(trimmedInput);
      if (location.pathname.startsWith(RESULT + '/')) {
        // /result/:id — uploaded result, use resultId path
        setResultTitle(uploadLabel(trimmedInput));
        loadBrowseData({ resultId: trimmedInput }, page, pageSize, assembly, filters);
      } else {
        // /:accession — UniProt accession or other identifier, use ids path
        loadBrowseData({ ids: [parseIdParam(trimmedInput)] }, page, pageSize, assembly, filters);
      }

    } else {
      // Filter-only browse: /search with no q= and no id=
      // Empty title — header shows just the "Browse" context label, and the
      // count subtitle + active filters convey what's being shown.
      setResultTitle('');
      loadBrowseData({}, page, pageSize, assembly, filters);
    }
  }, [mode, isRangeQuery, param1, param2, idType, idParam, idParamValues, input, location.pathname, page, pageSize, assembly, filters, loadBrowseData, pollNonce, uploadLabel])

  useEffect(() => {
    setLocalFilters(extractFilters(searchParams));
  }, [searchParams]);


  const handleApplyFilters = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    FILTER_PARAM_KEYS.forEach(key => newSearchParams.delete(key));
    buildFilterParams(localFilters).forEach((value, key) => newSearchParams.append(key, value));
    // Reset to page 1 when filters change
    newSearchParams.delete('page');
    const queryString = newSearchParams.toString();
    navigate(`${location.pathname}${queryString ? `?${queryString}` : ''}`);
    setTimeout(() => resultsTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const isQueryMode = mode === 'query';
  const isFilterOnly = mode === 'browse' && !idType && !idParam && idParamValues.length === 0 && !input;
  const isBrowseIdentifier = mode === 'browse' && !isFilterOnly &&
    !(input && location.pathname.startsWith(RESULT + '/'));
  const shareUrl = `${APP_URL}${location.pathname}${location.search}`
  const helpName = isQueryMode ? 'protvar-links' : 'results';

  // Determine the browse identifier used as the history record id
  const browseHistoryId = isBrowseIdentifier
    ? (currentBrowseIds?.map(i => i.value).join(', ') ?? input ?? undefined)
    : undefined

  const isSaved = browseHistoryId
    ? getHistory().some(r => r.id === browseHistoryId)
    : false

  const handleSaveBrowse = () => {
    if (!browseHistoryId) return
    const sentType = currentBrowseIds?.length === 1 ? currentBrowseIds[0].type : undefined
    const record: ResultRecord = {
      id: browseHistoryId,
      type: 'browse',
      inputType: sentType ?? (idType as any) ?? undefined,
      url: location.pathname + location.search,
      savedAt: new Date().toISOString(),
    }
    saveResult(record)
  }

  // Context label for the page header — tells the user what kind of input they are looking at.
  //
  // Query mode:
  //   'genomic'  (/g/:chr/:pos)          → "Genomic"
  //   'protein'  (/p/:acc/:pos)          → "Protein"
  //   'search'   (/search?q=)            → "Variant"
  //
  // Browse mode:
  //   /result/:id (uploaded variants)    → "Results"   (detected via pathname, not API response)
  //   /:accession (bare UniProt browse)  → "UniProt"
  //   /gene/:id                          → "Gene"
  //   /pdb/:id                           → "PDB"
  //   /ensembl/:id                       → "Ensembl"
  //   /refseq/:id                        → "RefSeq"
  //   /search?id=…&id=…  (multi-id)      → "Browse"
  //   /search?<filters>  (no id)         → "Browse"
  //
  // Note: filters can be combined with any browse context (single id, multi-id, or no id).
  // "Browse" as a label covers all identifier-based and filter-driven cases.
  function getContextLabel(): string {
    if (isRangeQuery) return 'Protein';
    if (isQueryMode) {
      if (queryType === 'genomic') return 'Genomic';
      if (queryType === 'protein') return 'Protein';
      return 'Variant'; // 'search' (q=) or chromosome_protein (redirect, rarely seen)
    }
    // /result/:id — uploaded multi-variant results (detected by pathname before API responds)
    if (input && location.pathname.startsWith(RESULT + '/')) return 'Results';
    // Type-prefixed single-identifier browse
    if (idType) {
      const labels: Record<string, string> = {
        uniprot: 'UniProt', gene: 'Gene', pdb: 'PDB', ensembl: 'Ensembl', refseq: 'RefSeq',
      };
      return labels[idType] ?? idType;
    }
    // Bare /:accession browse (always UniProt)
    if (input) return 'UniProt';
    // Multi-identifier or no-identifier (filters only) — both are generic browse
    return 'Browse';
  }

  const sep = <i className="bi bi-chevron-compact-right"></i>;
  const contextLabel = getContextLabel();
  // Only show the separator + title when there's actually a title to show.
  // For filter-only browse, resultTitle is empty — render just the context label.
  const titleSuffix = resultTitle ? <> {sep} {resultTitle}</> : null;
  const pageTitle = isQueryMode
    ? <>{contextLabel}{titleSuffix}</>
    : <span className={titleFlash ? 'title-sparkle' : ''}>{contextLabel}{titleSuffix}</span>;

  // ── SEO/social meta ─────────────────────────────────────────────────────────
  // <title> is "{subject} | EMBL-EBI ProtVar" — subject-first, dropping the
  // breadcrumb's context label. Subject = resultTitle, except the composite
  // browse views (multi-id, filter-only) which summarise to "first few + N more".
  // Index the linkable resources (one identifier or one variant); noindex the
  // constructed/transient views (/result/{id}, composite browse) and no-data
  // URLs (else flagged as Soft 404s).
  const isUploadedResult = location.pathname.startsWith(RESULT);
  const isComposite = idParamValues.length > 1 || isFilterOnly;
  const TITLE_LIST_MAX = 3;
  const summarise = (items: string[]): string =>
    items.slice(0, TITLE_LIST_MAX).join(', ')
      + (items.length > TITLE_LIST_MAX ? ` +${items.length - TITLE_LIST_MAX} more` : '');
  let subject: string;
  if (idParamValues.length > 1) {
    subject = summarise(idParamValues.map(v => parseIdParam(v).value));
  } else if (isFilterOnly) {
    subject = summarise(describeFilters(filters).map(c => c.label));
  } else {
    subject = (resultTitle ?? '').trim();
  }
  // Description only on single-subject pages (composite views have no subject).
  const isSingleSubject = !isUploadedResult && !isComposite && !!subject;
  // Canonical minus filter + page params, so filtered/paginated views
  // (/gene/TP53?am=high&page=2) fold onto the base resource (/gene/TP53).
  const canonicalParams = new URLSearchParams(location.search);
  FILTER_PARAM_KEYS.forEach(key => canonicalParams.delete(key));
  canonicalParams.delete('page');
  const canonicalQuery = canonicalParams.toString();
  usePageMeta({
    title: subject ? `${subject} | EMBL-EBI ProtVar` : `${contextLabel} | EMBL-EBI ProtVar`,
    description: isSingleSubject
      ? `Structural, functional, population and disease annotations for ${subject} — ProtVar.`
      : undefined,
    canonical: isUploadedResult
      ? undefined
      : `${APP_URL}${location.pathname}${canonicalQuery ? `?${canonicalQuery}` : ''}`,
    noindex: isUploadedResult || isComposite || (!loading && !data),
  });

  // No data (bad/unresolvable id or unrecognised query): a centred "not found"
  // like the error/404 pages, not an empty toolbar + table. Already noindex.
  if (!loading && !data && preparing == null && loadError) {
    return (
      <div className="error-page">
        <i className="bi bi-exclamation-triangle error-page-icon" />
        <h4 className="error-page-title">{loadError.title}</h4>
        <p className="error-page-text">{loadError.text}</p>
        <div className="error-page-actions">
          <button className="btn btn-primary" onClick={() => window.location.reload()}>Try again</button>
          <button className="btn btn-secondary" onClick={() => navigate(HOME)}>Back to search</button>
        </div>
      </div>
    );
  }

  if (!loading && !data && preparing == null) {
    const isInvalid = warning === INVALID_QUERY;
    return (
      <div className="error-page">
        <i className={`bi ${isInvalid ? 'bi-question-circle' : 'bi-search'} error-page-icon`} />
        <h4 className="error-page-title">{isInvalid ? 'Unrecognised query' : 'No results found'}</h4>
        <p className="error-page-text">
          {isInvalid
            ? "We couldn't recognise that query. Check the format and try a new search."
            : subject
              ? <>We couldn&apos;t find variant data for <strong>{subject}</strong>. Double-check the identifier, or try a new search.</>
              : "We couldn't find any matching variant data. Try a different search."}
        </p>
        <div className="error-page-actions">
          <button className="btn btn-primary" onClick={() => navigate(HOME)}>Back to search</button>
        </div>
      </div>
    );
  }

  return <div>
    <div className="page-header-row" ref={resultsTopRef}>
      <h5 className="page-header">{pageTitle}</h5>
      <HelpButton title="" content={<HelpContent name={helpName}/>}/>
    </div>
    {data && !isQueryMode && (
      <div className="page-header-count">{
        data.totalInputs != null
          // an upload counts its input lines; with filters on, out of the whole upload
          ? (describeFilters(filters, true).length > 0
              ? `${formatTotalCount(data)} of ${data.totalInputs.toLocaleString()} submitted inputs match the filters`
              : `${data.totalInputs.toLocaleString()} submitted inputs`)
          : `${formatTotalCount(data)} variants`
      }</div>
    )}

    {/* ── Toolbar ── */}
    <div className="result-toolbar">
      {data && (
        <label className="toggle-switch" title="Toggle between ProtVar standardised and original source colours">
          <input type="checkbox" checked={appState.stdColor} onChange={() => appState.updateState("stdColor", !appState.stdColor)} />
          <span className="toggle-track"><span className="toggle-thumb"></span></span>
          <span className="toggle-label">ProtVar colours</span>
        </label>
      )}
      {data && (
        <div className="result-toolbar-actions">
          <ShareLink url={shareUrl} linkText="Share" />
          {isBrowseIdentifier && (
            <i
              className={`bi ${isSaved ? 'bi-bookmark-fill' : 'bi-bookmark'} icon-btn`}
              title={isSaved ? 'Saved to history' : 'Save to history'}
              onClick={handleSaveBrowse}
            > {isSaved ? 'Saved' : 'Save'}</i>
          )}
          <i className="bi bi-circle-half icon-btn"
             title="View colour legends"
             onClick={() => appState.updateState("drawer", <LegendContent />)}
          > Legends</i>
          <button
            className="btn btn-brand"
            title="Download results"
            onClick={() => appState.updateState("drawer",
              <DownloadPanel
                q={isQueryMode ? (resultTitle ?? undefined) : undefined}
                resultId={!isQueryMode && inputType === 'input_id' ? input ?? undefined : undefined}
                ids={!isQueryMode && inputType !== 'input_id' ? currentBrowseIds : undefined}
                historyId={browseHistoryId}
                numPages={isQueryMode ? 1 : (data?.totalPages ?? 0)} />)}
          >
            <i className="bi bi-download" /> Download
          </button>
        </div>
      )}
    </div>

    {/* ── Response-level messages from API ── */}
    {(data?.content.messages?.length ?? 0) > 0 && (
      <div className="result-notices">
        {data!.content.messages!.map((message, i) => (
          <div key={`response-msg-${i}`} className={`result-notice result-notice--${message.type.toLowerCase()}`}>
            {message.text}
          </div>
        ))}
      </div>
    )}

    {/* ── Warnings ── */}
    {warning && (
      <div className="result-notices">
        <div className="result-notice result-notice--warn">{warning}</div>
      </div>
    )}

    {!data && loading && <Loader/>}

    {preparing != null && (
      <div className="result-notices">
        <div className="result-notice result-notice--info">
          Preparing filters for your upload… {preparing}%. Large uploads take a few minutes; this page updates
          by itself.
        </div>
      </div>
    )}

    {/* ── Filters (browse, filter-only and uploaded results; not for a single variant) ── */}
    {(!isQueryMode || isFilterOnly) && inputType !== 'variant' && (
      <SearchFilters
        filters={localFilters}
        appliedFilters={filters}
        onFiltersChange={setLocalFilters}
        onApply={handleApplyFilters}
        loading={loading || preparing != null}
        showSorting={true}
        upload={isUploadedResult}
      />
    )}

    {!isQueryMode && data && (data.totalPages > 1 || data.page > 1 || !data.last) && (
      <div className="result-pre-table">
        <PaginationRow loading={loading} data={data}/>
      </div>
    )}
    {data && (
      <div className="result-table-actions">
        <ViewSwitch />
        <button className="btn btn-secondary columns-btn" title="Choose which columns to show"
                onClick={() => appState.updateState("drawer", <ColumnChooser />)}>
          <i className="bi bi-layout-three-columns" /> Columns
        </button>
      </div>
    )}
    <div className="result-table-wrap">
      {loading && data && (
        <div className="result-table-loading" aria-live="polite" aria-label="Updating results">
          <Loader className="result-table-loader"/>
        </div>
      )}
      <ResultTable key={input} data={data} lazyIsoforms={isFilterOnly}/>
    </div>
    {!isQueryMode && data && (data.totalPages > 1 || data.page > 1 || !data.last) && (
      <div className="result-pre-table result-post-table">
        <PaginationRow loading={loading} data={data}/>
      </div>
    )}

  </div>
}

function ResultPage(props: ResultPageProps) {
  return <DefaultPageLayout content={<ResultPageContent {...props}/>}/>
}

export default ResultPage;
