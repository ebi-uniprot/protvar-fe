import {AMScore} from "../../../../types/MappingResponse";
import {PredAttr, PUBMED_ID} from "./Prediction";
import Spaces from "../../../elements/Spaces";
import {STD_BENIGN_COLOR, STD_PATHOGENIC_COLOR, STD_UNCERTAIN_COLOR} from "./PredConstants";
import {pubmedRef} from "../../common/Common";

export const AM_SCORE_ATTR: {[key: string]: PredAttr} = {
  BENIGN: { color: '#3853a4', stdColor: STD_BENIGN_COLOR, title: 'benign' },
  AMBIGUOUS: { color: '#a8a9ad', stdColor: STD_UNCERTAIN_COLOR, title: 'ambiguous' },
  PATHOGENIC: { color: '#ed1e24', stdColor: STD_PATHOGENIC_COLOR, title: 'pathogenic' }
}

export const AlphaMissensePred = (props: { am?: AMScore, stdColor: boolean }) => {
  if (props.am === undefined || props.am === null) {
    return <></>
  }
  return <div className="aa-pred">
    <div>AlphaMissense {pubmedRef(PUBMED_ID.AM)}</div>
    <div>{props.am.amPathogenicity}</div>
    <div><AlphaMissensePredIcon {...props} /></div>
  </div>
}

function AlphaMissensePredIcon(props: { am?: AMScore, stdColor: boolean }) {
  if (props.am) {
    let cls = props.am.amClass as keyof PredAttr
    return <>
      <i className="bi bi-circle-fill" style={{color: (props.stdColor ? AM_SCORE_ATTR[cls].stdColor : AM_SCORE_ATTR[cls].color)}}></i>
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