import { useState, useCallback, useRef } from 'react';
import Button from '../elements/form/Button';
import Modal from './Modal';
import { ReactComponent as DownloadIcon } from "../../images/download.svg"
import useOnClickOutside from '../../hooks/useOnClickOutside';
import { sendDownloadEmail, download } from './DownloadModalHelper'
import { emailValidate } from '../../utills/Validator';

interface DownloadModalProps {
  file: File | null
  pastedInputs: string[]
  sendEmail: boolean
}
function DownloadModal(props: DownloadModalProps) {
  const [showModel, setShowModel] = useState(false)
  const [email, setEmail] = useState("")
  const [jobName, setJobName] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [downloadAnnotations, setDownloadAnnotations] = useState(true)
  const [annotations, setAnnotations] = useState({ fun: true, pop: true, str: true })
  const setAllAnnotations = (val: boolean) => setAnnotations({ fun: val, pop: val, str: val })
  const downloadModelDiv = useRef(null)
  useOnClickOutside(downloadModelDiv, useCallback(() => setShowModel(false), []));

  const handleSubmit = () => {
    const err = emailValidate(email)
    if (props.sendEmail && err) {
      setErrorMsg(err)
      return
    }
    setShowModel(false)
    if (props.sendEmail) sendDownloadEmail(props.file, props.pastedInputs, annotations.fun, annotations.pop, annotations.str, email, jobName);
    else download(props.file, props.pastedInputs, annotations.fun, annotations.pop, annotations.str);
  };
  return <div id="divDownload" ref={downloadModelDiv}>
    <Button onClick={() => setShowModel(val => !val)}>
      <DownloadIcon className="downloadicon" />
      Download
    </Button>
    <Modal show={showModel} handleClose={() => setShowModel(false)}>
      <div className="window__header">
        <span className="window__header__title">{props.sendEmail ? "Enter Details" : "Select Options"}</span>
      </div>
      <div className="form-group">
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

          {props.sendEmail && <>
            <p className="padding-left-1x">We will send you email onces your file is ready to download</p>
            <label className="download-label">
              Email: <span className="alert-danger">{errorMsg ? errorMsg : ""}</span>
              <input
                type="email"
                value={email}
                name="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="download-label">
              Job Name:
              <input
                type="text"
                value={jobName}
                name="jobName"
                onChange={(e) => setJobName(e.target.value)}
              />
            </label>
          </>}
        </div>
      </div>
      <div className="window__footer">
        <div className="float-right padding-bottom-1x">
          <Button
            onClick={handleSubmit}
            className="window__action-button window__default-close-button button "
          >
            {props.sendEmail ? "Submit" : "Download"}
          </Button>
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