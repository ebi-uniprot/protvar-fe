import axios, {AxiosResponse} from 'axios';
import { setupCache } from 'axios-cache-interceptor/dist/index.bundle';
import {API_HEADERS, API_URL, DOWNLOAD_STATUS, G2P_MAPPING_URI} from "../constants/const";
import {FunctionalResponse} from "../types/FunctionalResponse";
import {PopulationObservationResponse} from "../types/PopulationObservationResponse";
import {ProteinStructureResponse} from "../types/ProteinStructureResponse";
import MappingResponse from "../types/MappingResponse";
import {DownloadResponse} from "../types/DownloadResponse";


const instance = axios.create({
    baseURL: API_URL
});

const api = setupCache(instance, {})

export function mappings(inputArr: string[], assembly?: string) {
    return api.post<any, string[], AxiosResponse<MappingResponse>>(
            G2P_MAPPING_URI,
        inputArr,
            {
                params : { assembly },
                headers: API_HEADERS,
            }
        );
}


export function downloadFileInput(file: File, assembly: string, email: string, jobName: string, functional: boolean, population: boolean, structure: boolean) {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<any, FormData, AxiosResponse<DownloadResponse>>(
        `${API_URL}/download/fileInput`,
        formData,
        {
            params : { email, jobName, function: functional, population, structure, assembly },
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        }
    );
}

export function downloadTextInput(inputArr: string[], assembly: string, email: string, jobName: string, functional: boolean, population: boolean, structure: boolean) {
    return api.post<any, string[], AxiosResponse<DownloadResponse>>(
        `${API_URL}/download/textInput`,
        inputArr,
        {
            params : { email, jobName, function: functional, population, structure, assembly },
            headers: {
                'Content-Type': 'application/json',
                Accept: '*'
            },
        }
    );
}

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

export function getDownloadStatus(ids: string[]) {
    return api.post(
        DOWNLOAD_STATUS,
        ids,
        {
            headers: {
                'Content-Type': 'application/json',
                Accept: '*'
            },
        }
    );
}