import DefaultPageLayout from "../../layout/DefaultPageLayout";
import React, {useEffect, useState} from "react";
import "./DownloadPage.css";
import {getDownloadStatus} from "../../../services/ProtVarService";
import { v4 as uuidv4 } from 'uuid';

export interface Download {
    date: Date,
    id: string,
    status: number
}

const DOWNLOAD_KEY: string = 'PV_Downloads'

function newDownload() : Download {
    const s = uuidv4()
    return {date: new Date(), id: s.substring(s.length - 12), status: -1}
}

const statusMap: { [code: number]: string; } = {};
statusMap[1] = 'Ready';
statusMap[0] = 'Not Ready';
statusMap[-1] = 'Not Available';

function DownloadPageContent() {
    let initialDownloads = JSON.parse(localStorage.getItem(DOWNLOAD_KEY) || "[]")
    const [downloads, setDownloads] = useState<Download[]>(initialDownloads)
    const ids = downloads.map(d => d.id)

    useEffect(() => {
        getDownloadStatus(ids)
            .then((response) => {
                const updatedDownloads = downloads.map(d => {
                    if (d.id in response.data) {
                        d.status = response.data[d.id]
                    }
                    return d
                })
                setDownloads(updatedDownloads)
            })}
    ,[])


    useEffect(() => {
        localStorage.setItem(DOWNLOAD_KEY, JSON.stringify(downloads));
    }, [downloads])

    return <div className="container">
        <h4>Download History</h4>
        # of downloads: {downloads.length}

        <p>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => setDownloads([...downloads, newDownload()])}><span
                className="bi-plus-square-fill"></span> Add
            </button>
        </p>

        {downloads.length > 0 && (
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Requested</th>
                    <th scope="col">ID</th>
                    <th scope="col">Status</th>
                    <th scope="col">Download</th>
                    <th scope="col">Delete</th>
                </tr>
                </thead>
                <tbody>

                {downloads.map(( download, index ) => {
                    return (
                        <tr className={download.status === 1 ? "table-success" : ""} key={'download'+index}>
                            <th scope="row">{index+1}</th>
                            <td>{download.date.toLocaleString()}</td>
                            <td>{download.id}</td>
                            <td>{statusMap[download.status]}</td>
                            <td><button onClick={() => alert('Downloading...')} disabled={download.status !== 1}><i className="bi bi-download"></i></button></td>
                            <td><button onClick={() => {
                                setDownloads(
                                    downloads.filter(d =>
                                        d.id !== download.id
                                    )
                                );
                            }}><i className="bi bi-trash"></i></button></td>
                        </tr>
                    );
                })}

                </tbody>
            </table>
        )
        }


    </div>
}

function DownloadPage() {
    return <DefaultPageLayout content={<DownloadPageContent />} />
}
export default DownloadPage;