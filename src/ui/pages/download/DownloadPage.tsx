import DefaultPageLayout from "../../layout/DefaultPageLayout";
import React, {useEffect, useState} from "react";
import {getDownloadStatus} from "../../../services/ProtVarService";
import {LOCAL_DOWNLOADS, PV_FTP, TITLE} from "../../../constants/const"
//import { v4 as uuidv4 } from 'uuid';
import {DownloadRecord} from "../../../types/DownloadRecord";
import Notify from "../../elements/Notify";
import {getRelativeTime} from "../../../utills/DateUtil";
import useLocalStorage from "../../../hooks/useLocalStorage";

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
  const {getItem, setItem} = useLocalStorage();
  const [downloads, setDownloads] = useState<DownloadRecord[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false)


  useEffect(() => {
    document.title = "Downloads - " + TITLE;
    // Retrieve download records from local storage
    const localDownloads = getItem<DownloadRecord[]>(LOCAL_DOWNLOADS) || []
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

  const handleNameChange = (index: number|null, newName: string) => {
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
      <button className={`bi bi-info-circle${showHelp ? `-fill` : ``}`}
              onClick={_ => setShowHelp(!showHelp)}> Help <i
        className={`bi bi-chevron-${showHelp ? `up` : `down`}`}></i></button>
      {showHelp && <DownloadHelp/>}
    </p>


    {error && <p>{error}</p>}
    {downloads.length === 0 ? (
      <p>No download</p>
    ) : (<>


        {downloads.length} download{downloads.length > 1 ? 's' : ''}
        <table className="table download-table">
          <thead style={{backgroundColor: '#6987C3', color: '#FFFFFF'}}>
          <tr>
            <th scope="col">Requested</th>
            <th scope="col">ID</th>
            <th scope="col">Job name</th>
            <th scope="col">Status</th>
            <th scope="col">View</th>
            <th scope="col">Download</th>
            <th scope="col">Delete</th>
          </tr>
          </thead>
          <tbody>

          {downloads.map((download, index) => {
            return (
              <tr key={`download-${index}`}>
                {
                  // it seems becauses the download record is saved in local storage and retrieved, the date
                  // string may be messing up when retrieved, and thus getTime or getDate functions do not work
                  // soln: create new Date object
                }
                <td>{getRelativeTime(download.requested)}</td>
                <td>{download.downloadId}</td>
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
                  <span className={downloadStatusIcon[download.status]}></span> {downloadStatusText[download.status]}
                </td>
                <td>
                  View in PV
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

const DownloadHelp = () => {
  return <div className="page-help"><h5>Download Results</h5>

    <p>1. <strong>Full Input Download</strong></p>
    <ul>
      <li>When downloading the complete results for a specific input (e.g., <code>XYZ</code>), the download ID will be
        the same as the input ID.
      </li>
      <li><strong>Example:</strong> For input <code>XYZ</code>, the download ID will be <code>XYZ</code>.</li>
    </ul>

    <p>2. <strong>Partial Download by Page</strong></p>
    <ul>
      <li>If downloading a specific page or if the default page size has been have changed, the download ID will include
        additional information to indicate this.
      </li>
      <li><strong>Example:</strong></li>
      <ul>
        <li>For page 1 of input <code>XYZ</code>, the download ID will be <code>XYZ-1</code>.</li>
        <li>For page 1 with a page size of 50, the download ID will be <code>XYZ-1-50</code>.</li>
      </ul>
    </ul>

    <p><strong>General Format</strong></p>
    <p>The format for download IDs is as follows: <code>UUID[-<em>page</em>][-<em>pageSize</em>]</code></p>

    <p><strong>Components:</strong></p>
    <ul>
      <li><code>UUID</code>: The unique identifier for the input.</li>
      <li><code>page</code> (optional): Indicates the specific page number being downloaded.</li>
      <li><code>pageSize</code> (optional): Indicates the number of results per page if it differs from the default.
      </li>
    </ul>

    <p><strong>Download Annotations</strong></p>
    <p>Downloads can be customised with or without annotations:</p>
    <ul>
      <li>If functional information is checked in the download option, <code>-fun</code> is appended to the download ID.
      </li>
      <li>If population information is checked in the download option, <code>-pop</code> is appended to the download ID.
      </li>
      <li>If structure information is checked in the download option, <code>-str</code> is appended to the download ID.
      </li>
    </ul>

    <p><strong>General Format with Annotations</strong></p>
    <p>The format for download IDs with options is as
      follows: <code>UUID[-fun][-pop][-str][-<em>page</em>][-<em>pageSize</em>]</code></p>

    <p><strong>Protein Mappings Download</strong></p>
    <p>The same format applies for protein mappings downloads, but the accession number is used as the ID instead of the
      randomly generated UUID for custom inputs. The format for protein mappings download IDs
      is: <code>ACCESSION[-fun][-pop][-str][-<em>page</em>][-<em>pageSize</em>]</code>.</p>

    <p>This ensures that download file names accurately reflect the scope of the data they contain, helping to keep
      files organised.</p>

    <p><strong>Download Management</strong></p>
    <p>Use <em>edit</em> <i className="bi bi-pencil"></i>, <em>download</em> <i
      className="bi bi-download"></i> and <em>delete</em> <i className="bi bi-trash"></i> to manage downloads.</p>

    <p><strong>Download Status</strong></p>
    <ul>
      <li><span className={downloadStatusIcon[1]}></span> <em>{downloadStatusText[1]}:</em> The download is prepared and
        available for retrieval.
      </li>
      <li><span className={downloadStatusIcon[0]}></span> <em>{downloadStatusText[0]}:</em> The download is currently
        being prepared and will be available soon.
      </li>
      <li><span className={downloadStatusIcon[-1]}></span> <em>{downloadStatusText[-1]}:</em> The download cannot be
        prepared due to an error or missing data.
      </li>
    </ul>
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