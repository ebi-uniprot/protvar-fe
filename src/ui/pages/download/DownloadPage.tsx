import DefaultPageLayout from "../../layout/DefaultPageLayout";
import React, {useEffect, useState} from "react";
import {getDownloadStatus} from "../../../services/ProtVarService";
import {LOCAL_DOWNLOADS, PV_FTP, TITLE} from "../../../constants/const"
import {DownloadRecord} from "../../../types/DownloadRecord";
import Notify from "../../elements/Notify";
import {getRelativeTime} from "../../../utills/DateUtil";
import useLocalStorage from "../../../hooks/useLocalStorage";
import {humanFileSize} from "../../../utills/Util";
import {useNavigate} from "react-router-dom";
import {DownloadHelp} from "../../components/help/DownloadHelp";


interface DownloadTextIcon {
  text: string
  icon: string
}

export const downloadStatus: { [status: number]: DownloadTextIcon; } = {};
downloadStatus[-1] = {text: 'Not Available', icon: 'download-na'};
downloadStatus[0] = {text: 'Not Ready', icon: 'download-nr'};
downloadStatus[1] = {text: 'Ready', icon: 'download-ready'};

function DownloadPageContent() {
  const navigate = useNavigate();
  const {getItem, setItem} = useLocalStorage();
  const [downloads, setDownloads] = useState<DownloadRecord[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Downloads - " + TITLE;
    // Retrieve download records from local storage
    const localDownloads = getItem<DownloadRecord[]>(LOCAL_DOWNLOADS) || []
    setDownloads(localDownloads)
    if (localDownloads.length > 0) {
      // Fetch updated statuses
      const fetchUpdatedStatuses = () => {
        const fs = localDownloads.map(d => d.downloadId);
        getDownloadStatus(fs)
          .then((response) => {
            const updatedDownloads = localDownloads.map(d => {
              if (d.downloadId in response.data) {
                return {...d,
                  status: response.data[d.downloadId].status,
                  size: response.data[d.downloadId].size};
              }
              return d;
            });
            // Save updated objects to local storage
            setItem(LOCAL_DOWNLOADS, updatedDownloads);
            setDownloads(updatedDownloads);
          }).catch(err => {
          console.error('Error fetching updated statuses:', err);
          setError('Failed to fetch updated statuses');
        });
      }
      fetchUpdatedStatuses();
    }
  }, [getItem, setItem]);

  const handleNameChange = (index: number, newName: string) => {
    const updatedDownloads = downloads.map((d, idx) =>
      idx === index ? { ...d, jobName: newName } : d
    );
    setItem(LOCAL_DOWNLOADS, updatedDownloads);
    setDownloads(updatedDownloads);
  };

  const handleDelete = (index: number) => {
    const updatedDownloads = downloads.filter((_, idx) => idx !== index);
    setItem(LOCAL_DOWNLOADS, updatedDownloads);
    setDownloads(updatedDownloads);
  }

  const handleSort = () => {
    const updatedDownloads = downloads.sort((a, b) =>
      b.requested.localeCompare(a.requested))
    setItem(LOCAL_DOWNLOADS, updatedDownloads);
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

    <h6>Result download <DownloadHelp /></h6>

    {error && <p>{error}</p>}
    {downloads.length === 0 ? (
      <p>No download</p>
    ) : (<>
        {downloads.length} download{downloads.length > 1 ? 's' : ''}
        <table className="table download-table">
          <thead style={{backgroundColor: '#6987C3', color: '#FFFFFF'}}>
          <tr>
            <th scope="col">
              Requested <i className="bi bi-arrow-down-up sortarrow" onClick={handleSort}
                           title="Sort by latest downloads"></i>
            </th>
            <th scope="col">Job name</th>
            <th scope="col">Input</th>
            <th scope="col">Options</th>
            <th scope="col">Annotations</th>
            <th scope="col">Status</th>
            <th scope="col">Download</th>
            <th scope="col">Delete</th>
          </tr>
          </thead>
          <tbody>

          {downloads.map((download, index) => {
            return (
              <tr key={`download-${index}`}>
                {
                  // it seems because the download record is saved in local storage and retrieved, the date
                  // string may be messing up when retrieved, and thus getTime or getDate functions do not work
                  // solution: create new Date object
                }
                <td>{getRelativeTime(download.requested)}</td>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      className="edit-name"
                      value={download.jobName}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      onBlur={() => setEditingIndex(null)}
                      autoFocus
                    />
                  ) : (
                    <span onClick={() => setEditingIndex(index)}>{download.jobName ? download.jobName : <i>Unnamed</i>}
                      <i
                        className="bi bi-pencil"></i></span>
                  )}
                </td>
                <td>
                  <span style={{cursor: 'pointer'}}
                        onClick={_ => download.resultUrl ? navigate(download.resultUrl) : null}>
                    {download.downloadId.split('-')[0]}
                    </span>
                </td>
                <td>
                    {download.page && <> p{download.page}{download.pageSize && ` (${download.pageSize})`}</>}
                    {download.assembly && download.assembly !== 'AUTO' && ` ${download.assembly}`}
                </td>
                <td>
                  {download.fun ? <i className="bi bi-check green"></i> :
                    <i className="bi bi-x red"></i>} fun
                  {download.pop ? <i className="bi bi-check green"></i> :
                    <i className="bi bi-x red"></i>} pop
                  {download.str ? <i className="bi bi-check green"></i> :
                    <i className="bi bi-x red"></i>} str
                </td>
                <td>
                  <span
                    className={downloadStatus[download.status].icon}></span> {downloadStatus[download.status].text} {download.size && download.size > 0 ? `(${humanFileSize(download.size)})` : ''}
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