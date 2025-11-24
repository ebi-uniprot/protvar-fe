import axios from "axios";
import {setupCache} from "axios-cache-interceptor/dist/index.bundle";
import {ALPHAFOLD_URL} from "../constants/ExternalUrls";
import {AlphafoldResponse} from "../types/AlphafoldResponse";


const instance = axios.create({
    baseURL: ALPHAFOLD_URL
});

const api = setupCache(instance, {})

export function getPredictedStructure(url: string) {
  return api.get<AlphafoldResponse>(url);
}
