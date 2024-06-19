import DefaultPageLayout from "../../layout/DefaultPageLayout";
import React, {useEffect, useState} from "react";
import {getDownloadStatus} from "../../../services/ProtVarService";
import {LOCAL_DOWNLOADS, PV_FTP, TITLE} from "../../../constants/const"
//import { v4 as uuidv4 } from 'uuid';
import {DownloadRecord} from "../../../types/DownloadRecord";
import Notify from "../../elements/Notify";
import {useLocalStorageContext} from "../../../provider/LocalStorageContextProps";
import {getRelativeTimeString} from "../../../utills/DateUtil";

/*
function testDownloadRes() : DownloadResponse {
    const id: string = uuidv4()
    return {inputType: "FILE", requested: new Date(), downloadId: id, url: `api/download/${id}`, jobName: 'test', status: -1}
}*/

const downloadStatusText: { [code: number]: string; } = {};
downloadStatusText[1] = 'Ready';
downloadStatusText[0] = 'Not Ready';
downloadStatusText[-1] = 'Not Available';

const downloadStatusIcon: { [code: number]: string; } = {};
downloadStatusIcon[1] = 'download-ready';
downloadStatusIcon[0] = 'download-nr';
downloadStatusIcon[-1] = 'download-na';

function DownloadPageContent() {
  const {getValue, setValue} = useLocalStorageContext();
  const [downloads, setDownloads] = useState<DownloadRecord[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    document.title = "Downloads - " + TITLE;
    // Retrieve download records from local storage
    const localDownloads = getValue<DownloadRecord[]>(LOCAL_DOWNLOADS) || []
    setDownloads(localDownloads)
    if (localDownloads.length > 0) {
      // Fetch updated statuses
      const fetchUpdatedStatuses = () => {
        const ids = localDownloads.map(d => d.downloadId);
        getDownloadStatus(ids)
          .then((response) => {
            const updatedDownloads = localDownloads.map(d => {
              if (d.downloadId in response.data) {
                return {...d, status: response.data[d.downloadId]};
              }
              return d;
            });
            // Save updated objects to local storage
            setValue(LOCAL_DOWNLOADS, updatedDownloads);
            setDownloads(updatedDownloads);
          }).catch(err => {
          console.error('Error fetching updated statuses:', err);
          setError('Failed to fetch updated statuses');
        });
      }
      fetchUpdatedStatuses();
    }
  }, [getValue, setValue]);

  const handleNameChange = (index: number|null, newName: string) => {
    const updatedDownloads = downloads.map((d, idx) =>
      idx === index ? { ...d, jobName: newName } : d
    );
    setValue(LOCAL_DOWNLOADS, updatedDownloads);
    setDownloads(updatedDownloads);
  };

  const handleDelete = (index: number) => {
    const updatedDownloads = downloads.filter((_, idx) => idx !== index);
    setValue(LOCAL_DOWNLOADS, updatedDownloads);
    setDownloads(updatedDownloads);
  }

  return <div className="container">

    <h6>FTP download</h6>
    <p>
      Bulk pre-computed datasets, separated by data type available to download from the <a href={PV_FTP}
                                                                                           title="ProtVar FTP site"
                                                                                           target="_self"
                                                                                           className='ref-link'>FTP
      site</a>.
    </p>

    <h6>Result download</h6>

    {error && <p>{error}</p>}
    {downloads.length === 0 ? (
      <p>No download</p>
    ) : (<>
        <p>
          <b>{downloads.length} download{downloads.length > 1 ? 's' : ''}.</b> Use edit <i className="bi bi-pencil"></i>,
          download <i className="bi bi-download"></i> and delete <i className="bi bi-trash"></i> to manage downloads. <br/>
          Download status: <span
          className={downloadStatusIcon[1]}></span> {downloadStatusText[1]} <span
          className={downloadStatusIcon[0]}></span> {downloadStatusText[0]} <span
          className={downloadStatusIcon[-1]}></span> {downloadStatusText[-1]}

        </p>
        <table className="table download-table">
        <thead style={{backgroundColor: '#6987C3', color: '#FFFFFF'}}>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Requested</th>
            <th scope="col">ID</th>
            <th scope="col">Job name</th>
            <th scope="col">Status</th>
            <th scope="col">Download</th>
            <th scope="col">Delete</th>
          </tr>
          </thead>
          <tbody>

          {downloads.map((download, index) => {
            return (
              <tr className={download.status === 1 ? "table-success" : ""} key={'download' + index}>
                <th scope="row">{index + 1}</th>
                {
                  // it seems becauses the download record is saved in local storage and retrieved, the date
                  // string may be messing up when retrieved, and thus getTime or getDate functions do not work
                  // soln: create new Date object
                }
                <td>{getRelativeTimeString(new Date(download.requested))}</td>
                <td>{download.downloadId}</td>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      style={{ width: '100%', padding: '2px', height: '30px', fontSize: '14px', border: 'none', borderRadius: '4px', backgroundColor: '#f1f1f1' }}
                      value={download.jobName}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      onBlur={() => setEditingIndex(null)}
                      autoFocus
                    />
                  ) : (
                    <span onClick={() => setEditingIndex(index)}>{download.jobName} <i
                      className="bi bi-pencil"></i></span>
                  )}
                </td>
                <td>
                  <span className={downloadStatusIcon[download.status]}></span> {downloadStatusText[download.status]}
                </td>
                <td>
                  <button className="bi bi-download download-btn"
                          onClick={() => downloadFile(download.url)} disabled={download.status !== 1}/>
                </td>
                <td>
                  <button className="bi bi-trash trash-btn" onClick={_ => handleDelete(index)}></button>
                </td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </>
    )}
  </div>
}

function downloadFile(url: string) {
  Notify.info("Downloading file...")
  window.open(url, "_blank");
}

function DownloadPage() {
  return <DefaultPageLayout content={<DownloadPageContent/>}/>
}

export default DownloadPage;