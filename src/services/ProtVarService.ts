import qs from 'qs';
import axios, {AxiosResponse} from 'axios';
import {setupCache} from 'axios-cache-interceptor/dist/index.bundle';
import {
  API_URL,
  DEFAULT_HEADERS
} from "../constants/const";
import {FunctionalInfo} from "../types/FunctionalInfo";
import {PopulationObservation} from "../types/PopulationObservation";
import {PdbeStructure} from "../types/PdbeStructure";
import {DownloadResponse} from "../types/DownloadRecord";
import {InputUploadResponse, PagedMappingResponse} from "../types/PagedMappingResponse";
import {DownloadRequest} from "../types/DownloadRequest";
import {MappingRequest} from "../types/MappingRequest";

export const APP_JSON = {"Content-Type": "application/json"}
export const TEXT_PLAIN = {"Content-Type": "text/plain"}
export const MULTIPART_FORMDATA = {"Content-Type": "multipart/form-data"}


const instance = axios.create({
  baseURL: API_URL,
  paramsSerializer: (params) =>
    qs.stringify(params, { arrayFormat: 'repeat' }) // cadd=low&cadd=high
});

const api = setupCache(instance, {})

// Input Upload
export function uploadText(text: string, assembly?: string) {
  return api.post<InputUploadResponse>(
    `${API_URL}/input/text`, text,
    {
      params: {assembly},
      headers: TEXT_PLAIN
    }
  );
}

export function uploadFile(file: File, assembly?: string) {
  const formData = new FormData();
  formData.append('file', file);
  return api.post<any, FormData, AxiosResponse<InputUploadResponse>>(
    `${API_URL}/input/file`, formData,
    {
      params: {assembly},
      headers: MULTIPART_FORMDATA
    }
  );
}

// Mapping

// GET /mapping/single
// Single variant mapping (used in QueryPage/direct link)
export function singleVariant(input: string, assembly?: string) {
  return api.get<PagedMappingResponse>(
    `${API_URL}/mapping/single`,
    {
      params: {input, assembly},
      headers: APP_JSON,
    }
  );
}

// GET /mapping/{inputId}
// Used on page redirect after inputText/File upload
// Used for URL /result/:inputId
export function inputIdMapping(inputId: string,
                               page?: number,
                               pageSize?: number,
                               assembly?: string) {
  return api.get<PagedMappingResponse>(
    `${API_URL}/mapping/${inputId}`,
    {
      params: {page, pageSize, assembly},
      headers: APP_JSON,
    }
  );
}

// POST  /mapping (json or form)
// OUT: PagedMappingResponse
export function getMapping(request: MappingRequest) {
  return api.post<PagedMappingResponse>(
    `${API_URL}/mapping`,
    request, // send the MappingRequest as the JSON body
    {
      headers: APP_JSON,
    }
  );
}

// Annotation
export function getFunctionalData(url: string) {
  return api.get<FunctionalInfo>(url).then(
    response => {
      if (response.data.interactions && response.data.interactions.length > 1) {
        response.data.interactions.sort((a, b) => b.pdockq - a.pdockq);
      }
      return response;
    }
  );
}

export function getPopulationData(url: string) {
  return api.get<PopulationObservation>(url);
}

export function getStructureData(url: string) {
  return api.get<PdbeStructure[]>(url);
}

// Download
export function downloadPost(request: DownloadRequest) {
  return api.post<any, DownloadRequest, AxiosResponse<DownloadResponse>>(
    `${API_URL}/download`,
    request,
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

export function downloadStatus(ids: string[]) {
  return api.post(
    `${API_URL}/download/status`, ids,
    {
      headers: DEFAULT_HEADERS,
    }
  );
}
