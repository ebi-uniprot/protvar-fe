// InputType.ts
export type InputType = // need to align with backend // to rename to SearchType? QueryType?
  | 'gene'
  | 'variant'
  | 'refseq'
  | 'ensembl'
  | 'uniprot'
  | 'pdb'
  | 'input_id';

// Helper constants for display purposes
export const INPUT_TYPE_LABELS: Record<InputType, string> = {
  gene: 'Gene Symbol',
  variant: 'Variant',
  refseq: 'RefSeq ID',
  ensembl: 'Ensembl ID',
  uniprot: 'UniProt ID',
  pdb: 'PDB ID',
  input_id: 'Input ID'
};

export const INPUT_TYPE_EXAMPLES: Record<InputType, string> = {
  gene: 'e.g. BRCA2',
  variant: 'e.g. chr17:g.43092919G>A',
  refseq: 'e.g. NM_000059.4',
  ensembl: 'e.g. ENSG00000139618',
  uniprot: 'e.g. P22304',
  pdb: 'e.g. 6ioz',
  input_id: 'e.g. genomic input examples'
};

// All valid input types as array (for validation, dropdowns, etc.)
export const INPUT_TYPES: InputType[] = [
  'gene',
  'variant',
  'refseq',
  'ensembl',
  'uniprot',
  'pdb',
  'input_id'
];