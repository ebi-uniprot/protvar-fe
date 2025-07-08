import { MappingResponse } from "./MappingResponse";
import {InputType} from "./InputType";

export interface PagedMappingResponse {
  content: MappingResponse
  input: string
  type: InputType
  page: number
  pageSize: number
  assembly?: string
  totalItems: number
  totalPages: number
  last: boolean
  //ttl: number
}

export interface InputUploadResponse {
  inputId: string
}