import RegionProteinProps from "./RegionProteinProps";
import Evidences from "../Evidences";
import RegionProteinAccordion from "./RegionProteinAccordion";
import { EmptyElement } from "../../../../constants/ConstElement";
import {Comment} from "../../../../types/Comment";
import {v1 as uuidv1} from "uuid";

function ActivityRegulations(props: RegionProteinProps) {
  return <RegionProteinAccordion title="Activity Regulation" detailComponentGenerator={getActivityRegulation} {...props} />
}

export function getActivityRegulation(comment: Comment) {
  if ('text' in comment && Array.isArray(comment.text) && comment.text.length > 0) {
    return (
      <div key={uuidv1()}>
        <ul>
          <li>{comment.text[0].value}</li>
        </ul>
        <ul>
          <li>
            <Evidences evidences={comment.text[0].evidences} />
          </li>
        </ul>
        <hr />
      </div>
    );
  }
  return EmptyElement
}

export default ActivityRegulations;