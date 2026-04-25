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
}

export interface InputUploadResponse {
  inputId: string
}