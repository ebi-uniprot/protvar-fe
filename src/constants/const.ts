export const API_URL = process.env.REACT_APP_API_BASE_URL;
export const NO_OF_ITEMS_PER_PAGE = 25;
export const PAGE_SIZES = [25, 50, 100]
export const PAGE_SIZE = 25
export const G2P_MAPPING_URI = `${API_URL}/mappings`;
export const DEFAULT_HEADERS = {"Content-Type": "application/json", Accept: "*"};

export const CONTENT_TEXT = {"Content-Type": "text/plain"}
export const CONTENT_MULTIPART = {"Content-Type": "multipart/form-data"}
export const DOWNLOAD_STATUS=`${API_URL}/download/status`;
export const LOCAL_DOWNLOADS='PV_downloads';
export const LOCAL_RESULTS='PV_results';
export const DISMISS_BANNER = 'PV_banner';

// TODO resubscribe option - clears the localData
export const SUBSCRIPTION_STATUS = 'PV_subscribed';
export const TITLE='EMBL-EBI ProtVar - Contextualising human missense variation'
export const PV_FTP = 'https://ftp.ebi.ac.uk/pub/databases/ProtVar'