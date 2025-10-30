import {InputType} from "./InputType";
//import {CaddCategory} from "./CaddCategory";
//import {AmClass} from "./AmClass";

export interface MappingRequest {
  input: string;
  type?: InputType;
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