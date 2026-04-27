export type DownloadStatus = 'queued' | 'processing' | 'ready' | 'failed' | 'expired'

export interface StatusInfo { text: string; icon: string }

export const DOWNLOAD_STATUS_INFO: Record<DownloadStatus, StatusInfo> = {
  ready:      { text: 'Ready',      icon: 'download-ready' },
  processing: { text: 'Processing', icon: 'download-nr'    },
  queued:     { text: 'Queued',     icon: 'download-nr'    },
  failed:     { text: 'Failed',     icon: 'download-nr'    },
  expired:    { text: 'Expired',    icon: 'download-nr'    },
}

// Lifecycle status — matches BE DownloadStatus DTO. Used both as the per-id
// entry in POST /download/status and as the nested `status` field in
// DownloadResponse.
export interface DownloadStatusEntry {
  state: DownloadStatus
  message?: string       // present on FAILED, optional info on READY
  size?: number          // file size in bytes (present on READY)
  queuedAt?: string      // server ISO timestamp
  startedAt?: string
  finishedAt?: string
}

// Submit response shape — matches the backend DTO exactly
export interface DownloadResponse {
  id: string            // server-allocated UUID; also the download file name stem
  jobName: string
  fileUrl: string       // full file download URL
  status: DownloadStatusEntry
}

// Client-side record stored in localStorage
export interface DownloadRecord {
  id: string               // = server's id (UUID)
  jobName: string
  fileUrl: string          // = server's fileUrl
  status: DownloadStatus
  message?: string         // populated on FAILED
  serverRequestedAt: string // server's "queuedAt" timestamp
  requestedAt: string      // client-side ISO timestamp
  finishedAt?: string      // server ISO timestamp
  resultId?: string        // cross-ref to ResultRecord.id
  resultUrl?: string       // relative URL to navigate back to the originating result page
  size?: number            // file size in bytes when status=ready
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
  status: response.status?.state ?? 'queued',
  serverRequestedAt: response.status?.queuedAt ?? requestedAt,
  requestedAt,
})
