import {InputType} from "./InputType";
//import {CaddCategory} from "./CaddCategory";
//import {AmClass} from "./AmClass";

export interface MappingRequest {
  input: string;
  type?: InputType | null;
  page?: number | null;
  pageSize?: number | null;
  assembly?: string | null; //'AUTO' | 'GRCh37' | 'GRCh38';
  cadd?: string[];
  am?: string[];
  known?: boolean;
  sort?: string;
  order?: 'asc' | 'desc';
}