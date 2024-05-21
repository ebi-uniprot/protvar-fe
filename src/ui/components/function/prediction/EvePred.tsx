import {EVEScore} from "../../../../types/MappingResponse";
import {
  PredAttr,
  PUBMED_ID
} from "./Prediction";
import Spaces from "../../../elements/Spaces";
import {PRECISION, STD_BENIGN_COLOR, STD_PATHOGENIC_COLOR, STD_UNCERTAIN_COLOR} from "./PredConstants";
import {pubmedRef} from "../../common/Common";
import {Tooltip} from "../../common/Tooltip";

export const EVE_SCORE_ATTR: {[key: string]: PredAttr} = {
  BENIGN: { color: 'blue', stdColor: STD_BENIGN_COLOR, text: 'benign' },
  UNCERTAIN: { color: 'lightgrey', stdColor: STD_UNCERTAIN_COLOR, text: 'uncertain' },
  PATHOGENIC: { color: 'red', stdColor: STD_PATHOGENIC_COLOR, text: 'pathogenic' }
}

export const EvePred = (props: { eve?: EVEScore, stdColor: boolean }) => {
  if (props.eve) {
  return <div className="aa-pred">
    <div>EVE {pubmedRef(PUBMED_ID.EVE)}</div>
    <Tooltip tip="EVE - Evolutionary Model of Variant Effect scores range from 0 (least deleterious) to 1 (most deleterious)">
      {formatEveScore(props.eve)}
    </Tooltip>
    <EvePredIcon {...props} />
  </div>}
  return <></>
}

export function formatEveScore(eve?: EVEScore) {
  return eve ? eve.score.toFixed(PRECISION) : "";
}

function EvePredIcon(props: { eve?: EVEScore, stdColor: boolean }) {
  if (props.eve) {
    let cls = props.eve.eveClass as keyof PredAttr
    return <Tooltip tip="Categories ranges vary between proteins and are provided by EVE">
      <i className="bi bi-circle-fill" style={{color: (props.stdColor ? EVE_SCORE_ATTR[cls].stdColor : EVE_SCORE_ATTR[cls].color)}}></i>
      <Spaces/>{EVE_SCORE_ATTR[cls].text}
    </Tooltip>
  }
  return <></>
}