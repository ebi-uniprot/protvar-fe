import {Identifier, IDENTIFIER_TYPES, IdentifierType, INPUT_TYPES, InputType} from "../types/InputType";

// 32-char hex — identifies an uploaded result (resultId), not a browsable identifier
export const INPUT_ID_REGEX = /^[a-f0-9]{32}$/;

export function resolve(input: string): InputType | null {
  const trimmed = input.trim();

  const ensemblRegex = /^ENS[GTP]\d{11}(\.\d+)?$/i;
  const uniprotRegex = /^([OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z]([0-9][A-Z][A-Z0-9]{2}){1,2}[0-9])(-[1-9][0-9]*)?$/i;
  const pdbRegex = /^[0-9][A-Za-z0-9]{3}$/;
  const refseqRegex = /^(NM|NP)_\d{6,}(\.\d+)?$/i;
  const geneRegex = /^[A-Za-z0-9\-_]{2,}$/;

  if (ensemblRegex.test(trimmed)) return 'ensembl';
  if (uniprotRegex.test(trimmed)) return 'uniprot';
  if (pdbRegex.test(trimmed)) return 'pdb';
  if (refseqRegex.test(trimmed)) return 'refseq';
  if (INPUT_ID_REGEX.test(trimmed)) return 'input_id';
  if (geneRegex.test(trimmed)) return 'gene';

  return null;
}

/**
 * Resolve a string to a biological IdentifierType, skipping uploaded result IDs.
 * Returns null for 32-char hex strings (those go via resultId, not ids[]).
 */
export function resolveIdentifier(input: string): IdentifierType | null {
  const trimmed = input.trim();

  const ensemblRegex = /^ENS[GTP]\d{11}(\.\d+)?$/i;
  const uniprotRegex = /^([OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z]([0-9][A-Z][A-Z0-9]{2}){1,2}[0-9])(-[1-9][0-9]*)?$/i;
  const pdbRegex = /^[0-9][A-Za-z0-9]{3}$/;
  const refseqRegex = /^(NM|NP)_\d{6,}(\.\d+)?$/i;
  const geneRegex = /^[A-Za-z0-9\-_]{2,}$/;

  // Skip uploaded result IDs — they're not biological identifiers
  if (INPUT_ID_REGEX.test(trimmed)) return null;

  if (ensemblRegex.test(trimmed)) return 'ensembl';
  if (uniprotRegex.test(trimmed)) return 'uniprot';
  if (pdbRegex.test(trimmed)) return 'pdb';
  if (refseqRegex.test(trimmed)) return 'refseq';
  if (geneRegex.test(trimmed)) return 'gene';

  return null;
}

export function isValidInputType(value: string): value is InputType {
  return INPUT_TYPES.includes(value as InputType);
}

export function isValidIdentifierType(value: string): value is IdentifierType {
  return IDENTIFIER_TYPES.includes(value as IdentifierType);
}

/** @deprecated Use isValidInputType or isValidIdentifierType */
export function isValid(value: string): value is InputType {
  return isValidInputType(value);
}

export function fromString(value: string): InputType | null {
  const lowercase = value.toLowerCase();
  return isValidInputType(lowercase) ? lowercase : null;
}

/**
 * Parse a single ?id= parameter value into a typed Identifier.
 * Accepts "type:value" (explicit) or bare value (auto-detected).
 * Does NOT return input_id — bare 32-char hex values are not valid browse identifiers.
 * Examples:
 *   "gene:BRCA2"   → { type: 'gene',    value: 'BRCA2' }
 *   "P22304"       → { type: 'uniprot', value: 'P22304' }
 *   "6ioz"         → { type: 'pdb',     value: '6ioz' }
 */
export function parseIdParam(raw: string): Identifier {
  const trimmed = raw.trim();
  const colonIdx = trimmed.indexOf(':');
  if (colonIdx > 0) {
    const prefix = trimmed.substring(0, colonIdx).toLowerCase();
    const value = trimmed.substring(colonIdx + 1);
    if (isValidIdentifierType(prefix)) return { type: prefix as IdentifierType, value };
  }
  // Auto-detect from value format; fall back to 'gene' for ambiguous symbols
  const detected = resolveIdentifier(trimmed) ?? 'gene';
  return { type: detected, value: trimmed };
}

export function normalize(input: string, type: IdentifierType | InputType): string {
  const trimmed = input.trim();

  if (type === 'pdb') {
    return trimmed; // Preserve case
  }

  return trimmed.toUpperCase();
}
