import axios from "axios";
import {ALPHAFOLD_URL} from "../constants/ExternalUrls";
import {AlphafoldResponse} from "../types/AlphafoldResponse";

const AlphafoldAPI = axios.create({
    baseURL: ALPHAFOLD_URL
});


export function getPredictedStructure(url: string) {
    return AlphafoldAPI.get<AlphafoldResponse>(url);
}
