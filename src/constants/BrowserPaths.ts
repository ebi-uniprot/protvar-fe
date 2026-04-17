export const ABOUT = "/about"
export const CONTACT = "/contact"
export const RESULT = "/result" //[/:input]
export const QUERY = "/query"   // deprecated, kept for backward compat
export const SEARCH = "/search" // single-variant query (?q=) · identifier browse (?id=) · no-id browse (filters only)
                                // filters (?cadd=, ?am=, etc.) can be combined with any of the above
export const G_QUERY = "/g"     // direct genomic path: /g/:chr/:pos[/:ref/:alt]
export const P_QUERY = "/p"     // direct protein path: /p/:acc/:pos[/:ref/:alt]
// Type-prefixed identifier browse paths
export const ID_GENE = "/gene"
export const ID_PDB = "/pdb"
export const ID_ENSEMBL = "/ensembl"
export const ID_REFSEQ = "/refseq"
export const HOME = "/"
export const API_ERROR = "/error"
export const DOWNLOAD = "/download"
export const HELP = "/help"
export const RELEASE = "/release"