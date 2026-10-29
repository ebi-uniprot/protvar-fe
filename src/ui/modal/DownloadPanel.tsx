import {useCallback, useContext, useMemo, useState} from 'react';
import Button from '../elements/form/Button';
import {emailValidate} from '../../utills/Validator';
import {DownloadRecord, recordFromResponse} from "../../types/DownloadRecord";
import Notify from "../elements/Notify";
import {downloadPost} from "../../services/ProtVarService";
import {useStorage} from "../../hooks/useStorage";
import {useLocation, useSearchParams} from "react-router-dom";
import {DownloadRequest} from "../../types/DownloadRequest";
import {Identifier} from "../../types/InputType";
import {autoJobName} from "../../utills/autoJobName";
import {describeFilters, extractFilters, filterRequest} from "../components/search/filterUtils";
import {AppContext} from "../App";
import {PagedMappingResponse} from "../../types/PagedMappingResponse";
import {SearchFilterParams} from "../components/search/SearchFilters";
import {isTotalCapped, isTotalUnknown} from "../../utills/PaginationFormat";

interface DownloadForm {
  email: string
  jobName: string
  fun: boolean
  pop: boolean
  str: boolean
}

export interface DownloadPanelProps {
  // One of the following identifies what to download:
  q?: string;          // single variant query
  resultId?: string;   // uploaded result ID
  ids?: Identifier[];  // identifier browse
  // Optional: links the download record back to a history entry
  historyId?: string;
  // What the summary shows: the result's name, its filters and sort, and its counts (not for a single variant)
  subject?: string;
  filters?: SearchFilterParams;
  result?: PagedMappingResponse;
}

// Full downloads are capped at this many variants (BE DownloadController.MAX_FULL_DOWNLOAD_ROWS)
const MAX_FULL_DOWNLOAD = 100_000;

const SORT_LABELS: Record<string, string> = {
  cadd: 'CADD', avi: 'AVI', am: 'AlphaMissense', popeve: 'popEVE', esm1b: 'ESM1b',
};

// Why "All pages" can't be downloaded, or null when it can. The BE refuses the same cases.
const allPagesBlocked = (result?: PagedMappingResponse): string | null => {
  if (!result) return null;
  if (isTotalUnknown(result))
    return 'The number of variants could not be counted in time. Refine the filters, or reload the page and try again.';
  if (isTotalCapped(result))
    return `More than ${result.totalCap!.toLocaleString()} variants. Refine the filters to download them all.`;
  if (result.totalItems > MAX_FULL_DOWNLOAD)
    return `Too many for one file (limit ${MAX_FULL_DOWNLOAD.toLocaleString()}). Refine the filters, or use the FTP files.`;
  return null;
};

