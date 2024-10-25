import axios from "axios";

export const ALPHAFILL_URL = 'https://alphafill.eu/v1/aff/'
//const ALPHAFILL_JSON = 'https://alphafill.eu/v1/aff/{accession}/json'

export const hasAlphafillStructure = async (accession: string): Promise<boolean> => {
    const url = ALPHAFILL_URL +  accession
    try {
        const response = await axios.head(url);
        return response.status === 200;
    } catch (error) {
        console.error('Error checking file:', error);
        return false;
    }
};