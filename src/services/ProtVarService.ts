import {PredictionInfo} from "../types/Prediction";
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
import {DownloadResponse, DownloadStatusEntry} from "../types/DownloadRecord";
import {InputUploadResponse, MessageCatalogueEntry, PagedMappingResponse} from "../types/PagedMappingResponse";
import {DownloadRequest} from "../types/DownloadRequest";
import {Dataset} from "../types/Dataset";
import {MappingRequest} from "../types/MappingRequest";
import {ModelInfo, VectorSearchResponse} from "../types/VectorSearch";
import {StatusResponse} from "../types/StatusResponse";

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

// GET /mapping?q=...
// Single variant mapping (used for direct /search, /g/, /p/ queries)
export function singleVariant(q: string, assembly?: string) {
  return api.get<PagedMappingResponse>(
    `${API_URL}/mapping`,
    {
      params: {q, assembly},
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
// UniProt annotations (/function) and predictions (/prediction, one call) at a position, in parallel, merged into the
// FunctionalInfo shape the Function tab uses. The single-score fields are for the variant AA, so they're only set
// when the prediction call was narrowed to one (variantAA).
export function getFunctionalData(functionUrl: string, predictionUrl?: string) {
  return Promise.all([
    api.get<FunctionalInfo>(functionUrl),
    predictionUrl ? api.get<PredictionInfo>(predictionUrl) : Promise.resolve(undefined),
  ]).then(([response, prediction]) => {
    const p = prediction?.data;
    if (p) {
      const one = <T,>(list?: T[]) => (p.variantAA ? list?.[0] : undefined);
      Object.assign(response.data, {
        pockets: p.pocket ?? [],
        interactions: p.interface ?? [],   // highest pDockQ first
        foldxs: p.foldx ?? [],
        conservScore: p.conserv,
        eveScore: one(p.eve),
        esmScore: one(p.esm),
        popEveScore: one(p.popeve),
        m3dPred: one(p.m3d),
      });
    }
    return response;
  });
}

// Predictions at a position (GET /prediction), optionally only some keys (include)
export function getPredictionData(accession: string, position: number, include?: string[]) {
  const q = include?.length ? `?include=${include.join(',')}` : '';
  return api.get<PredictionInfo>(`${API_URL}/prediction/${accession}/${position}${q}`);
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
  return api.post<Record<string, DownloadStatusEntry>>(
    `${API_URL}/download/status`, ids,
    {
      headers: DEFAULT_HEADERS,
    }
  );
}

// The message catalogue (codes, severity, labels): changes only with a BE release
export function getMessageCatalogue() {
  return api.get<MessageCatalogueEntry[]>(`${API_URL}/messages`, { cache: { ttl: 24 * 60 * 60 * 1000 } });
}

// Ready-made datasets: change only when protvar-production rebuilds them
export function getDatasets() {
  return api.get<Dataset[]>(`${API_URL}/datasets`, { cache: { ttl: 60 * 60 * 1000 } });
}

export function getServiceStatus() {
  return api.get<StatusResponse>(
    `${API_URL}/status`,
    { headers: APP_JSON, cache: false }
  );
}

// Direct probe of the MCP server, sibling to the BE under /ProtVar/mcp.
// Lets the FE distinguish "MCP is up" from "BE can't tell us about MCP".
const MCP_STATUS_URL = API_URL?.replace(/\/api$/, '/mcp/status');

export function getMcpStatus() {
  if (!MCP_STATUS_URL) return Promise.reject(new Error('MCP URL not configured'));
  return api.get<string>(MCP_STATUS_URL, { cache: false });
}

export function vectorSearch(text: string, limit: number = 10, offset: number = 0, model?: string) {
  return api.get<VectorSearchResponse>(
    `${API_URL}/semantic-search`,
    {
      params: { text, limit, offset, model },
      headers: APP_JSON,
    }
  );
}

let _modelsPromise: Promise<ModelInfo[]> | null = null;

export function getSemanticSearchModels(): Promise<ModelInfo[]> {
  if (!_modelsPromise) {
    _modelsPromise = api
      .get<ModelInfo[]>(`${API_URL}/semantic-search/models`, { headers: APP_JSON })
      .then((r) => r.data)
      .catch(() => {
        _modelsPromise = null;
        return [];
      });
  }
  return _modelsPromise;
}
