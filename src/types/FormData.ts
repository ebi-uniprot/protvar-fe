import {Assembly, DEFAULT_ASSEMBLY} from "../constants/CommonTypes";

export interface FormData {
    userInputs: string[]
    file: File | null
    assembly: Assembly
}

export const initialFormData = {
    userInputs: [],
    file: null,
    assembly: DEFAULT_ASSEMBLY
}