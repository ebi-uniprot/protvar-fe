import axios from "axios";

export const ALPHAFILL_URL = 'https://alphafill.eu/v1/aff/'
//const ALPHAFILL_JSON = 'https://alphafill.eu/v1/aff/{accession}/json'

export const hasAlphafillStructure = async (accession: string): Promise<boolean> => {
  const url = ALPHAFILL_URL + accession;
  console.log('Checking AlphaFill structure:', url);
  try {
    // Note: Using GET instead of HEAD because HEAD returns 200 for both
    // existing and non-existing files (e.g., both Q8IZQ1 and P22304 return 200 with HEAD,
    // but only P22304 actually exists). GET properly returns 404 for missing files.
    const response = await axios.get(url, { timeout: 5000 });
    console.log('AlphaFill GET status:', response.status);
    return response.status === 200;
  } catch (error: any) {
    console.log('AlphaFill GET failed:', error.response?.status || error.message);
    return false;
  }
};