import {Identifier} from "./InputType";

// Requests use one of:
//   q         — single variant query (any supported format)
//   resultId  — uploaded result (32-char hex from POST /input/text or /input/file)
//   ids       — biological identifier browse (single or multi)
//   neither   — filter-only browse (no identifier constraint)
export interface MappingRequest {
  q?: string;
  resultId?: string;
  ids?: Identifier[];
  page?: number | null;
  pageSize?: number | null;
  assembly?: string | null;

  // Variant Type
  known?: boolean;

  // Functional — wired to BE filters on function_feature.type (via FeatureGroup)
  ptm?: boolean;
  mutagen?: boolean;
  domain?: boolean;
  conservationMin?: number;
  conservationMax?: number;

  // Population (to be implemented)
  diseaseAssociation?: boolean;
  alleleFreq?: string[];

  // Structural
  experimentalModel?: boolean;
  interact?: boolean;
  pocket?: boolean;
  stability?: string[];

  // Consequence
  cadd?: string[];
  am?: string[];
  popeve?: string[];
  esm1bMin?: number;
  esm1bMax?: number;

  // Position range filter — single UniProt accession browse only; ignored otherwise
  startPos?: number;
  endPos?: number;

  // Sorting
  sort?: string;
  order?: 'asc' | 'desc';
}
