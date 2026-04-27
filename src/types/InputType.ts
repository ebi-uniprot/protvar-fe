// InputType.ts

/**
 * Biological identifier types for browse queries.
 * These map to database identifiers — not variant queries or uploaded result IDs.
 */
export type IdentifierType =
  | 'uniprot'
  | 'gene'
  | 'pdb'
  | 'ensembl'
  | 'refseq';

/** A resolved biological identifier with its detected or declared type */
export interface Identifier {
  type: IdentifierType;
  value: string;
}

/**
 * Full input type union — extends IdentifierType with variant query and uploaded result ID.
 * Used in contexts where all input modes are relevant (e.g. displaying context labels,
 * type-prefixed routes).
 */
export type InputType =
  | IdentifierType
  | 'variant'
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

/** @deprecated Use IdInput for backward compat; prefer Identifier for new code */
export interface IdInput {
  type: InputType;
  value: string;
}

export const IDENTIFIER_TYPES: IdentifierType[] = ['uniprot', 'gene', 'pdb', 'ensembl', 'refseq'];

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
