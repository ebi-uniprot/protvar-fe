export interface DownloadResponse {
    //inputType: string
    requested: string // "requested": "2024-06-20T22:02:31.157133154" in json
    downloadId: string // corresponds to the download file name (without ext): <id>[-fun][-pop][-str][-PAGE][-PAGE_SIZE][-ASSEMBLY]
    jobName: string
    url: string
    status: number // -1 (default, not available), 0 (not ready), 1 (ready)
}

export const recordFromResponse = (response: DownloadResponse) : DownloadRecord => {
    return {
        ...response
    }
}

export interface DownloadRecord extends DownloadResponse {
    // API DownloadResponse properties inherited

    // new properties, optional to allow backward compatibility (for existing DownloadRecords saved
    // in localStorage)
    // from DownloadStatus (status already present)
    size?: number
    //ttl?: number

    // from DownloadRequest
    page?: string
    pageSize?: string
    assembly?: string
    fun?: boolean
    pop?: boolean
    str?: boolean

    // new
    resultUrl?: string // to navigate to result from download list
}