import { MappingResponse } from "./MappingResponse";
import {DEFAULT_PAGE, DEFAULT_PAGE_SIZE} from "../constants/const";

// Type             Mapping endpoint        Download endpoint   Cache   Response
// CUSTOM_INPUT     /mapping/input/${id}    /download           Y       PagedMappingResponse
// PROTEIN_ACC      /mapping/protein/${id}  /download           N       PagedMappingResponse
// DIRECT_QUERY     /mappings               ?                   N       MappingResponse
export enum ResultType {CUSTOM_INPUT, PROTEIN_ACC, DIRECT_QUERY}
export interface PagedMappingResponse {
  content: MappingResponse
  id: string
  page: number
  pageSize: number
  assembly?: string
  totalItems: number
  totalPages: number
  last: boolean
  ttl: number
}

export const toPagedMappingResponse = (mappingResponse: MappingResponse): PagedMappingResponse => {
  return {content: mappingResponse,
    id: "",
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    totalItems: 1,
    totalPages: 1,
    last: true,
    ttl: 0
  }
}

export interface IDResponse {
  id: string
}