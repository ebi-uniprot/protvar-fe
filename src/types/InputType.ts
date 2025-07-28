export enum InputType { // need to align with backend // to rename to SearchType? QueryType?
  GENE = "GENE",           // Most common - users often search by gene name
  VARIANT = "VARIANT",     // Second most common - specific variants
  REFSEQ = "REFSEQ",      // Reference sequences
  ENSEMBL = "ENSEMBL",    // Other gene/transcript IDs
  UNIPROT = "UNIPROT",    // Protein IDs
  PDB = "PDB",            // Protein structures
  INPUT_ID = "INPUT_ID"   // Generic/fallback option
}