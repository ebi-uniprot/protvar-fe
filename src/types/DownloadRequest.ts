import {MappingRequest} from "./MappingRequest";
export interface DownloadRequest extends MappingRequest {
  function?: boolean;
  population?: boolean;
  structure?: boolean;
  email?: string;
  jobName?: string;
  full?: boolean;
}

