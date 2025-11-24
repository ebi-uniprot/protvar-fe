import {PopEveScore} from "../../../../types/MappingResponse";
import {PRECISION} from "./PredConstants";
import {PredAttr} from "./Prediction";
import Spaces from "../../../elements/Spaces";

export const POPEVE_SCORE_ATTR: PredAttr[] = [
  {color: 'red', stdColor: 'red', text: 'severe', range: '<-5.056' },
  {color: 'lightgrey', stdColor: 'lightgrey', text: 'moderately deleterious', range: '-5.056 to -4.617' },
  {color: 'blue', stdColor: 'blue', text: 'unlikely deleterious', range: '>-4.617' }
]

export const PopEvePred = (props: { popeve?: PopEveScore, stdColor: boolean }) => {
  if (props.popeve) {
  return <div className="aa-pred">
    <div>popEVE</div>
    <div>{formatPopEveScore(props.popeve)}</div>
    <PopEvePredIcon {...props} />
  </div>}
  return <></>
}

export function formatPopEveScore(popeve?: PopEveScore) {
  return popeve ? popeve.popeve.toFixed(PRECISION) : "";
}

function getPopEveClass(score: number): number {
  if (score < -5.056) return 0; // severe
  if (score < -4.617) return 1; // moderately deleterious
  return 2; // unlikely deleterious
}

function PopEvePredIcon(props: { popeve?: PopEveScore, stdColor: boolean }) {
  if (props.popeve) {
    const cls = getPopEveClass(props.popeve.popeve);
    const isLowConfidence = props.popeve.gapFreq > 0.5;
    return <div>
      <i className="bi bi-circle-fill" style={{color: (props.stdColor ? POPEVE_SCORE_ATTR[cls].stdColor : POPEVE_SCORE_ATTR[cls].color)}}></i>
      <Spaces/>{POPEVE_SCORE_ATTR[cls].text}{isLowConfidence && ' (low confidence)'}
    </div>
  }
  return <></>
}