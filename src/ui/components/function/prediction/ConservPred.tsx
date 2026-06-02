import tinygradient from "tinygradient";
import {ConservScore} from "../../../../types/MappingResponse";
import {PredictionCategory} from "./Prediction";
import Spaces from "../../../elements/Spaces";
import {
  PRECISION,
  STD_COLOR_GRADIENT
} from "./PredictionConstants";
import { CopyLink } from '../../common/CopyLink';
import React from "react";

export const CONSERV_SCORE_ATTR: PredictionCategory[] = [
  {color: '#732faf', stdColor: STD_COLOR_GRADIENT.rgbAt(0).toHexString(),     text: 'very low',    range: '0–0.15',   tip: 'Very low conservation = 0-0.15' },
  {color: '#194888', stdColor: STD_COLOR_GRADIENT.rgbAt(0.166).toHexString(), text: 'low',         range: '0.15–0.3', tip: 'Low conservation = 0.15-0.3' },
  {color: '#277777', stdColor: STD_COLOR_GRADIENT.rgbAt(0.333).toHexString(), text: 'fairly low',  range: '0.3–0.45', tip: 'Fairly low conservation = 0.3-0.45' },
  {color: '#72cb5d', stdColor: STD_COLOR_GRADIENT.rgbAt(0.5).toHexString(),   text: 'moderate',    range: '0.45–0.6', tip: 'Moderate conservation = 0.45-0.6' },
  {color: '#bab518', stdColor: STD_COLOR_GRADIENT.rgbAt(0.666).toHexString(), text: 'fairly high', range: '0.6–0.75', tip: 'Fairly high conservation = 0.6-0.75' },
  {color: '#c46307', stdColor: STD_COLOR_GRADIENT.rgbAt(0.833).toHexString(), text: 'high',        range: '0.75–0.9', tip: 'High conservation = 0.75-0.9' },
  {color: '#9d0101', stdColor: STD_COLOR_GRADIENT.rgbAt(1).toHexString(),     text: 'very high',   range: '0.9–1.0',  tip: 'Very high conservation = 0.9-1.0' },
]

export const CONSERV_COLOUR_GRADIENT = tinygradient(CONSERV_SCORE_ATTR.map(s => s.color));

export const ConservPred = (props: { conserv?: ConservScore, stdColor: boolean }) => {
  if (props.conserv) {
  return <div className="prediction-row">
    <div>Conservation</div>
    <div>{formatConservScore(props.conserv)}</div>
    <ConservPredIcon {...props}/>
    <CopyLink predictionType="conserv" />
  </div>}
  return <></>
}

export function formatConservScore(conserv?: ConservScore) {
  return conserv ? conserv.score.toFixed(PRECISION) : "";
}

function ConservPredIcon(props: { conserv?: ConservScore, stdColor: boolean }) {
    const colorGrad = props.stdColor ? STD_COLOR_GRADIENT : CONSERV_COLOUR_GRADIENT;
    const colorAtPos = colorGrad.rgbAt(props.conserv!.score).toHexString()
    const scoreAttr = conservScoreAttr(props.conserv!.score)
    return <div>
      <i className="bi bi-circle-fill" style={{color: colorAtPos }}></i>
      <Spaces/>{scoreAttr.text}
    </div>
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