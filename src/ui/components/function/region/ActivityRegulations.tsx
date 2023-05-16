import RegionProteinProps from "./RegionProteinProps";
import {Comment} from "../../../../types/FunctionalResponse";
import Evidences from "../Evidences";
import RegionProteinAccordion from "./RegionProteinAccordion";
import { EmptyElement } from "../../../../constants/ConstElement";

function ActivityRegulations(props: RegionProteinProps) {
  return <RegionProteinAccordion title="Activity Regulation" detailComponentGenerator={getActivityRegulation} {...props} />
}

export function getActivityRegulation(regulation: Comment) {
  if (regulation && regulation.text && regulation.text.length > 0) {
    let text = regulation.text[0];
    return (
      <div key={text.value}>
        <ul>
          <li>{text.value}</li>
        </ul>
        <ul>
          <li>
            <Evidences evidences={text.evidences} />
          </li>
        </ul>
        <hr />
      </div>
    );
  }
  return EmptyElement
}
export default ActivityRegulations;