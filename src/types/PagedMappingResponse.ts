import { MappingResponse } from "./MappingResponse";

export interface PagedMappingResponse {
  content: MappingResponse
  page: number
  pageSize: number
  assembly?: string
  totalItems: number
  totalPages: number
  last: boolean
}

export interface InputUploadResponse {
  inputId: string
}