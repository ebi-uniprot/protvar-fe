import { MappingResponse } from "./MappingResponse";
import {DEFAULT_PAGE, DEFAULT_PAGE_SIZE} from "../constants/const";

// InputType          Mapping endpoint        Download endpoint   Cache   Response
// ID                 /mapping/input/${id}    /download           Y       PagedMappingResponse
// PROTEIN_ACCESSION  /mapping/protein/${id}  /download           N       PagedMappingResponse
// SINGLE_VARIANT     /mappings               ?                   N       MappingResponse
export enum InputType {ID, PROTEIN_ACCESSION, SINGLE_VARIANT}
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