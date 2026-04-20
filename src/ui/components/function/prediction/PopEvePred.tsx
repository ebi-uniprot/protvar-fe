import {PopEveScore} from "../../../../types/MappingResponse";
import {PRECISION} from "./PredConstants";
import {PredAttr} from "./Prediction";
import Spaces from "../../../elements/Spaces";
import { CopyLink } from '../../common/CopyLink';
import React from "react";
import tinygradient from "tinygradient";

export const POPEVE_SCORE_ATTR: PredAttr[] = [
  {color: 'red', stdColor: 'red', text: 'severe', range: '<-5.056' },
  {color: 'lightgrey', stdColor: 'lightgrey', text: 'moderately deleterious', range: '-5.056 to -4.617' },
  {color: 'blue', stdColor: 'blue', text: 'unlikely deleterious', range: '>-4.617' }
]

export const PopEvePred = (props: { popeve?: PopEveScore, stdColor: boolean }) => {
  if (props.popeve) {
  return <div className="prediction-row">
    <div><CopyLink predictionType="popeve" /> popEVE</div>
    <div>{formatPopEveScore(props.popeve)}</div>
    <PopEvePredIcon {...props} />
  </div>}
  return <></>
}

export function formatPopEveScore(popeve?: PopEveScore) {
  return popeve ? popeve.popeve.toFixed(PRECISION) : "";
}

export function getPopEveClass(score: number): number {
  if (score < -5.056) return 0; // severe
  if (score < -4.617) return 1; // moderately deleterious
  return 2; // unlikely deleterious
}

function PopEvePredIcon(props: { popeve?: PopEveScore, stdColor: boolean }) {
  if (props.popeve) {
    const cls = getPopEveClass(props.popeve.popeve);
    const isLowConfidence = props.popeve.gapFreq > 0.5;
    const color = props.stdColor ? POPEVE_SCORE_ATTR[cls].stdColor : getPopEveColor(props.popeve.popeve);
    return <div>
      <i className="bi bi-circle-fill" style={{color}}></i>
      <Spaces/>{POPEVE_SCORE_ATTR[cls].text}{isLowConfidence && ' (low confidence)'}
    </div>
  }
  return <></>
}

/* -------------------------------------------------- */
/* PopEve gradient colors (from original website)  */
/* -------------------------------------------------- */

const POPEVE_COLORS = [
  "rgb(0,0,0)",
  "rgb(0,0,0)",
  "rgb(0,0,0)",
  "rgb(0,0,0)",
  "rgb(0,0,0)",
  "rgb(0,0,0)",
  "rgb(35,5,33)",
  "rgb(91,13,85)",
  "rgb(86,50,141)",
  "rgb(47,106,200)",
  "rgb(32,149,223)",
  "rgb(32,186,223)",
  "rgb(100,203,193)",
  "rgb(211,206,146)",
  "rgb(255,208,128)",
  "rgb(255,208,128)",
  "rgb(255,208,128)",
  "rgb(255,208,128)",
  "rgb(255,208,128)",
  "rgb(255,208,128)",
  "rgb(255,208,128)",
];

const POPEVE_GRADIENT = tinygradient(POPEVE_COLORS);

/* -------------------------------------------------- */
/* Score bounds from PopEve UI (-7.2 to >= -0.9)       */
/* -------------------------------------------------- */

export const POPEVE_MIN = -7.2;
export const POPEVE_MAX = -0.9;

export function getPopEveColor(score: number): string {
  const clamped = Math.min(Math.max(score, POPEVE_MIN), POPEVE_MAX);
  const ratio = (clamped - POPEVE_MIN) / (POPEVE_MAX - POPEVE_MIN);
  return POPEVE_GRADIENT.rgbAt(ratio).toHexString();
}

/* -------------------------------------------------- */
/* Legend component                                   */
/* -------------------------------------------------- */

export const PopEveLegend: React.FC = () => {
  const gradientCss = `linear-gradient(to right, ${POPEVE_COLORS.join(",")})`;

  return (
    <div style={{ width: "100%" }}>
      {/* Gradient bar */}
      <div
        style={{
          background: gradientCss,
          height: "20px",
          border: "1px solid rgb(221,221,221)",
          borderRadius: "4px",
          width: "100%",
        }}
      />

      {/* Min / Max labels */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "12px",
          marginTop: "4px",
        }}
      >
        <span>{POPEVE_MIN}</span>
        <span>≥ {POPEVE_MAX}</span>
      </div>
    </div>
  );
};

/* -------------------------------------------------- */
/* Example usage                                      */
/* -------------------------------------------------- */

export const PopEveScoreBadge: React.FC<{ score: number }> = ({ score }) => {
  const color = getPopEveColor(score);

  return (
    <div
      style={{
        backgroundColor: color,
        color: "#000",
        padding: "4px 8px",
        borderRadius: "4px",
        fontSize: "12px",
        display: "inline-block",
      }}
    >
      {score.toFixed(2)}
    </div>
  );
};