import tinygradient from "tinygradient";
import {ESMScore} from "../../../../types/MappingResponse";
import {
  PredAttr,
  PUBMED_ID
} from "./Prediction";
import Spaces from "../../../elements/Spaces";
import {STD_BENIGN_COLOR, STD_COLOR_GRADIENT, STD_PATHOGENIC_COLOR, STD_UNCERTAIN_COLOR} from "./PredConstants";
import {pubmedRef} from "../../common/Common";
import {Tooltip} from "../../common/Tooltip";

const PRECISION: number = 1 // dp

// likely pathogenic (yellow) -25 <------> 0 likely benign (blue)
export const ESM_SCORE_ATTR: PredAttr[] = [
  {color: '#460556', stdColor: STD_BENIGN_COLOR , text: 'benign', tip: '-5 to 0 likely benign' },
  {color: '#218c8f', stdColor: STD_UNCERTAIN_COLOR, text: 'uncertain', tip: '-10 to -5 uncertain significance' },
  {color: '#f9e725', stdColor: STD_PATHOGENIC_COLOR, text: 'pathogenic', tip: '-25 to -10 likely pathogenic' }
]

export const ESM_MAX_SCORE = -25

export const ESM_COLOR_GRADIENT = tinygradient(ESM_SCORE_ATTR.map(s => s.color));

export const EsmPred = (props: { esm?: ESMScore, stdColor: boolean }) => {
  if (props.esm) {
  return <div className="aa-pred">
    <div>ESM-1b {pubmedRef(PUBMED_ID.ESM)}</div>
    <Tooltip tip="ESM (Evolutionary Scaled Model) score ranges from 0, least deleterious to -25 most deliterious">
      {formatEsmScore(props.esm)}
    </Tooltip>
    <EsmPredIcon {...props}/>
  </div>}
return <></>
}

export function formatEsmScore(esm?: ESMScore) {
  return esm ? esm.score.toFixed(PRECISION) : "";
}

function EsmPredIcon(props: {esm?: ESMScore, stdColor: boolean }) {
  if (props.esm) {
    const colorGrad = props.stdColor ? STD_COLOR_GRADIENT : ESM_COLOR_GRADIENT;
    const colorAtPos = colorGrad.rgbAt(props.esm.score/ ESM_MAX_SCORE).toHexString()
    const esmAttr = esmScoreAttr(props.esm.score)
    return <Tooltip tip={esmAttr?.tip}>
      <i className="bi bi-circle-fill" style={{color: colorAtPos}}></i>
      <Spaces/>{esmAttr && <>
        {esmAttr.text}
      </>}
    </Tooltip>
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