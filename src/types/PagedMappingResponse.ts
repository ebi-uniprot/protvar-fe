import { MappingResponse } from "./MappingResponse";

export interface PagedMappingResponse {
  content: MappingResponse
  id: string
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  last: boolean
}

export interface IDResponse {
  id: string
}