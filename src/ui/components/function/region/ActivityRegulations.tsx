import RegionProteinProps from "./RegionProteinProps";
import Evidences from "../../common/Evidences";
import RegionProtein from "./RegionProtein";
import { EmptyElement } from "../../../../constants/ConstElement";
import {Comment} from "../../../../types/Comment";

function ActivityRegulations(props: RegionProteinProps) {
  return <RegionProtein title="Activity Regulation" detailComponentGenerator={getActivityRegulation} {...props} />
}

export function getActivityRegulation(comment: Comment) {
  if ('text' in comment && Array.isArray(comment.text) && comment.text.length > 0) {
    const text = comment.text[0];
    return (
      <div key={text.value} className="protein-info-detail">
        <p>{text.value}</p>
        <Evidences evidences={text.evidences} />
      </div>
    );
  }
  return EmptyElement;
}

export default ActivityRegulations;