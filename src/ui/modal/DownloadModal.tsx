import {useCallback, useEffect, useRef, useState} from 'react';
import Button from '../elements/form/Button';
import Modal from './Modal';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import {emailValidate} from '../../utills/Validator';
import {DownloadRecord, recordFromResponse} from "../../types/DownloadRecord";
import {LOCAL_DOWNLOADS, LOCAL_RESULTS} from "../../constants/const";
import Notify from "../elements/Notify";
import {downloadResult} from "../../services/ProtVarService";
import useLocalStorage from "../../hooks/useLocalStorage";
import {useLocation, useSearchParams} from "react-router-dom";
import {InputType} from "../../types/PagedMappingResponse";
import {Assembly} from "../../constants/CommonTypes";
import Spaces from "../elements/Spaces";
import {ResultRecord} from "../../types/ResultRecord";

interface DownloadForm {
  email: string
  jobName: string
  fun: boolean
  pop: boolean
  str: boolean
}

interface DownloadModalProps {
  inputType: InputType
  id?: string,
  query?: string
}

// could be triggered for
// - id input                  params: id, page, pageSize, assembly
// - protien acc               params: same as above except id is accession
// - single variant search (direct link)   params: search, (TODO: allow assembly)
function DownloadModal(props: DownloadModalProps) {
  const [showModel, setShowModel] = useState(false)
  const downloadModelDiv = useRef(null)
  useOnClickOutside(downloadModelDiv, useCallback(() => setShowModel(false), []));
  const { getItem, setItem } = useLocalStorage();
  const [errorMsg, setErrorMsg] = useState("")
  const [jobNamePlaceholder, setJobNamePlaceholder] = useState<string>('')

  const location = useLocation();
  const [searchParams] = useSearchParams();
  let initialForm: DownloadForm = {
    email: "",
    jobName: "",
    fun: true,
    pop: true,
    str: true
  }
  const [form, setForm] = useState<DownloadForm>(initialForm)
  const [annotations, setAnnotations] = useState<boolean>(true)
  const [currPage, setCurrPage] = useState<boolean>(true)

  useEffect(() => {
    if (props.id) {
      // Retrieve result records from local storage
      const localResults = getItem<ResultRecord[]>(LOCAL_RESULTS) || []
      const savedRecord = localResults.find((r) => r.id === props.id);
      if (savedRecord && savedRecord.name) {
        setJobNamePlaceholder(savedRecord.name)
      }
    }
  }, [props.id, getItem]);

  const updateForm = (key: string, value: any) => {
    setForm({
      ...form,
      [key]: value,
    });
  };


  if (!props.id && !props.query)
    return <></>
  const toggleAnnotations = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnnotations(event.target.value === 'withAnnotations')
    form.fun = form.pop = form.str  = !annotations
    setForm(form)
  }

  const handleSucc = (downloadRec: DownloadRecord) => {
    let downloads = getItem<DownloadRecord[]>(LOCAL_DOWNLOADS)  || []
    downloads.unshift(downloadRec)
    setItem(LOCAL_DOWNLOADS, downloads)
    Notify.sucs(`Job ${downloadRec.downloadId.split('-')[0]} submitted. Check the Downloads page. `)
  }

  const handleErr = () => {
    Notify.err(`Job ${form.jobName ? form.jobName : jobNamePlaceholder} failed. Please try again.`)
  }

  const handleSubmit = () => {
    const err = emailValidate(form.email)
    if (err) {
      setErrorMsg(err)
      return
    }
    setShowModel(false)

    // logic:
    // if currPage is selected, use the page search param; if this is not set, use page 1
    // if currPage is not selected, page is set to null, which is interpreted as all pages
    const page = currPage ? (searchParams.get('page') ?? "1") : null

    // if page is null (for all pages), pageSize isn't needed
    // if page isn't null, use the pageSize set in the search param (which may be null, in which case default 25 is used)
    const pageSize = page ? searchParams.get('pageSize') : null
    const assembly = searchParams.get('assembly')

    let promise;
    let jname = form.jobName ? form.jobName : jobNamePlaceholder
    if (props.inputType === InputType.SINGLE_VARIANT && props.query) {
      promise = downloadResult(props.query, InputType[props.inputType], null, null,
      assembly === Assembly.GRCh37 ? Assembly.GRCh37 : Assembly.GRCh38, // default is 38 (overriding auto)
        form.email, jname, form.fun, form.pop, form.str)
    } else if ((props.inputType === InputType.ID || props.inputType === InputType.PROTEIN_ACCESSION)
      && props.id){
      promise = downloadResult(props.id, InputType[props.inputType], page, pageSize, assembly,
        form.email, jname, form.fun, form.pop, form.str)
    }

    if (promise) {
        promise
        .then((response) => {
            const downloadResponse = response.data
            let downloadRecord = recordFromResponse(downloadResponse)
            // save download request params in DownloadRecord
            downloadRecord.page = page ?? undefined
            downloadRecord.pageSize = pageSize ?? undefined
            downloadRecord.assembly = assembly ?? undefined
            downloadRecord.fun = form.fun
            downloadRecord.pop = form.pop
            downloadRecord.str = form.str
            downloadRecord.resultUrl = location.pathname + location.search
            handleSucc(downloadRecord)
          }
        )
        .catch(handleErr);
    }
  };
  return <div id="divDownload" ref={downloadModelDiv} className="padding-left-1x">
    <Button onClick={() => setShowModel(val => !val)} className={'download-button'}>
      <i className="bi bi-download"></i>
      <Spaces count={2} />Download Results
    </Button>
    <Modal show={showModel} handleClose={() => setShowModel(false)}>
      <div className="window__header">
        <span className="window__header__title">Download Options</span>
        <span
            className="modal-close-button"
            onClick={() => setShowModel(false)}
          >
            <i className="bi bi-x-lg"></i>
        </span>
      </div>
      <div className="form-group ">
        <div>
          <table>
            <tbody>
            <tr>
              <td>
                <ul className="new-select">
                  <li>
                    <label>
                      <input
                        type="radio"
                        name="annotations"
                        value="withAnnotations"
                        checked={annotations}
                        onChange={toggleAnnotations}
                      />
                      Mappings with Annotations
                    </label>
                  </li>
                  <li>
                    <label>
                      <input
                        type="radio"
                        name="annotations"
                        value="withoutAnnotations"
                        checked={!annotations}
                        onChange={toggleAnnotations}
                      />
                      Mappings only, no annotations
                    </label>
                  </li>
                </ul>
              </td>

              <td>
                <ul className="new-select">
                  <li>
                    <label>Include Annotations</label>
                  </li>
                  <li>
                    <label>
                      <input
                        type="checkbox"
                        name="fun"
                        checked={form.fun}
                        onChange={(e) => updateForm(e.target.name, !form.fun)}
                        disabled={!annotations}
                      />
                      Functional
                    </label>
                  </li>
                  <li>
                    <label>
                      <input
                        type="checkbox"
                        name="pop"
                        checked={form.pop}
                        onChange={(e) => updateForm(e.target.name, !form.pop)}
                        disabled={!annotations}
                      />
                      Population Observation
                    </label>
                  </li>
                  <li>
                    <label>
                      <input
                        type="checkbox"
                        name="str"
                        checked={form.str}
                        onChange={(e) => updateForm(e.target.name, !form.str)}
                        disabled={!annotations}
                      />
                      Structure
                    </label>
                  </li>
                </ul>
              </td>
              <td>
                <ul className="new-select">
                  <li>
                    Pages
                  </li>
                  <li>
                    <label>
                      <input
                        type="radio"
                        name="currPage"
                        value="true"
                        disabled={props.inputType === InputType.SINGLE_VARIANT}
                        checked={currPage}
                        onChange={_ => setCurrPage(true)}
                      />
                      Current
                    </label>
                  </li>
                  <li>
                    <label>
                      <input
                        type="radio"
                        name="currPage"
                        value="false"
                        disabled={props.inputType === InputType.SINGLE_VARIANT}
                        checked={!currPage}
                        onChange={_ => setCurrPage(false)}
                      />
                      All
                    </label>
                  </li>
                </ul>
              </td>
            </tr>
            </tbody>
          </table>

          <label className="download-label">
            Email: <span style={{color: "red"}}>{errorMsg ? errorMsg : ""}</span>
            <div className="small">(Optional, specify an email address for notification when file is ready to
              download)
            </div>
            <input
              type="email"
              value={form.email}
              name="email"
              onChange={(e) => updateForm(e.target.name, e.target.value)}
            />
          </label>
          <label className="download-label">
            Job Name:
            <div className="small">(Optional)</div>
            <input
              type="text"
              value={form.jobName}
              name="jobName"
              onChange={(e) => updateForm(e.target.name, e.target.value)}
              placeholder={jobNamePlaceholder}
            />
          </label>
        </div>
      </div>
      <div className="window__footer">
        <div className="float-right padding-bottom-1x">
          <Button
            onClick={handleSubmit}
            className="window__action-button window__default-close-button button "
          >Submit</Button>
          <Button
            onClick={() => setShowModel(false)}
            className="window__action-button window__default-close-button button"
          >
            close
          </Button>
        </div>
      </div>
    </Modal>
  </div>
}
export default DownloadModal;