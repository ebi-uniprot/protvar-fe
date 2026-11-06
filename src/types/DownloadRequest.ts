import {MappingRequest} from "./MappingRequest";

// DownloadRequest is a MappingRequest with download-specific fields.
// The mode (q / resultId / ids) is inherited from MappingRequest.
export interface DownloadRequest extends MappingRequest {
  function?: boolean;
  prediction?: boolean;
  population?: boolean;
  structure?: boolean;
  columns?: string[];   // only these result-table columns in the variant and mapping groups; omit for all
  email?: string;
  jobName?: string;
  full?: boolean;
}
