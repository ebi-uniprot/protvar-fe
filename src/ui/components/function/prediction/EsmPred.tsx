import tinygradient from "tinygradient";
import {ESMScore} from "../../../../types/MappingResponse";
import {
  PredAttr,
  PUBMED_ID
} from "./Prediction";
import Spaces from "../../../elements/Spaces";
import {STD_BENIGN_COLOR, STD_COLOR_GRADIENT, STD_PATHOGENIC_COLOR, STD_UNCERTAIN_COLOR} from "./PredConstants";
import {Info, pubmedRef} from "../../common/Common";

// likely pathogenic (yellow) -25 <------> 0 likely benign (blue)
export const ESM_SCORE_ATTR: PredAttr[] = [
  {color: '#460556', stdColor: STD_BENIGN_COLOR , title: 'benign', info: '-5 to 0 likely benign' },
  {color: '#218c8f', stdColor: STD_UNCERTAIN_COLOR, title: 'uncertain', info: '-10 to -5 uncertain significance' },
  {color: '#f9e725', stdColor: STD_PATHOGENIC_COLOR, title: 'pathogenic', info: '-25 to -10 likely pathogenic' }
]

export const ESM_MAX_SCORE = -25

export const ESM_COLOR_GRADIENT = tinygradient(ESM_SCORE_ATTR.map(s => s.color));

export const EsmPred = (props: { esm?: ESMScore, stdColor: boolean }) => {
  if (props.esm === undefined || props.esm === null) {
    return <></>
  }
  return <div className="aa-pred">
    <div>ESM-1b {pubmedRef(PUBMED_ID.ESM)}</div>
    <div>{props.esm.score}</div>
    <div><EsmPredIcon {...props}/></div>
  </div>
}

function EsmPredIcon(props: {esm?: ESMScore, stdColor: boolean }) {
  if (props.esm) {
    const colorGrad = props.stdColor ? STD_COLOR_GRADIENT : ESM_COLOR_GRADIENT;
    const colorAtPos = colorGrad.rgbAt(props.esm.score/ ESM_MAX_SCORE).toHexString()
    const esmAttr = esmScoreAttr(props.esm.score)
    return <>
      <i className="bi bi-circle-fill" style={{color: colorAtPos}}></i>
      <Spaces/>{esmAttr && <>
        {esmAttr.title}
        <Info text={esmAttr.info}/>
      </>}
    </>
  }
  return <></>
}

function esmScoreAttr(score: number) {
  if (score >= -5 && score < 0) {
    return ESM_SCORE_ATTR[0]
  } else if (score >= -10 && score < -5) {
    return ESM_SCORE_ATTR[1]
  } else if (score >= -25 && score < -10) {
    return ESM_SCORE_ATTR[2]
  }
  return null
}