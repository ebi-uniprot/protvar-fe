import {EVEScore} from "../../../../types/MappingResponse";
import {
  PredAttr,
  PUBMED_ID
} from "./Prediction";
import Spaces from "../../../elements/Spaces";
import {STD_BENIGN_COLOR, STD_PATHOGENIC_COLOR, STD_UNCERTAIN_COLOR} from "./PredConstants";
import {pubmedRef} from "../../common/Common";

export const EVE_SCORE_ATTR: {[key: string]: PredAttr} = {
  BENIGN: { color: 'blue', stdColor: STD_BENIGN_COLOR, title: 'benign' },
  UNCERTAIN: { color: 'lightgrey', stdColor: STD_UNCERTAIN_COLOR, title: 'uncertain' },
  PATHOGENIC: { color: 'red', stdColor: STD_PATHOGENIC_COLOR, title: 'pathogenic' }
}

export const EvePred = (props: { eve?: EVEScore, stdColor: boolean }) => {
  if (props.eve === undefined || props.eve === null) {
    return <></>
  }
  return <div className="aa-pred">
    <div>EVE {pubmedRef(PUBMED_ID.EVE)}</div>
    <div>{props.eve.score}</div>
    <div><EvePredIcon {...props} /></div>
  </div>
}

function EvePredIcon(props: { eve?: EVEScore, stdColor: boolean }) {
  if (props.eve) {
    let cls = props.eve.eveClass as keyof PredAttr
    return <>
      <i className="bi bi-circle-fill" style={{color: (props.stdColor ? EVE_SCORE_ATTR[cls].stdColor : EVE_SCORE_ATTR[cls].color)}}></i>
      <Spaces/>{EVE_SCORE_ATTR[cls].title}
    </>
  }
  return <></>
}