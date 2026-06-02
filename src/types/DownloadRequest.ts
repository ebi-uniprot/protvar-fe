import {MappingRequest} from "./MappingRequest";

// DownloadRequest is a MappingRequest with download-specific fields.
// The mode (q / resultId / ids) is inherited from MappingRequest.
export interface DownloadRequest extends MappingRequest {
  function?: boolean;
  population?: boolean;
  structure?: boolean;
  email?: string;
  jobName?: string;
  full?: boolean;
}
