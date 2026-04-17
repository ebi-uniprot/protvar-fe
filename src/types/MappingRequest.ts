import {IdInput} from "./InputType";
//import {CaddCategory} from "./CaddCategory";
//import {AmClass} from "./AmClass";

// All browse requests (single-id, multi-id, or filter-only) use the `ids` array.
// Single-id: ids = [{ type, value }]; multi-id: ids = [{...}, {...}]; filter-only: ids omitted.
// Type resolution follows the same rule as ?id= URL params: the frontend resolves via
// parseIdParam() before sending; the backend auto-detects if type is null.
export interface MappingRequest {
  ids?: IdInput[];
  page?: number | null;
  pageSize?: number | null;
  assembly?: string | null; //'auto' | 'grch38' | 'grch37'

  // Variant Type
  known?: boolean;

  // Functional (to be implemented)
  ptm?: boolean;
  mutagenesis?: boolean;
  conservationMin?: number;
  conservationMax?: number;
  functionalDomain?: boolean;

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

  // Sorting
  sort?: string;
  order?: 'asc' | 'desc';
}