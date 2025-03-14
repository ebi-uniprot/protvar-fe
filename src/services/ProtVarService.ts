import axios, {AxiosResponse} from 'axios';
import {setupCache} from 'axios-cache-interceptor/dist/index.bundle';
import {
  API_URL,
  CONTENT_MULTIPART,
  CONTENT_TEXT,
  DEFAULT_HEADERS
} from "../constants/const";
import {FunctionalResponse} from "../types/FunctionalResponse";
import {PopulationObservationResponse} from "../types/PopulationObservationResponse";
import {ProteinStructureResponse} from "../types/ProteinStructureResponse";
import MappingResponse from "../types/MappingResponse";
import {DownloadResponse} from "../types/DownloadRecord";
import {IDResponse, InputType, PagedMappingResponse} from "../types/PagedMappingResponse";


const instance = axios.create({
  baseURL: API_URL
});

const api = setupCache(instance, {})

// Coordinate Mapping
// POST /mappings
export function mappings(inputArr: string[], assembly?: string) {
  return api.post<any, string[], AxiosResponse<MappingResponse>>(
    `${API_URL}/mappings`, inputArr,
    {
      params: {assembly},
      headers: DEFAULT_HEADERS,
    }
  );
}

// POST /mapping/input
// IN: text
// OUT: PagedMappingResponse
// See getResult
export function submitInput(text: string, assembly?: string) {
  return api.post<PagedMappingResponse>(
    `${API_URL}/mapping/input`, text,
    {
      params: {assembly}, // idOnly defaults to false i.e. PagedMappingResponse is returned
      headers: CONTENT_TEXT
    }
  );
}

// POST /mapping/input
// IN: text
// OUT: IDResponse
export function submitInputText(text: string, assembly?: string, idOnly: boolean = true) {
  return api.post<IDResponse>(
    `${API_URL}/mapping/input`, text,
    {
      params: {assembly, idOnly},
      headers: CONTENT_TEXT
    }
  );
}

// POST /mapping/input
// IN: file
// OUT: IDResponse
export function submitInputFile(file: File, assembly?: string, idOnly: boolean = true) {
  const formData = new FormData();
  formData.append('file', file);
  return api.post<any, FormData, AxiosResponse<IDResponse>>(
    `${API_URL}/mapping/input`, formData,
    {
      params: {assembly, idOnly},
      headers: CONTENT_MULTIPART,
    }
  );
}

// GET /mapping/input/{id}
// IN: id
// OUT: PagedMappingResponse
export function getResult(inputType: InputType, id: string, page: number, pageSize: number, assembly: string|null = null) {
  let url = ''
  let params = {}

  if (inputType === InputType.ID) {
    url = `${API_URL}/mapping/input/${id}`
    params = {page, pageSize, assembly}
  } else {
    url = `${API_URL}/mapping/accession/${id}`
    params = {page, pageSize}
  }

  return api.get<PagedMappingResponse>(
    url,
    {
      params: params,
      headers: DEFAULT_HEADERS,
    }
  );
}

// Annotation
export function getFunctionalData(url: string) {
  return api.get<FunctionalResponse>(url).then(
    response => {
      if (response.data.interactions && response.data.interactions.length > 1) {
        response.data.interactions.sort((a, b) => b.pdockq - a.pdockq);
      }
      return response;
    }
  );
}

export function getPopulationData(url: string) {
  return api.get<PopulationObservationResponse>(url);
}

export function getStructureData(url: string) {
  return api.get<ProteinStructureResponse>(url);
}

// Download
export function downloadFileInput(file: File, assembly: string, email: string, jobName: string, functional: boolean, population: boolean, structure: boolean) {
  const formData = new FormData();
  formData.append('file', file);
  return api.post<any, FormData, AxiosResponse<DownloadResponse>>(
    `${API_URL}/download/fileInput`, formData,
    {
      params: {email, jobName, function: functional, population, structure, assembly},
      headers: CONTENT_MULTIPART,
    }
  );
}

export function downloadTextInput(inputArr: string[], assembly: string, email: string, jobName: string, functional: boolean, population: boolean, structure: boolean) {
  return api.post<any, string[], AxiosResponse<DownloadResponse>>(
    `${API_URL}/download/textInput`, inputArr,
    {
      params: {email, jobName, function: functional, population, structure, assembly},
      headers: DEFAULT_HEADERS,
    }
  );
}

export function downloadResult(input: string, inputType: string, page: string|null, pageSize: string|null, assembly: string|null,
                               email: string, jobName: string, functional: boolean, population: boolean, structure: boolean) {
  return api.post<any, string, AxiosResponse<DownloadResponse>>(
    `${API_URL}/download`, input,
    {
      params: {inputType, page, pageSize, assembly, email, jobName, function: functional, population, structure},
      headers: CONTENT_TEXT,
    }
  );
}

export function getDownloadStatus(ids: string[]) {
  return api.post(
    `${API_URL}/download/status`, ids,
    {
      headers: DEFAULT_HEADERS,
    }
  );
}
