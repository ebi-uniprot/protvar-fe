import { MappingResponse } from "./MappingResponse";
import {DEFAULT_PAGE, DEFAULT_PAGE_SIZE} from "../constants/const";

export enum ResultType {SEARCH, PROTEIN}
export interface PagedMappingResponse {
  content: MappingResponse
  id: string
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  last: boolean
}

export const toPagedMappingResponse = (mappingResponse: MappingResponse): PagedMappingResponse => {
  return {content: mappingResponse,
    id: "",
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    totalItems: 1,
    totalPages: 1,
    last: true
  }
}

export interface IDResponse {
  id: string
}