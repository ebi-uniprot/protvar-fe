import axios, {AxiosResponse} from "axios";
import {API_HEADERS, API_URL, DOWNLOAD_URI, EMAIL_URI, G2P_MAPPING_URI} from "../constants/const";
import {FunctionalResponse} from "../types/FunctionalResponse";
import {PopulationObservationResponse} from "../types/PopulationObservationResponse";
import {ProteinStructureResponse} from "../types/ProteinStructureResponse";
import MappingResponse from "../types/MappingResponse";

const ProtVarAPI = axios.create({
    baseURL: API_URL
});

export function mappings(inputArr: string[], assembly?: string) {
    return ProtVarAPI.post<string[], AxiosResponse<MappingResponse>>(
            G2P_MAPPING_URI,
        inputArr,
            {
                params : { assembly },
                headers: API_HEADERS,
            }
        );
}

export function downloadMappings(inputArr: string[], functional: boolean, population: boolean, structure: boolean) {
    return ProtVarAPI.post<string[], AxiosResponse>(
        DOWNLOAD_URI,
        inputArr,
        {
            params : { function: functional, population, structure },
            headers: {
                'Content-Type': 'application/json',
                Accept: '*'
            },
        }
    );
}

export function emailFileInput(file: File, email: string, jobName: string, functional: boolean, population: boolean, structure: boolean) {
    const formData = new FormData();
    formData.append('file', file);
    return ProtVarAPI.post(
        EMAIL_URI + "/file",
        formData,
        {
            params : { email, jobName, function: functional, population, structure },
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        }
    );
}

export function emailTextInput(inputArr: string[], email: string, jobName: string, functional: boolean, population: boolean, structure: boolean) {
    return ProtVarAPI.post(
        EMAIL_URI + "/inputs",
        inputArr,
        {
            params : { email, jobName, function: functional, population, structure },
            headers: {
                'Content-Type': 'application/json',
                Accept: '*'
            },
        }
    );
}

export function getFunctionalData(url: string) {
    return ProtVarAPI.get<FunctionalResponse>(url).then(
        response => {
            if (response.data.interactions && response.data.interactions.length > 1) {
                response.data.interactions.sort((a, b) => b.pdockq - a.pdockq);
            }
            return response;
        }
    );
}

export function getPopulationData(url: string) {
    return ProtVarAPI.get<PopulationObservationResponse>(url);
}

export function getStructureData(url: string) {
    return ProtVarAPI.get<ProteinStructureResponse>(url);
}