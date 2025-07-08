import {InputType} from "../types/InputType";

export function resolve(input: string): InputType | null {
  const trimmed = input.trim();

  const ensemblRegex = /^ENS[GTP]\d{11}(\.\d+)?$/i;
  const uniprotRegex = /^([OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z]([0-9][A-Z][A-Z0-9]{2}){1,2}[0-9])(-[1-9][0-9]*)?$/i;
  const pdbRegex = /^[0-9][A-Za-z0-9]{3}$/;
  const refseqRegex = /^(NM|NP)_\d{6,}(\.\d+)?$/i;
  const inputIdRegex = /^[a-f0-9]{32}$/;
  const geneRegex = /^[A-Za-z0-9\-_]{2,}$/;

  if (ensemblRegex.test(trimmed)) return InputType.ENSEMBL;
  if (uniprotRegex.test(trimmed)) return InputType.UNIPROT;
  if (pdbRegex.test(trimmed)) return InputType.PDB;
  if (refseqRegex.test(trimmed)) return InputType.REFSEQ;
  if (inputIdRegex.test(trimmed)) return InputType.INPUT_ID;
  if (geneRegex.test(trimmed)) return InputType.GENE;

  return null;
}

export function isValid(value: string): value is InputType {
  const upper = value.toUpperCase();
  return Object.values(InputType).includes(upper as InputType);
}

export function fromString(value: string): InputType | null {
  return isValid(value) ? (value.toUpperCase() as InputType) : null;
}

export function normalize(input: string, type: string | InputType): string {
  const trimmed = input.trim();

  if (type === InputType.PDB || type === InputType.INPUT_ID) {
    return trimmed; // Preserve case
  }

  return trimmed.toUpperCase();
}