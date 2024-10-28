import tinygradient from "tinygradient";
import {ESMScore} from "../../../../types/MappingResponse";
import {PredAttr} from "./Prediction";
import Spaces from "../../../elements/Spaces";
import {STD_BENIGN_COLOR, STD_PATHOGENIC_COLOR, STD_UNCERTAIN_COLOR} from "./PredConstants";

const PRECISION: number = 1 // dp

// likely pathogenic (yellow) -25 <------> 0 likely benign (blue)
export const ESM_SCORE_ATTR: PredAttr[] = [
  {color: '#460556', stdColor: STD_BENIGN_COLOR , text: 'benign', tip: '-5 to 0 likely benign' },  // 5x4=20%
  {color: '#218c8f', stdColor: STD_UNCERTAIN_COLOR, text: 'uncertain', tip: '-10 to -5 uncertain significance' },  // 5x4=20%
  {color: '#f9e725', stdColor: STD_PATHOGENIC_COLOR, text: 'pathogenic', tip: '-25 to -10 likely pathogenic' } // 15x4=60%
]

export const ESM_MAX_SCORE = -25

export const ESM_COLOR_GRADIENT = tinygradient(ESM_SCORE_ATTR.map(s => s.color));

export const EsmPred = (props: { esm?: ESMScore, stdColor: boolean }) => {
  if (props.esm) {
  return <div className="aa-pred">
    <div>ESM-1b</div>
    <div>{formatEsmScore(props.esm)}</div>
    <EsmPredIcon {...props}/>
  </div>}
return <></>
}

export function formatEsmScore(esm?: ESMScore) {
  return esm ? esm.score.toFixed(PRECISION) : "";
}

function EsmPredIcon(props: {esm?: ESMScore, stdColor: boolean }) {
  if (props.esm) {
    const esmAttr = esmScoreAttr(props.esm.score)
    const color = props.stdColor ? esmAttr?.stdColor :
      ESM_COLOR_GRADIENT.rgbAt(props.esm.score/ ESM_MAX_SCORE).toHexString()
    return <div>
      <i className="bi bi-circle-fill" style={{color: color}}></i>
      <Spaces/>{esmAttr && <>
        {esmAttr.text}
      </>}
    </div>
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