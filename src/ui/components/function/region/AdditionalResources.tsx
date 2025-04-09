import RegionProteinProps from "./RegionProteinProps";
import RegionProteinAccordion from "./RegionProteinAccordion";
import { EmptyElement } from "../../../../constants/ConstElement";
import {Comment, WRComment} from "../../../../types/Comment";
function AdditionalResources(props: RegionProteinProps) {
  return <RegionProteinAccordion title="Additional Resources" detailComponentGenerator={getWebResource} {...props} />
}

function getWebResource(comment: Comment) {
  const webResource = comment as WRComment;
  if (webResource.name && webResource.url) {
    return <a href={webResource.url} target="_blank" rel="noreferrer" key={webResource.url} className="ext-link">
      <li>{webResource.name}</li>
    </a>
  }
  return EmptyElement;
}
export default AdditionalResources;