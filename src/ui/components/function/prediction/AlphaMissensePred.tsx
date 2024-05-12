import {AMScore} from "../../../../types/MappingResponse";
import {getPredRef, PredAttr, PUBMED_ID} from "./Prediction";
import Spaces from "../../../elements/Spaces";

export const AM_SCORE_ATTR: {[key: string]: PredAttr} = {
  PATHOGENIC: { color: '#ed1e24', title: 'pathogenic' },
  AMBIGUOUS: { color: '#a8a9ad', title: 'ambiguous' },
  BENIGN: { color: '#3853a4', title: 'benign' }
}

export const AlphaMissensePred = (props: { am?: AMScore }) => {
  if (props.am === undefined || props.am === null) {
    return <></>
  }
  return <div className="aa-pred">
    <div>AlphaMissense {getPredRef(PUBMED_ID.AM)}</div>
    <div>{props.am.amPathogenicity}</div>
    <div><AlphaMissensePredIcon amScore={props.am} /></div>
  </div>
}

function AlphaMissensePredIcon(props: { amScore?: AMScore }) {
  if (props.amScore) {
    let cls = props.amScore.amClass as keyof PredAttr
    return <>
      <i className="bi bi-circle-fill" style={{color: AM_SCORE_ATTR[cls].color}}></i>
      <Spaces/>{AM_SCORE_ATTR[cls].title}
    </>
  }
  return <></>
}

export function amScoreAttr(amClass?: string) {
  if (amClass === undefined || amClass === null || !(amClass in AM_SCORE_ATTR)) {
    return null;
  }
  return AM_SCORE_ATTR[amClass]
}