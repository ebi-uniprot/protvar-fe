import {useCallback, useContext, useEffect, useState} from 'react';
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
import {AppContext} from "../App";

interface DownloadForm {
  email: string
  jobName: string
  fun: boolean
  pop: boolean
  str: boolean
}

export interface DownloadPanelProps {
  numPages: number;
  // One of the following identifies what to download:
  q?: string;          // single variant query
  resultId?: string;   // uploaded result ID
  ids?: Identifier[];  // identifier browse
  // Optional: links the download record back to a history entry
  historyId?: string;
}

const NUM_PAGES_LIMIT = 10;

export function DownloadPanel(props: DownloadPanelProps) {
  const appState = useContext(AppContext);
  const { addDownload, getHistory } = useStorage()
  const [errorMsg, setErrorMsg] = useState("")
  const [jobNamePlaceholder, setJobNamePlaceholder] = useState<string>('')

  const location = useLocation();
  const [searchParams] = useSearchParams();
  const initialForm: DownloadForm = { email: "", jobName: "", fun: true, pop: true, str: true }
  const [form, setForm] = useState<DownloadForm>(initialForm)
  const [annotations, setAnnotations] = useState<boolean>(true)
  const [currPage, setCurrPage] = useState<boolean>(false)

  useEffect(() => {
    const historyId = props.historyId ?? props.resultId
    const saved = historyId ? getHistory().find(r => r.id === historyId) : undefined
    if (saved?.name) {
      setJobNamePlaceholder(saved.name)
      return
    }
    setJobNamePlaceholder(autoJobName({ q: props.q, ids: props.ids, searchParams }))
  }, [props.historyId, props.resultId, props.q, props.ids, searchParams, getHistory])

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
    if (!currPage && props.numPages > NUM_PAGES_LIMIT) {
      const confirm = window.confirm(`Are you sure you want to download all ${props.numPages} pages?\nThis may take a long time to generate.`);
      if (!confirm) return;
    }

    const err = emailValidate(form.email)
    if (err) { setErrorMsg(err); return; }

    appState.updateState("drawer", undefined);

    const page = currPage ? (searchParams.get('page') ?? "1") : null
    const pageSize = page ? searchParams.get('pageSize') : null
    const assembly = searchParams.get('assembly')
    const jobName = form.jobName || jobNamePlaceholder

    const request: DownloadRequest = {
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
      <h6 className="dp-title">Download Panel</h6>

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

        <div className="dp-group">
          <div className="dp-group-label">Pages</div>
          <label className="dp-option">
            <input type="radio" name="currPage" value="false"
              checked={!currPage} onChange={_ => setCurrPage(false)} />
            All
          </label>
          <label className="dp-option">
            <input type="radio" name="currPage" value="true"
              checked={currPage} onChange={_ => setCurrPage(true)} />
            Current
          </label>
        </div>
      </div>

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

export default DownloadPanel;