export function DownloadPanel(props: DownloadPanelProps) {
  const appState = useContext(AppContext);
  const { addDownload, getHistory } = useStorage()
  const [errorMsg, setErrorMsg] = useState("")

  const location = useLocation();
  const [searchParams] = useSearchParams();
  const initialForm: DownloadForm = { email: "", jobName: "", fun: true, pop: true, str: true }
  const [form, setForm] = useState<DownloadForm>(initialForm)
  const [annotations, setAnnotations] = useState<boolean>(true)
  const blocked = allPagesBlocked(props.result)
  const [currPage, setCurrPage] = useState<boolean>(!!blocked)
  const upload = !!props.resultId
  const chips = props.filters ? describeFilters(props.filters, upload) : []
  const sort = props.filters?.sort

  // a name the user gave this result (Activity) leads the suggested job name
  const savedName = useMemo(() => {
    const historyId = props.historyId ?? props.resultId
    return historyId ? getHistory().find(r => r.id === historyId)?.name : undefined
  }, [props.historyId, props.resultId, getHistory])
  const filterOnly = !props.q && !props.resultId && !props.ids?.length
  const jobNamePlaceholder = autoJobName({
    subject: props.q?.trim() || savedName || (filterOnly ? undefined : props.subject ?? props.ids?.map(id => id.value).join(', ')),
    filters: chips.map(c => c.label),
    page: currPage ? props.result?.page ?? parseInt(searchParams.get('page') ?? '1') : undefined,
  })

  const updateForm = useCallback((key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleAnnotations = (event: React.ChangeEvent<HTMLInputElement>) => {
    const withAnnotations = event.target.value === 'withAnnotations';
    setAnnotations(withAnnotations);
    setForm(prev => ({ ...prev, fun: withAnnotations, pop: withAnnotations, str: withAnnotations }));
  }

  const handleSucc = (downloadRec: DownloadRecord) => {
    addDownload(downloadRec)
    const label = downloadRec.jobName || downloadRec.id.substring(0, 8)
    Notify.sucs(`Job "${label}" submitted. Check the Downloads page.`)
  }

  const handleErr = (err: any) => {
    const serverMsg: string | undefined = err?.response?.data?.error
    if (serverMsg) {
      Notify.err(serverMsg)
    } else {
      Notify.err(`Job ${form.jobName || jobNamePlaceholder} failed. Please try again.`)
    }
  }

  const handleSubmit = () => {
    const err = emailValidate(form.email)
    if (err) { setErrorMsg(err); return; }

    appState.updateState("drawer", undefined);

    const page = currPage ? (searchParams.get('page') ?? "1") : null
    const pageSize = page ? searchParams.get('pageSize') : null
    const assembly = searchParams.get('assembly')
    const jobName = form.jobName || jobNamePlaceholder

    const request: DownloadRequest = {
      // the filters and sort on screen, so the file matches the result page (not for a single variant query)
      ...(props.q ? {} : filterRequest(extractFilters(searchParams), !!props.resultId)),
      q: props.q,
      resultId: props.resultId,
      ids: props.ids,
      email: form.email,
      jobName,
      function: form.fun ?? false,
      population: form.pop ?? false,
      structure: form.str ?? false,
      page: page ? parseInt(page) : null,
      pageSize: pageSize ? parseInt(pageSize) : null,
      assembly: props.q
        ? (assembly === 'grch37' ? 'grch37' : 'grch38')
        : assembly ?? null,
      full: !currPage,
    };

    downloadPost(request)
      .then((response) => {
        const clientTime = new Date().toISOString()
        let downloadRecord: DownloadRecord = recordFromResponse(response.data, clientTime)
        downloadRecord.page = page ? parseInt(page) : undefined
        downloadRecord.pageSize = pageSize ? parseInt(pageSize) : undefined
        downloadRecord.assembly = assembly ?? undefined
        downloadRecord.fun = form.fun
        downloadRecord.pop = form.pop
        downloadRecord.str = form.str
        downloadRecord.resultUrl = location.pathname + location.search
        downloadRecord.resultId = props.historyId ?? props.resultId
        handleSucc(downloadRecord)
      })
      .catch(handleErr);
  };

  return (
    <div className="dp">
      <h6 className="dp-title">Download</h6>

      {(props.subject || props.q) && (
        <dl className="dp-summary">
          <dt className="dp-summary-subject">{props.subject || props.q}</dt>
          {props.filters && (
            <>
              <dt>Filters</dt>
              <dd>{chips.length ? chips.map(c => c.label).join(' · ') : 'None'}</dd>
              {sort && (
                <>
                  <dt>Sort</dt>
                  <dd>{SORT_LABELS[sort] ?? sort}, {props.filters.order === 'asc' ? 'ascending' : 'descending'}</dd>
                </>
              )}
            </>
          )}
        </dl>
      )}

      <div className="dp-options">
        <div className="dp-group">
          <div className="dp-group-label">Output</div>
          <label className="dp-option">
            <input type="radio" name="annotations" value="withAnnotations"
              checked={annotations} onChange={toggleAnnotations} />
            With annotations
          </label>
          <label className="dp-option">
            <input type="radio" name="annotations" value="withoutAnnotations"
              checked={!annotations} onChange={toggleAnnotations} />
            Mappings only
          </label>
        </div>

        <div className="dp-group">
          <div className="dp-group-label">Annotations</div>
          <label className={`dp-option${!annotations ? ' dp-option--disabled' : ''}`}>
            <input type="checkbox" name="fun" checked={form.fun} disabled={!annotations}
              onChange={(e) => updateForm(e.target.name, !form.fun)} />
            Functional
          </label>
          <label className={`dp-option${!annotations ? ' dp-option--disabled' : ''}`}>
            <input type="checkbox" name="pop" checked={form.pop} disabled={!annotations}
              onChange={(e) => updateForm(e.target.name, !form.pop)} />
            Population
          </label>
          <label className={`dp-option${!annotations ? ' dp-option--disabled' : ''}`}>
            <input type="checkbox" name="str" checked={form.str} disabled={!annotations}
              onChange={(e) => updateForm(e.target.name, !form.str)} />
            Structure
          </label>
        </div>

        {!props.q && <div className="dp-group">
          <div className="dp-group-label">Pages</div>
          <label className={`dp-option${blocked ? ' dp-option--disabled' : ''}`}>
            <input type="radio" name="currPage" value="false" disabled={!!blocked}
              checked={!currPage} onChange={_ => setCurrPage(false)} />
            All{props.result && !blocked && <span className="dp-count">{allCount(props.result, upload)}</span>}
          </label>
          <label className="dp-option">
            <input type="radio" name="currPage" value="true"
              checked={currPage} onChange={_ => setCurrPage(true)} />
            Current{props.result && <span className="dp-count">page {props.result.page}</span>}
          </label>
        </div>}
      </div>

      {blocked && <p className="dp-note dp-note--warn">{blocked}</p>}
      {props.result && <p className="dp-note">One variant can give several rows (one per gene or isoform).</p>}

      <div className="dp-fields">
        <label className="dp-field">
          <span className="dp-field-label">
            Email
            {errorMsg && <span className="dp-field-error">{errorMsg}</span>}
          </span>
          <span className="dp-field-hint">Optional — get notified when your file is ready</span>
          <input type="email" className="dp-input" value={form.email} name="email"
            onChange={(e) => updateForm(e.target.name, e.target.value)} />
        </label>
        <label className="dp-field">
          <span className="dp-field-label">Job Name</span>
          <span className="dp-field-hint">Optional</span>
          <input type="text" className="dp-input" value={form.jobName} name="jobName"
            onChange={(e) => updateForm(e.target.name, e.target.value)}
            placeholder={jobNamePlaceholder} />
        </label>
      </div>

      <div className="dp-actions">
        <Button onClick={handleSubmit} className="btn btn-primary">
          Generate
        </Button>
        <Button onClick={() => appState.updateState("drawer", undefined)} className="btn btn-secondary">
          Cancel
        </Button>
      </div>
    </div>
  );
}

// e.g. "10,147 of 83,859 inputs" for a filtered upload, "2,614 variants" otherwise
const allCount = (result: PagedMappingResponse, upload: boolean): string => {
  const n = result.totalItems.toLocaleString();
  if (!upload) return `${n} variant${result.totalItems === 1 ? '' : 's'}`;
  return result.totalInputs != null && result.totalInputs !== result.totalItems
    ? `${n} of ${result.totalInputs.toLocaleString()} inputs`
    : `${n} input${result.totalItems === 1 ? '' : 's'}`;
};

export default DownloadPanel;
