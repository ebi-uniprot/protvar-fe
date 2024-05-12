import {EVEScore} from "../../../../types/MappingResponse";
import {getPredRef, PredAttr, PUBMED_ID} from "./Prediction";
import Spaces from "../../../elements/Spaces";

export const EVE_SCORE_ATTR: {[key: string]: PredAttr} = {
  PATHOGENIC: { color: 'red', title: 'pathogenic' },
  UNCERTAIN: { color: 'lightgrey', title: 'uncertain' },
  BENIGN: { color: 'blue', title: 'benign' }
}

export const EvePred = (props: { eve?: EVEScore }) => {
  if (props.eve === undefined || props.eve === null) {
    return <></>
  }
  return <div className="aa-pred">
    <div>EVE {getPredRef(PUBMED_ID.EVE)}</div>
    <div>{props.eve.score}</div>
    <div><EvePredIcon eveScore={props.eve}/></div>
  </div>
}

function EvePredIcon(props: { eveScore?: EVEScore }) {
  if (props.eveScore) {
    let cls = props.eveScore.eveClass as keyof PredAttr
    return <>
      <i className="bi bi-circle-fill" style={{color: EVE_SCORE_ATTR[cls].color}}></i>
      <Spaces/>{EVE_SCORE_ATTR[cls].title}
    </>
  }
  return <></>
}