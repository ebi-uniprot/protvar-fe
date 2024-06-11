import { MappingResponse } from "./MappingResponse";

export interface PagedMappingResponse {
  content: MappingResponse
  resultId: string
  pageNo: number
  pageSize: number
  totalElements: number
  totalPages: number
  last: boolean
}