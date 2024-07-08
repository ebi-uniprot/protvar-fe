export const TITLE='EMBL-EBI ProtVar - Contextualising human missense variation'

// URLs
export const API_URL = process.env.REACT_APP_API_BASE_URL;
export const API_MAPPINGS = `${API_URL}/mappings`;
export const API_DOWNLOAD_STATUS=`${API_URL}/download/status`;
export const PV_FTP = 'https://ftp.ebi.ac.uk/pub/databases/ProtVar'

// Results pagination constants
export const PERMITTED_PAGE_SIZES = [25, 50, 100]
export const DEFAULT_PAGE = 1
export const DEFAULT_PAGE_SIZE = 25

// Request and response content types
export const DEFAULT_HEADERS = {"Content-Type": "application/json", Accept: "*"};

export const CONTENT_TEXT = {"Content-Type": "text/plain"}
export const CONTENT_MULTIPART = {"Content-Type": "multipart/form-data"}

// Local storage keys
export const LOCAL_DOWNLOADS='PV_downloads';
export const LOCAL_RESULTS='PV_results';
export const LOCAL_BANNER = 'PV_banner';

// TODO resubscribe option - clears the localData
export const LOCAL_SUBSCRIBED = 'PV_subscribed';