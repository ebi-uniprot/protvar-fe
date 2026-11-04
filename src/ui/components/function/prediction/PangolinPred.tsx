import { PredictionCategory } from "./Prediction";
import { STD_COLOR_GRADIENT } from "./PredictionConstants";
import { CopyLink } from '../../common/CopyLink';
import Spaces from "../../../elements/Spaces";
import { Pangolin } from "../../../../types/MappingResponse";

const PRECISION: number = 2 // dp

// Pangolin (Zeng & Li 2022) predicts the change in splice-site usage; score = max(gain, |loss|), 0..1.
// Pangolin publishes no categories: 0.2 and 0.5 are cut-offs commonly used for splice predictors (borrowed from
// SpliceAI practice), so the bands describe the predicted effect size, not a pathogenicity call. Single hue (teal).
export const PANGOLIN_SCORE_ATTR: PredictionCategory[] = [
  { color: '#c7e9e5', stdColor: STD_COLOR_GRADIENT.rgbAt(0).toHexString(),   text: 'little or no predicted splice change', range: '<0.20' },
  { color: '#4fb3a9', stdColor: STD_COLOR_GRADIENT.rgbAt(0.6).toHexString(), text: 'possible splice change',               range: '0.20–0.49' },
  { color: '#0f6b63', stdColor: STD_COLOR_GRADIENT.rgbAt(1).toHexString(),   text: 'likely splice change',                 range: '≥0.50' },
]

export function pangolinScoreAttr(score: number): PredictionCategory {
  if (score >= 0.5) return PANGOLIN_SCORE_ATTR[2]
  if (score >= 0.2) return PANGOLIN_SCORE_ATTR[1]
  return PANGOLIN_SCORE_ATTR[0]
}

const nt = (pos: number) => `${pos > 0 ? '+' : ''}${pos} nt`

// "loss 0.42 at +3 nt" / "gain 0.10 at -12 nt"; null when Pangolin predicts no change
export function pangolinDetail(p: Pangolin): string | null {
  const parts: string[] = []
  if (p.gain > 0) parts.push(`gain ${p.gain.toFixed(PRECISION)} at ${nt(p.gainPos)}`)
  if (p.loss < 0) parts.push(`loss ${Math.abs(p.loss).toFixed(PRECISION)} at ${nt(p.lossPos)}`)
  return parts.length ? parts.join('; ') : null
}

export const PangolinPred = (props: { pangolin?: Pangolin, stdColor: boolean }) => {
  const p = props.pangolin
  if (!p) return <></>
  const attr = pangolinScoreAttr(p.score)
  const detail = pangolinDetail(p)
  return <div className="prediction-row">
    <div>Pangolin</div>
    <div>{p.score.toFixed(PRECISION)}</div>
    <div title={`Pangolin splice prediction (max of gain and loss of splice-site usage within ±50 nt): ${detail ?? 'no change predicted'}. Not a pathogenicity classification.`}>
      <i className="bi bi-circle-fill" style={{color: props.stdColor ? attr.stdColor : attr.color}}></i>
      <Spaces/>{attr.text}{detail && <small> ({detail})</small>}
    </div>
    <CopyLink predictionType="pangolin" />
  </div>
}
