import {InputType} from "./InputType";
//import {CaddCategory} from "./CaddCategory";
//import {AmClass} from "./AmClass";

export interface MappingRequest {
  input: string;
  type?: InputType;
  page?: number | null;
  pageSize?: number | null;
  assembly?: string | null; //'auto' | 'grch38' | 'grch37'
  cadd?: string[];
  am?: string[];
  stability?: string[];
  known?: boolean;
  pocket?: boolean;
  interact?: boolean;
  sort?: string;
  order?: 'asc' | 'desc';
  // Range parameters - add more as needed
  eveMin?: number;
  eveMax?: number;
}