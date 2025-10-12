import {PopEveScore} from "../../../../types/MappingResponse";
import {PRECISION} from "./PredConstants";

export const PopEvePred = (props: { popeve?: PopEveScore, stdColor: boolean }) => {
  if (props.popeve) {
  return <div className="aa-pred">
    <div>popEVE</div>
    <div>{formatPopEveScore(props.popeve)}</div>
    <div></div>
  </div>}
  return <></>
}

export function formatPopEveScore(popeve?: PopEveScore) {
  return popeve ? popeve.popeve.toFixed(PRECISION) : "";
}
