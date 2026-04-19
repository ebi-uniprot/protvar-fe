export type DownloadStatus = 'pending' | 'processing' | 'ready'

export interface StatusInfo { text: string; icon: string }

export const DOWNLOAD_STATUS_INFO: Record<DownloadStatus, StatusInfo> = {
  ready:      { text: 'Ready',      icon: 'download-ready' },
  processing: { text: 'Processing', icon: 'download-nr'    },
  pending:    { text: 'Pending',    icon: 'download-nr'    },
}

// Server response shape — matches the backend DTO exactly
export interface DownloadResponse {
  id: string            // download file name stem
  jobName: string
  fileUrl: string       // full file download URL
  status: DownloadStatus // string enum from backend
  requestedAt: string   // server ISO timestamp
}

// Per-file status entry from POST /download/status
export interface DownloadStatusEntry {
  status: DownloadStatus
  size: number
}

// Client-side record stored in localStorage
export interface DownloadRecord {
  id: string               // = server's id (download file name stem)
  jobName: string
  fileUrl: string          // = server's fileUrl
  status: DownloadStatus
  serverRequestedAt: string // server's "requestedAt" timestamp
  requestedAt: string      // client-side ISO timestamp
  resultId?: string        // cross-ref to ResultRecord.id
  resultUrl?: string       // relative URL to navigate back to the originating result page
  size?: number
  fun?: boolean
  pop?: boolean
  str?: boolean
  assembly?: string
  page?: number
  pageSize?: number
}

export const recordFromResponse = (
  response: DownloadResponse,
  requestedAt: string
): DownloadRecord => ({
  id: response.id,
  jobName: response.jobName,
  fileUrl: response.fileUrl,
  status: response.status,
  serverRequestedAt: response.requestedAt,
  requestedAt,
})
