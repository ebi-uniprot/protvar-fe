import RegionProteinProps from "./RegionProteinProps";
import {Comment} from "../../../../types/FunctionalResponse";
import RegionProteinAccordion from "./RegionProteinAccordion";
import { EmptyElement } from "../../../../constants/Const";
function AdditionalResources(props: RegionProteinProps) {
  return <RegionProteinAccordion title="Additional Resources" detailComponentGenerator={getWebResource} {...props} />
}

function getWebResource(webResource: Comment) {
  if (webResource.name && webResource.url) {
    return <a href={webResource.url} target="_blank" rel="noreferrer" key={webResource.url}>
      <li>{webResource.name}</li>
    </a>
  }
  return EmptyElement;
}
export default AdditionalResources;