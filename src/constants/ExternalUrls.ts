// Every external link the UI uses lives here. link-check/check-links.ts tests
// each one daily (scheduled GitLab pipeline) and fails if a constant has no check.

// --- Result table ---
// Ensembl stable-ID resolver: works for ENSG/ENST/ENSP (pass unversioned IDs)
export const ENSEMBL_ID_URL = "https://www.ensembl.org/id/"
// GRCh38 genome browser; focus is required, location alone renders nothing
export const ENSEMBL_BROWSER_URL = "https://www.ensembl.org/genome-browser/GCA_000001405.29"
export const getEnsemblIdUrl = (id: string) => ENSEMBL_ID_URL + id.split('.')[0];
export const getEnsemblViewUrl = (chr: string, pos: number) => {
  const loc = `${chr}:${pos}-${pos}`;
  return `${ENSEMBL_BROWSER_URL}?focus=location:${loc}&location=${loc}`;
};
export const UNIPROT_ACCESSION_URL = "https://www.uniprot.org/uniprot/"
export const DBSNP_URL = "https://www.ncbi.nlm.nih.gov/snp/"
export const CLINVAR_RCV_URL = "https://www.ncbi.nlm.nih.gov/clinvar/"
export const CLINVAR_VCV_URL = "https://www.ncbi.nlm.nih.gov/clinvar/variation/"
export const COSMIC_URL = "https://cancer.sanger.ac.uk/cosmic/search?q="
export const CADD_INFO_URL = "https://cadd.gs.washington.edu/info"
export const AVI_INFO_URL = "https://deepmind.google.com/science/alphagenome/"
export const AM_INFO_URL = "https://alphamissense.hegelab.org/"

// --- Annotations (function / population / structure) ---
export const RHEA_URL = "https://www.rhea-db.org/rhea/";
export const INTACT_URL = "https://www.ebi.ac.uk/intact/search?query="
export const PUBMED_URL = "https://pubmed.ncbi.nlm.nih.gov/"
export const MISSENSE3D_URL = "https://missense3d.bc.ic.ac.uk/~missense3d2/results-details.html"
export const GNOMAD_VARIANT_URL = "https://gnomad.broadinstitute.org/variant/"
export const PDB_URL_INTERFACE_BY_PROTEIN = "https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/";
export const ALPHAFOLD_URL_INTERFACE_BY_PROTEIN = "https://alphafold.ebi.ac.uk/entry/";

// --- APIs fetched by the UI ---
export const ALPHAFOLD_URL = "https://alphafold.ebi.ac.uk/api/prediction/";
export const ALPHAFILL_URL = "https://alphafill.eu/v1/aff/"
export const PUBMED_EUTILS_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils"

// --- Help, footer, About and Contact pages ---
export const ENSEMBL_HOME_URL = "https://www.ensembl.org/"
export const ENSEMBL_VEP_URL = "https://www.ensembl.org/tools/vep"
export const UNIPROT_HOME_URL = "https://www.uniprot.org/"
export const OPEN_TARGETS_URL = "https://www.opentargets.org/"
export const DECIPHER_URL = "https://www.deciphergenomics.org/"
export const PDBE_URL = "https://www.ebi.ac.uk/pdbe/"
export const ALPHAFOLD_HOME_URL = "https://alphafold.ebi.ac.uk/"
export const CADD_HOME_URL = "https://cadd.gs.washington.edu/"
export const EVE_URL = "https://evemodel.org/"
export const FOLDX_URL = "https://foldxsuite.crg.eu/"
export const COSMIC_HOME_URL = "https://cancer.sanger.ac.uk/cosmic"
export const MOLSTAR_URL = "https://molstar.org/"
export const NCBI_URL = "https://www.ncbi.nlm.nih.gov/"
export const CROSSMAP_URL = "https://crossmap.sourceforge.net/"
export const VARSITE_URL = "https://www.ebi.ac.uk/thornton-srv/databases/VarSite"
export const MCP_SPEC_URL = "https://modelcontextprotocol.io/"
export const PROTVAR_PAPER_URL = "https://doi.org/10.1093/nar/gkae413"
export const PROTVAR_VIDEO_URL = "https://www.youtube.com/watch?v=6dsbozAi1lk"
export const PROTVAR_TWITTER_URL = "https://twitter.com/EBIProtVar"
export const CONTACT_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfVhyTjeH5NG0QnYU0LozFR1tlkiNvl8nN5g5pIrcL76yO4YA/viewform?embedded=true"
export const CC_BY_URL = "https://creativecommons.org/licenses/by/4.0/"
export const EBI_URL = "https://www.ebi.ac.uk/"
export const EMBL_URL = "https://www.embl.org/"
export const EMBL_DE_URL = "https://www.embl.de/"
export const EBI_TEAM_URL = "https://www.ebi.ac.uk/about/teams/protein-function-development/"
export const EBI_PERSON_URL = "https://www.ebi.ac.uk/people/person/"
export const EBI_TERMS_URL = "https://www.ebi.ac.uk/about/terms-of-use"
export const EBI_PRIVACY_URL = "https://www.ebi.ac.uk/data-protection/privacy-notice/embl-ebi-public-website"
