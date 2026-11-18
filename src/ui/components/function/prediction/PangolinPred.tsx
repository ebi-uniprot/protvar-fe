import { PredictionCategory } from "./Prediction";
import { STD_COLOR_GRADIENT } from "./PredictionConstants";
import { CopyLink } from '../../common/CopyLink';
import Spaces from "../../../elements/Spaces";
import { Pangolin } from "../../../../types/MappingResponse";
import { Icon } from '../../../elements/Icon';

const PRECISION: number = 2 // dp

// Pangolin (Zeng & Li 2022) predicts the change in splice-site usage; score = max(gain, |loss|), 0..1.
// The BE labels a gain or loss as significant (rule from James Stephenson): the changed splice site is within 2 nt
// of the variant and the score is over 0.2, or within 8 nt and over 0.8. Not a pathogenicity call. Single hue (teal).
export const PANGOLIN_SCORE_ATTR: PredictionCategory[] = [
  { color: '#c7e9e5', stdColor: STD_COLOR_GRADIENT.rgbAt(0).toHexString(), text: 'no significant splice change',  range: 'neither significant' },
  { color: '#0f6b63', stdColor: STD_COLOR_GRADIENT.rgbAt(1).toHexString(), text: 'Splice gain predicted',        range: 'gain significant' },
  { color: '#0f6b63', stdColor: STD_COLOR_GRADIENT.rgbAt(1).toHexString(), text: 'Splice loss predicted',        range: 'loss significant' },
  { color: '#0f6b63', stdColor: STD_COLOR_GRADIENT.rgbAt(1).toHexString(), text: 'Splice site change predicted', range: 'both significant' },
]

// category for the BE's label (none when no gain or loss is significant)
export function pangolinAttr(p: Pangolin): PredictionCategory {
  return PANGOLIN_SCORE_ATTR.find(a => a.text === p.label) ?? PANGOLIN_SCORE_ATTR[0]
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
  const attr = pangolinAttr(p)
  const detail = pangolinDetail(p)
  return <div className="prediction-row">
    <div>Pangolin</div>
    <div>{p.score.toFixed(PRECISION)}</div>
    <div title={`Pangolin splice prediction (max of gain and loss of splice-site usage within ±50 nt): ${detail ?? 'no change predicted'}. Significant: splice site within 2 nt and score over 0.2, or within 8 nt and over 0.8. Not a pathogenicity classification.`}>
      <Icon name="circle-fill" style={{color: props.stdColor ? attr.stdColor : attr.color}} />
      <Spaces/>{attr.text}{detail && <small> ({detail})</small>}
    </div>
    <CopyLink predictionType="pangolin" />
  </div>
}
