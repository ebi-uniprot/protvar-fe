import {InputType} from "./InputType";
import {MappingRequest} from "./MappingRequest";

export interface DownloadRequest extends MappingRequest {
  // Download still identifies what to download by a single input + type (identifier or inputId).
  // These are not in MappingRequest (which uses ids[] for browse) because download has its own
  // backend endpoint that accepts the legacy single-input form.
  input?: string;
  type?: InputType;
  function?: boolean;
  population?: boolean;
  structure?: boolean;
  email?: string;
  jobName?: string;
  full?: boolean;
}

