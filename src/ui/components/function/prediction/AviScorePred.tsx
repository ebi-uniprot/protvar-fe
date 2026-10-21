import { PredictionCategory } from "./Prediction";
import { STD_COLOR_GRADIENT } from "./PredictionConstants";
import { CopyLink } from '../../common/CopyLink';
import Spaces from "../../../elements/Spaces";

const PRECISION: number = 1 // dp

// AlphaGenome Variant Impact (AVI), PHRED-scaled: score = -10·log10(rank among all possible SNVs genome-wide),
// so 10 = top 10%, 20 = top 1%, 30 = top 0.1%. The AlphaGenome Atlas publishes no categories and advises against
// fixed cut-offs, so ProtVar's bands state the genome-wide rank, not a pathogenicity call. Breakpoints as CADD's;
// a single-hue (purple) scale so it doesn't read as benign → deleterious.
export const AVI_SCORE_ATTR: PredictionCategory[] = [
  { color: '#c3bce0', stdColor: STD_COLOR_GRADIENT.rgbAt(0).toHexString(),    text: 'below top 10% genome-wide', range: '<10.0' },
  { color: '#9a8acb', stdColor: STD_COLOR_GRADIENT.rgbAt(0.6).toHexString(),  text: 'top 10% genome-wide',       range: '10.0–19.9' },
  { color: '#7660b6', stdColor: STD_COLOR_GRADIENT.rgbAt(0.65).toHexString(), text: 'top 1% genome-wide',        range: '20.0–24.9' },
  { color: '#57409c', stdColor: STD_COLOR_GRADIENT.rgbAt(0.7).toHexString(),  text: 'top 0.3% genome-wide',      range: '25.0–29.9' },
  { color: '#3a2378', stdColor: STD_COLOR_GRADIENT.rgbAt(1).toHexString(),    text: 'top 0.1% genome-wide',      range: '≥30.0' },
]

export function aviScoreAttr(score: number): PredictionCategory {
  if (score >= 30) return AVI_SCORE_ATTR[4]
  if (score >= 25) return AVI_SCORE_ATTR[3]
  if (score >= 20) return AVI_SCORE_ATTR[2]
  if (score >= 10) return AVI_SCORE_ATTR[1]
  return AVI_SCORE_ATTR[0]
}

export const AviScorePred = (props: { avi?: string, stdColor: boolean }) => {
  const score = parseFloat(props.avi!)
  if (isNaN(score)) return <></>
  const attr = aviScoreAttr(score)
  return <div className="prediction-row">
    <div>AVI</div>
    <div>{score.toFixed(PRECISION)}</div>
    <div title={`AlphaGenome Variant Impact (AVI): ${genomeWideRank(score)} of all possible SNVs. A rank, not a pathogenicity classification.`}>
      <i className="bi bi-circle-fill" style={{color: props.stdColor ? attr.stdColor : attr.color}}></i>
      <Spaces/>{attr.text}
    </div>
    <CopyLink predictionType="avi" />
  </div>
}

// 29.2 -> "top 0.1% genome-wide", 15 -> "top 3% genome-wide"
export function genomeWideRank(score: number) {
  const pct = 100 * Math.pow(10, -score / 10)
  const shown = pct >= 1 ? Math.round(pct).toString() : pct.toPrecision(1)
  return `top ${shown}% genome-wide`
}
