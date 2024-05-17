import tinygradient from "tinygradient";
import {ConservScore} from "../../../../types/MappingResponse";
import {PredAttr, PUBMED_ID} from "./Prediction";
import Spaces from "../../../elements/Spaces";
import {Info, pubmedRef} from "../../common/Common";

export const CONSERV_SCORE_ATTR: PredAttr[] = [
  {color: '#732faf', stdColor: '', title: 'very low' },
  {color: '#194888', stdColor: '', title: 'low' },
  {color: '#277777', stdColor: '', title: 'fairly low' },
  {color: '#72cb5d', stdColor: '', title: 'moderate' },
  {color: '#bab518', stdColor: '', title: 'fairly high' },
  {color: '#c46307', stdColor: '', title: 'high' },
  {color: '#9d0101', stdColor: '', title: 'very high' }
]

export const CONSERV_COLOUR_GRADIENT = tinygradient(CONSERV_SCORE_ATTR.map(s => s.color));

export const ConservPred = (props: { conserv?: ConservScore }) => {
  if (props.conserv === undefined || props.conserv === null) {
    return <></>
  }
  return <div className="aa-pred">
    <div>Conservation {pubmedRef(PUBMED_ID.CONSERV)}</div>
    <div>{props.conserv.score}
      <Info text="Inter species conservation based on UniRef90 alignments using the ScoreCons algorithm. 0=no conservation across alignment, 1=total conservation." />
    </div>
    <div><ConservPredIcon conservScore={props.conserv}/></div>
  </div>
}

function ConservPredIcon(props: { conservScore?: ConservScore }) {
  if (props.conservScore) {
    const scoreAttr = conservScoreAttr(props.conservScore.score)
    const colorAtPos = CONSERV_COLOUR_GRADIENT.rgbAt(props.conservScore.score).toHexString()
    return <>
      <i className="bi bi-circle-fill" style={{color: colorAtPos }}></i>
      <Spaces/>{scoreAttr.title}
      <Info text="High conservation = 0.85-1.0" />
    </>
  }
  return <></>
}

export function conservScoreAttr(score: number) {
  let idx: number = 0
  if (score >= 0.15 && score < 0.3) {
    idx = 1
  } else if (score >= 0.3 && score < 0.45) {
    idx = 2
  } else if (score >= 0.45 && score < 0.6) {
    idx = 3
  } else if (score >= 0.6 && score < 0.75) {
    idx = 4
  } else if (score >= 0.75 && score < 0.9) {
    idx = 5
  } else if (score >= 0.9) {
    idx = 6
  }
  return CONSERV_SCORE_ATTR[idx];
}