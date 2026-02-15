import RegionProteinProps from "./RegionProteinProps";
import RegionProtein from "./RegionProtein";
import { EmptyElement } from "../../../../constants/ConstElement";
import {Comment, WRComment} from "../../../../types/Comment";

function AdditionalResources(props: RegionProteinProps) {
  return <RegionProtein title="Additional Resources" detailComponentGenerator={getWebResource} {...props} />
}

function getWebResource(comment: Comment) {
  const webResource = comment as WRComment;

  if (webResource.name && webResource.url) {
    return (
      <div key={webResource.url} className="protein-info-detail">
        <a href={webResource.url} target="_blank" rel="noreferrer" className="ext-link">
          {webResource.name}
        </a>
      </div>
    );
  }

  return EmptyElement;
}

export default AdditionalResources;