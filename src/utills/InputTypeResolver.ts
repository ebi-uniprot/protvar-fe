import {INPUT_TYPES, InputType} from "../types/InputType";

export function resolve(input: string): InputType | null {
  const trimmed = input.trim();

  const ensemblRegex = /^ENS[GTP]\d{11}(\.\d+)?$/i;
  const uniprotRegex = /^([OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z]([0-9][A-Z][A-Z0-9]{2}){1,2}[0-9])(-[1-9][0-9]*)?$/i;
  const pdbRegex = /^[0-9][A-Za-z0-9]{3}$/;
  const refseqRegex = /^(NM|NP)_\d{6,}(\.\d+)?$/i;
  const inputIdRegex = /^[a-f0-9]{32}$/;
  const geneRegex = /^[A-Za-z0-9\-_]{2,}$/;

  if (ensemblRegex.test(trimmed)) return 'ensembl';
  if (uniprotRegex.test(trimmed)) return 'uniprot';
  if (pdbRegex.test(trimmed)) return 'pdb';
  if (refseqRegex.test(trimmed)) return 'refseq';
  if (inputIdRegex.test(trimmed)) return 'input_id';
  if (geneRegex.test(trimmed)) return 'gene';

  return null;
}

export function isValid(value: string): value is InputType {
  return INPUT_TYPES.includes(value as InputType);
}

export function fromString(value: string): InputType | null {
  const lowercase = value.toLowerCase();
  return isValid(lowercase) ? lowercase : null;
}

export function normalize(input: string, type: InputType): string {
  const trimmed = input.trim();

  if (type === 'pdb' || type === 'input_id') {
    return trimmed; // Preserve case
  }

  return trimmed.toUpperCase();
}