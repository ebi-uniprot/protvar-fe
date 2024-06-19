import DefaultPageLayout from "../../layout/DefaultPageLayout";
import React, {useEffect, useState} from "react";
import {getDownloadStatus} from "../../../services/ProtVarService";
import {LOCAL_DOWNLOADS, PV_FTP, TITLE} from "../../../constants/const"
//import { v4 as uuidv4 } from 'uuid';
import {DownloadRecord} from "../../../types/DownloadRecord";
import Notify from "../../elements/Notify";
import {useLocalStorageContext} from "../../../provider/LocalStorageContextProps";

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


  useEffect(() => {
    document.title = "Downloads - " + TITLE;
    // Retrieve download records from local storage
    const localDownloads = getValue<DownloadRecord[]>(LOCAL_DOWNLOADS) || []
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
        });
      }
      fetchUpdatedStatuses();
    } else {
      setDownloads(localDownloads);
    }
  }, [getValue, setValue]);

  const handleDelete = (id: string) => {
    const updatedDownloads = downloads.filter((d) => d.downloadId !== id);
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
    <p>
      {downloads.length > 0 ? (
        <>{downloads.length} download{downloads.length > 1 ? 's' : ''}
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
                  <td>{download.requested.toLocaleString()}</td>
                  <td>{download.downloadId}</td>
                  <td>{download.jobName}</td>
                  <td>
                    <div className={downloadStatusIcon[download.status]}></div>
                    {downloadStatusText[download.status]}</td>
                  <td>
                    <button className="bi bi-download download-btn"
                            onClick={() => downloadFile(download.url)} disabled={download.status !== 1}/>
                  </td>
                  <td>
                    <button className="bi bi-trash trash-btn" onClick={_ => handleDelete(download.downloadId)}></button>
                  </td>
                </tr>
              );
            })}

            </tbody>
          </table>
        </>
      ) : (
        `No download`
      )
      }
    </p>


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