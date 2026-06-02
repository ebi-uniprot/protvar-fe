import {EveScore} from "../../../../types/MappingResponse";
import {PredictionCategory} from "./Prediction";
import Spaces from "../../../elements/Spaces";
import {PRECISION, STD_BENIGN_COLOR, STD_PATHOGENIC_COLOR, STD_UNCERTAIN_COLOR} from "./PredictionConstants";

export const EVE_SCORE_ATTR: {[key: string]: PredictionCategory} = {
  BENIGN: { color: 'blue', stdColor: STD_BENIGN_COLOR, text: 'benign' },
  UNCERTAIN: { color: 'lightgray', stdColor: STD_UNCERTAIN_COLOR, text: 'uncertain' },
  PATHOGENIC: { color: 'red', stdColor: STD_PATHOGENIC_COLOR, text: 'pathogenic' }
}

export const EvePred = (props: { eve?: EveScore, stdColor: boolean }) => {
  if (props.eve) {
  return <div className="prediction-row">
    <div>EVE</div>
    <div>{formatEveScore(props.eve)}</div>
    <EvePredIcon {...props} />
  </div>}
  return <></>
}

export function formatEveScore(eve?: EveScore) {
  return eve ? eve.score.toFixed(PRECISION) : "";
}

function EvePredIcon(props: { eve?: EveScore, stdColor: boolean }) {
  if (props.eve) {
    let cls = props.eve.eveClass as keyof PredictionCategory
    return <div>
      <i className="bi bi-circle-fill" style={{color: (props.stdColor ? EVE_SCORE_ATTR[cls].stdColor : EVE_SCORE_ATTR[cls].color)}}></i>
      <Spaces/>{EVE_SCORE_ATTR[cls].text}
    </div>
  }
  return <></>
}