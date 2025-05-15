import {AmScore} from "../../../../types/MappingResponse";
import {PredAttr} from "./Prediction";
import Spaces from "../../../elements/Spaces";
import {PRECISION, STD_BENIGN_COLOR, STD_PATHOGENIC_COLOR, STD_UNCERTAIN_COLOR} from "./PredConstants";

export const AM_SCORE_ATTR: {[key: string]: PredAttr} = {
  BENIGN: { color: '#3853a4', stdColor: STD_BENIGN_COLOR, text: 'benign' },
  AMBIGUOUS: { color: '#a8a9ad', stdColor: STD_UNCERTAIN_COLOR, text: 'ambiguous' },
  PATHOGENIC: { color: '#ed1e24', stdColor: STD_PATHOGENIC_COLOR, text: 'pathogenic' }
}

export const AlphaMissensePred = (props: { am?: AmScore, stdColor: boolean }) => {
  if (props.am) {
    return <div className="aa-pred">
      <div>AlphaMissense</div>
      <div>{formatAMScore(props.am)}</div>
      <AlphaMissensePredIcon {...props} />
    </div>
  }
  return <></>
}

export function formatAMScore(amScore?: AmScore) {
  return amScore ? amScore.amPathogenicity.toFixed(PRECISION) : "";
}

function AlphaMissensePredIcon(props: { am?: AmScore, stdColor: boolean }) {
  if (props.am) {
    let cls = props.am.amClass as keyof PredAttr
    return <div>
      <i className="bi bi-circle-fill" style={{color: (props.stdColor ? AM_SCORE_ATTR[cls].stdColor : AM_SCORE_ATTR[cls].color)}}></i>
      <Spaces/>{AM_SCORE_ATTR[cls].text}
    </div>
  }
  return <></>
}

export function amScoreAttr(amClass?: string) {
  if (amClass === undefined || amClass === null || !(amClass in AM_SCORE_ATTR)) {
    return null;
  }
  return AM_SCORE_ATTR[amClass]
}