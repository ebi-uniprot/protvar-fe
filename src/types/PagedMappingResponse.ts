import { MappingResponse } from "./MappingResponse";

export interface PagedMappingResponse {
  content: MappingResponse
  page: number
  pageSize: number
  assembly?: string
  totalItems: number
  totalPages: number
  // Upper bound on totalItems. Set on the filter-only browse path (where the
  // BE caps COUNT(*) to bound query cost); null on identifier / variant /
  // uploaded-result paths. If totalItems > totalCap, the actual count is
  // "more than totalCap" — display as e.g. "10,000+".
  totalCap?: number | null
  last: boolean
  // Uploaded result being prepared for filter/sort (large uploads build in the background): progress 0–99.
  // Content is empty meanwhile; re-send the same request until this is absent.
  preparing?: number | null
  // Uploaded result only: the upload's total inputs whatever the filters (totalItems = the matching ones)
  totalInputs?: number | null
  // Uploaded result only: what happened to its lines (see UploadSummary)
  uploadSummary?: UploadSummary | null
}

// Lines and formats are known from upload; preparing (0–99) while the upload is prepared in the background;
// then the counts. A line counts once per note code; withNotes = lines with any note.
export interface UploadSummary {
  lines: number
  formats?: Record<string, number>
  preparing?: number
  mapped?: number
  notMapped?: number
  withNotes?: number
  codes?: Record<string, number>
}

// One entry of the message catalogue (GET /messages); text may hold format placeholders
export interface MessageCatalogueEntry {
  code: string
  type: 'INFO' | 'WARN' | 'ERROR'
  label: string
  text: string
}

export interface InputUploadResponse {
  inputId: string
}