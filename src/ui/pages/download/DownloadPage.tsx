import DefaultPageLayout from "../../layout/DefaultPageLayout";
import React, {useEffect, useState} from "react";
import "./DownloadPage.css";
import {getDownloadStatus} from "../../../services/ProtVarService";
import {LOCAL_DOWNLOADS} from "../../../constants/const"
//import { v4 as uuidv4 } from 'uuid';
import {DownloadResponse} from "../../../types/DownloadResponse";
import Notify from "../../elements/Notify";

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
    let localDownloads = JSON.parse(localStorage.getItem(LOCAL_DOWNLOADS) || "[]")
    const [downloads, setDownloads] = useState<DownloadResponse[]>(localDownloads)
    //

    useEffect(() => {
        let ds: DownloadResponse[] = JSON.parse(localStorage.getItem(LOCAL_DOWNLOADS) || "[]")
        const ids = ds.map(d => d.downloadId)
        getDownloadStatus(ids)
            .then((response) => {
                const updatedDownloads = ds.map(d => {
                    if (d.downloadId in response.data) {
                        d.status = response.data[d.downloadId]
                    }
                    return d
                })
                setDownloads(updatedDownloads)
            })}
    , [])


    useEffect(() => {
        localStorage.setItem(LOCAL_DOWNLOADS, JSON.stringify(downloads));
    }, [downloads])

    return <div className="container">
        <h4>Download History</h4>
        {downloads.length} download{downloads.length > 1 ? 's' : ''}

        {/**
        <p>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => setDownloads([...downloads, testDownloadRes()])}><span
                className="bi-plus-square-fill"></span> Add
            </button>
        </p>
        */}

        {downloads.length > 0 && (
            <table className="table">
                <thead>
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

                {downloads.map(( download, index ) => {
                    return (
                        <tr className={download.status === 1 ? "table-success" : ""} key={'download'+index}>
                            <th scope="row">{index+1}</th>
                            <td>{download.requested.toLocaleString()}</td>
                            <td>{download.downloadId}</td>
                            <td>{download.jobName}</td>
                            <td><div className={downloadStatusIcon[download.status]}></div> {downloadStatusText[download.status]}</td>
                            <td><button className="bi bi-download download-btn" onClick={() => downloadFile(download.url)} disabled={download.status !== 1} /></td>
                            <td><button className="bi bi-trash trash-btn" onClick={() => {
                                setDownloads(
                                    downloads.filter(d =>
                                        d.downloadId !== download.downloadId
                                    )
                                );
                            }}></button></td>
                        </tr>
                    );
                })}

                </tbody>
            </table>
        )
        }


    </div>
}

function downloadFile(url: string) {
    Notify.info("Downloading file...")
    window.open(url, "_blank");
}

function DownloadPage() {
    return <DefaultPageLayout content={<DownloadPageContent />} />
}
export default DownloadPage;