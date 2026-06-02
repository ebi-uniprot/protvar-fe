import tinygradient from "tinygradient";
import {EsmScore} from "../../../../types/MappingResponse";
import {PredictionCategory} from "./Prediction";
import Spaces from "../../../elements/Spaces";
import {STD_BENIGN_COLOR, STD_PATHOGENIC_COLOR, STD_UNCERTAIN_COLOR} from "./PredictionConstants";
import { CopyLink } from '../../common/CopyLink';
import React from "react";

const PRECISION: number = 1 // dp

// likely pathogenic (yellow) -25 <------> 0 likely benign (blue)
export const ESM_SCORE_ATTR: PredictionCategory[] = [
  {color: '#460556', stdColor: STD_BENIGN_COLOR,    text: 'benign',     range: '0 to -5',   tip: '-5 to 0 likely benign' },
  {color: '#218c8f', stdColor: STD_UNCERTAIN_COLOR, text: 'uncertain',  range: '-5 to -10', tip: '-10 to -5 uncertain significance' },
  {color: '#f9e725', stdColor: STD_PATHOGENIC_COLOR,text: 'pathogenic', range: '-10 to -25',tip: '-25 to -10 likely pathogenic' },
]

export const ESM_MAX_SCORE = -25

export const ESM_COLOR_GRADIENT = tinygradient(ESM_SCORE_ATTR.map(s => s.color));

export const EsmPred = (props: { esm?: EsmScore, stdColor: boolean }) => {
  if (props.esm) {
  return <div className="prediction-row">
    <div>ESM-1b</div>
    <div>{formatEsmScore(props.esm)}</div>
    <EsmPredIcon {...props}/>
    <CopyLink predictionType="esm" />
  </div>}
return <></>
}

export function formatEsmScore(esm?: EsmScore) {
  return esm ? esm.score.toFixed(PRECISION) : "";
}

function EsmPredIcon(props: {esm?: EsmScore, stdColor: boolean }) {
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