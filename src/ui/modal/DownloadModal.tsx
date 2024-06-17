import {useState, useCallback, useRef, useContext} from 'react';
import Button from '../elements/form/Button';
import Modal from './Modal';
import { ReactComponent as DownloadIcon } from "../../images/download.svg"
import useOnClickOutside from '../../hooks/useOnClickOutside';
import { emailValidate } from '../../utills/Validator';
import {FormData} from '../../types/FormData'
import {AppContext, AppState} from "../App";
import {DownloadRecord} from "../../types/DownloadRecord";
import {LOCAL_DOWNLOADS} from "../../constants/const";
import Notify from "../elements/Notify";
import {downloadFileInput, downloadTextInput} from "../../services/ProtVarService";
import {useLocalStorageContext} from "../../provider/LocalStorageContextProps";

interface DownloadModalProps {
  formData?: FormData
}

function DownloadModal(props: DownloadModalProps) {
  const state = useContext(AppContext)
  const { formData } = props;
  const [showModel, setShowModel] = useState(false)
  const [email, setEmail] = useState("")
  const [jobName, setJobName] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [downloadAnnotations, setDownloadAnnotations] = useState(true)
  const [annotations, setAnnotations] = useState({ fun: true, pop: true, str: true })
  const setAllAnnotations = (val: boolean) => setAnnotations({ fun: val, pop: val, str: val })
  const downloadModelDiv = useRef(null)
  useOnClickOutside(downloadModelDiv, useCallback(() => setShowModel(false), []));
  const { getValue, setValue } = useLocalStorageContext();

  const handleSucc = (downloadRes: DownloadRecord) => {
    const downloads = getValue<DownloadRecord[]>(LOCAL_DOWNLOADS)  || []
    const updatedDownloads = [...downloads, downloadRes]
    setValue(LOCAL_DOWNLOADS, updatedDownloads)
    Notify.sucs(`Job ${downloadRes.downloadId} submitted. Check the Downloads page. `)
  }

  const handleErr = () => {
    Notify.err(`Job ${jobName} failed. Please try again.`)
  }

  const processDownload = (functional: boolean, population: boolean, structure: boolean,
    email: string, jobName: string, state: AppState, formData?: FormData) => {

    let file = formData?.file || state.file || null;
    let assembly = formData?.assembly?.toString() || state.assembly.toString();
    let userInputs: string[] = [];

    if (!file) {
      userInputs = formData?.userInputs ||
        state.textInput.split(/[\n,]/).filter(i => !i.trimStart().startsWith("#"));
    }

    if (file) {
      downloadFileInput(file, assembly, email, jobName, functional, population, structure)
        .then((response) => handleSucc(response.data))
        .catch(handleErr);
    } else {
      downloadTextInput(userInputs, assembly, email, jobName, functional, population, structure)
        .then((response) => handleSucc(response.data))
        .catch(handleErr);
    }
  }

  const handleSubmit = () => {
    const err = emailValidate(email)
    if (err) {
      setErrorMsg(err)
      return
    }
    setShowModel(false)
    processDownload(annotations.fun, annotations.pop, annotations.str, email, jobName, state, formData);
  };
  return <div id="divDownload" ref={downloadModelDiv} className="padding-left-1x">
    <Button onClick={() => setShowModel(val => !val)} className={'download-button'}>
      <DownloadIcon className="downloadicon" />
      {' '}Download Results
    </Button>
    <Modal show={showModel} handleClose={() => setShowModel(false)}>
      <div className="window__header">
        <span className="window__header__title">Select Options</span>        
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
                      <label id="item1">
                        <input
                          type="radio"
                          value="annotations"
                          name="downloadOption"
                          checked={downloadAnnotations}
                          onChange={() => { setDownloadAnnotations(true); setAllAnnotations(true) }}
                        />
                        Mappings with Annotations
                      </label>
                    </li>
                    <li>
                      <label id="item2">
                        <input
                          type="radio"
                          value="mappings"
                          name="downloadOption"
                          checked={!downloadAnnotations}
                          onChange={() => { setDownloadAnnotations(false); setAllAnnotations(false) }}
                        />
                        Mappings only, no annotations
                      </label>
                    </li>
                  </ul>
                </td>

                <td>
                  <ul className="new-select">
                    <li>
                      <label id="item1">Include Annotations</label>
                    </li>
                    <li>
                      <input
                        type="checkbox"
                        name="function"
                        checked={annotations.fun}
                        onChange={() => setAnnotations(an => ({ ...an, fun: !an.fun }))}
                        disabled={!downloadAnnotations}
                      />
                      <label id="item1">Functional</label>
                    </li>
                    <li>
                      <input
                        type="checkbox"
                        name="population"
                        checked={annotations.pop}
                        onChange={() => setAnnotations(an => ({ ...an, pop: !an.pop }))}
                        disabled={!downloadAnnotations}
                      />
                      <label id="item1">Population Observation</label>
                    </li>
                    <li>
                      <input
                        type="checkbox"
                        name="structure"
                        checked={annotations.str}
                        onChange={() => setAnnotations(an => ({ ...an, str: !an.str }))}
                        disabled={!downloadAnnotations}
                      />
                      <label id="item1">Structure</label>
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>

          <label className="download-label">
            Email: <span style={{color:"red"}}>{errorMsg ? errorMsg : ""}</span>
            <div className="small">(Optional, specify an email address for notification when file is ready to download)</div>
            <input
              type="email"
              value={email}
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="download-label">
            Job Name:
            <div className="small">(Optional)</div>
            <input
              type="text"
              value={jobName}
              name="jobName"
              onChange={(e) => setJobName(e.target.value)}
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