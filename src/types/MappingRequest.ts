import {InputType} from "./InputType";
//import {CaddCategory} from "./CaddCategory";
//import {AmClass} from "./AmClass";

export interface MappingRequest {
  input: string;
  type?: InputType;
  page?: number | null;
  pageSize?: number | null;
  assembly?: string | null; //'auto' | 'grch38' | 'grch37'
  known?: boolean;
  cadd?: string[];
  am?: string[];
  popeve?: string[];  // NEW: popEVE categories
  interact?: boolean;
  pocket?: boolean;
  stability?: string[];
  sort?: string;
  order?: 'asc' | 'desc';
  // COMMENTED OUT - EVE range parameters
  // eveMin?: number;
  // eveMax?: number;
}