import {useCallback, useContext, useEffect, useState} from 'react';
import Button from '../elements/form/Button';
import {emailValidate} from '../../utills/Validator';
import {DownloadRecord, recordFromResponse} from "../../types/DownloadRecord";
import {LOCAL_DOWNLOADS, LOCAL_RESULTS} from "../../constants/const";
import Notify from "../elements/Notify";
import {downloadPost} from "../../services/ProtVarService";
import useLocalStorage from "../../hooks/useLocalStorage";
import {useLocation, useSearchParams} from "react-router-dom";
import {ResultRecord} from "../../types/ResultRecord";
import {DownloadRequest} from "../../types/DownloadRequest";
import {Identifier} from "../../types/InputType";
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
}

const NUM_PAGES_LIMIT = 10;

export function DownloadPanel(props: DownloadPanelProps) {
  const appState = useContext(AppContext);
  const { getItem, setItem } = useLocalStorage();
  const [errorMsg, setErrorMsg] = useState("")
  const [jobNamePlaceholder, setJobNamePlaceholder] = useState<string>('')

  const location = useLocation();
  const [searchParams] = useSearchParams();
  const initialForm: DownloadForm = { email: "", jobName: "", fun: true, pop: true, str: true }
  const [form, setForm] = useState<DownloadForm>(initialForm)
  const [annotations, setAnnotations] = useState<boolean>(true)
  const [currPage, setCurrPage] = useState<boolean>(false)

  // Use resultId as the key for local result lookup
  useEffect(() => {
    if (!props.resultId) return;
    const localResults = getItem<ResultRecord[]>(LOCAL_RESULTS) || []
    const savedRecord = localResults.find((r) => r.id === props.resultId);
    if (savedRecord && savedRecord.name) {
      setJobNamePlaceholder(savedRecord.name)
    }
  }, [props.resultId, getItem]);

  const updateForm = useCallback((key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleAnnotations = (event: React.ChangeEvent<HTMLInputElement>) => {
    const withAnnotations = event.target.value === 'withAnnotations';
    setAnnotations(withAnnotations);
    setForm(prev => ({ ...prev, fun: withAnnotations, pop: withAnnotations, str: withAnnotations }));
  }

  const handleSucc = (downloadRec: DownloadRecord) => {
    let downloads = getItem<DownloadRecord[]>(LOCAL_DOWNLOADS) || []
    downloads.unshift(downloadRec)
    setItem(LOCAL_DOWNLOADS, downloads)
    Notify.sucs(`Job ${downloadRec.downloadId.split('-')[0]} submitted. Check the Downloads page.`)
  }

  const handleErr = () => {
    Notify.err(`Job ${form.jobName || jobNamePlaceholder} failed. Please try again.`)
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
        const downloadResponse = response.data
        let downloadRecord = recordFromResponse(downloadResponse)
        downloadRecord.page = page ?? undefined
        downloadRecord.pageSize = pageSize ?? undefined
        downloadRecord.assembly = assembly ?? undefined
        downloadRecord.fun = form.fun
        downloadRecord.pop = form.pop
        downloadRecord.str = form.str
        downloadRecord.resultUrl = location.pathname + location.search
        downloadRecord.clientRequested = new Date().toISOString()
        handleSucc(downloadRecord)
      })
      .catch(handleErr);
  };

  return (
    <div>
      <h6 style={{ marginBottom: '1rem', fontWeight: 600 }}>Download Options</h6>
      <div className="form-group">
        <div>
          <table>
            <tbody>
            <tr>
              <td>
                <ul className="new-select">
                  <li>
                    <label>
                      <input type="radio" name="annotations" value="withAnnotations"
                        checked={annotations} onChange={toggleAnnotations} />
                      Mappings with Annotations
                    </label>
                  </li>
                  <li>
                    <label>
                      <input type="radio" name="annotations" value="withoutAnnotations"
                        checked={!annotations} onChange={toggleAnnotations} />
                      Mappings only, no annotations
                    </label>
                  </li>
                </ul>
              </td>
              <td>
                <ul className="new-select">
                  <li><label>Include Annotations</label></li>
                  <li>
                    <label>
                      <input type="checkbox" name="fun" checked={form.fun} disabled={!annotations}
                        onChange={(e) => updateForm(e.target.name, !form.fun)} />
                      Functional
                    </label>
                  </li>
                  <li>
                    <label>
                      <input type="checkbox" name="pop" checked={form.pop} disabled={!annotations}
                        onChange={(e) => updateForm(e.target.name, !form.pop)} />
                      Population Observation
                    </label>
                  </li>
                  <li>
                    <label>
                      <input type="checkbox" name="str" checked={form.str} disabled={!annotations}
                        onChange={(e) => updateForm(e.target.name, !form.str)} />
                      Structure
                    </label>
                  </li>
                </ul>
              </td>
              <td>
                <ul className="new-select">
                  <li>Pages</li>
                  <li>
                    <label>
                      <input type="radio" name="currPage" value="false"
                        checked={!currPage} onChange={_ => setCurrPage(false)} />
                      All
                    </label>
                  </li>
                  <li>
                    <label>
                      <input type="radio" name="currPage" value="true"
                        checked={currPage} onChange={_ => setCurrPage(true)} />
                      Current
                    </label>
                  </li>
                </ul>
              </td>
            </tr>
            </tbody>
          </table>

          <label className="download-label">
            Email: <span style={{color: "red"}}>{errorMsg || ""}</span>
            <div className="small">(Optional, specify an email address for notification when file is ready to download)</div>
            <input type="email" value={form.email} name="email"
              onChange={(e) => updateForm(e.target.name, e.target.value)} />
          </label>
          <label className="download-label">
            Job Name:
            <div className="small">(Optional)</div>
            <input type="text" value={form.jobName} name="jobName"
              onChange={(e) => updateForm(e.target.name, e.target.value)}
              placeholder={jobNamePlaceholder} />
          </label>
        </div>
      </div>
      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
        <Button onClick={handleSubmit} className="window__action-button window__default-close-button button">
          Submit
        </Button>
        <Button onClick={() => appState.updateState("drawer", undefined)}
          className="window__action-button window__default-close-button button">
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default DownloadPanel;
