import RegionProteinProps from "./RegionProteinProps";
import RegionProtein from "./RegionProtein";
import { EmptyElement } from "../../../../constants/ConstElement";
import {Comment, WRComment} from "../../../../types/Comment";
import {ExtLink} from "../../common/Link";

function AdditionalResources(props: RegionProteinProps) {
  return <RegionProtein title="Additional Resources" detailComponentGenerator={getWebResource} {...props} />
}

function getWebResource(comment: Comment) {
  const webResource = comment as WRComment;

  if (webResource.name && webResource.url) {
    return (
      <div key={webResource.url} className="protein-info-detail">
        <ExtLink url={webResource.url} text={webResource.name} />
      </div>
    );
  }

  return EmptyElement;
}

export default AdditionalResources;