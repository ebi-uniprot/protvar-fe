import {useState, useCallback, useRef} from 'react';
import Button from '../elements/form/Button';
import Modal from './Modal';
import { ReactComponent as DownloadIcon } from "../../images/download.svg"
import useOnClickOutside from '../../hooks/useOnClickOutside';
import { emailValidate } from '../../utills/Validator';
import {DownloadRecord} from "../../types/DownloadRecord";
import {LOCAL_DOWNLOADS} from "../../constants/const";
import Notify from "../elements/Notify";
import {downloadResult} from "../../services/ProtVarService";
import {useLocalStorageContext} from "../../provider/LocalStorageContextProps";
import {useParams, useSearchParams} from "react-router-dom";

const initialValues = {
  email: "",
  jobName: "",
  annotations: true, // not passed on to api call
  function: true,
  population: true,
  structure: true,
  currPage: true, // not passed on to api call
};

function DownloadModal() {
  const {id} = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();
  let page = searchParams.get("page")
  let pageSize = searchParams.get("pageSize")
  const assembly = searchParams.get("assembly")

  const [values, setValues] = useState(initialValues);

  const updateForm = (name: string, value: any) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  const setAllAnnotations = (val: boolean) => {
    updateForm("function", val)
    updateForm("population", val)
    updateForm("structure", val)
  }

  const [showModel, setShowModel] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

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
    Notify.err(`Job ${values.jobName} failed. Please try again.`)
  }

  const handleSubmit = () => {
    if (!id) return;
    const err = emailValidate(values.email)
    if (err) {
      setErrorMsg(err)
      return
    }
    setShowModel(false)

    if (values.currPage) {
      page = null;
      pageSize = null;
    }

    downloadResult(id, page, pageSize, assembly,
      values.email, values.jobName, values.function, values.population, values.structure)
      .then((response) => handleSucc(response.data))
      .catch(handleErr);
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
                        value="true"
                        name="annotations"
                        checked={values.annotations}
                        onChange={(e) => {
                          updateForm(e.target.name, true)
                          setAllAnnotations(true)
                        }}
                      />
                      Mappings with Annotations
                    </label>
                  </li>
                  <li>
                    <label id="item2">
                      <input
                        type="radio"
                        value="false"
                        name="annotations"
                        checked={!values.annotations}
                        onChange={(e) => {
                          updateForm(e.target.name, false)
                          setAllAnnotations(false)
                        }}
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
                      checked={values.function}
                      onChange={(e) => updateForm(e.target.name, !values.function) }
                      disabled={!values.annotations}
                    />
                    <label id="item1">Functional</label>
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      name="population"
                      checked={values.population}
                      onChange={(e) => updateForm(e.target.name, !values.population)}
                      disabled={!values.annotations}
                    />
                    <label id="item1">Population Observation</label>
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      name="structure"
                      checked={values.structure}
                      onChange={(e) => updateForm(e.target.name, !values.structure)}
                      disabled={!values.annotations}
                    />
                    <label id="item1">Structure</label>
                  </li>
                </ul>
              </td>
              <td>
                <ul className="new-select">
                  <li>
                    <label id="item1">
                      <input
                        type="radio"
                        value="true"
                        name="currPage"
                        checked={values.currPage}
                        onChange={(e) => {
                          updateForm(e.target.name, true)
                        }}
                      />
                      Current page
                    </label>
                  </li>
                  <li>
                    <label id="item2">
                      <input
                        type="radio"
                        value="false"
                        name="currPage"
                        checked={!values.currPage}
                        onChange={(e) => {
                          updateForm(e.target.name, false)
                        }}
                      />
                      All pages
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
              value={values.email}
              name="email"
              onChange={(e) => updateForm(e.target.name, e.target.value)}
            />
          </label>
          <label className="download-label">
            Job Name:
            <div className="small">(Optional)</div>
            <input
              type="text"
              value={values.jobName}
              name="jobName"
              onChange={(e) => updateForm(e.target.name, e.target.value)}
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