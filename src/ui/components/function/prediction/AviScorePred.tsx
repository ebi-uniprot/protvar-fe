import { CopyLink } from '../../common/CopyLink';
import Spaces from "../../../elements/Spaces";

const PRECISION: number = 1 // dp

// AlphaGenome Variant Impact (AVI), PHRED-scaled like CADD: score = -10·log10(rank / all SNVs genome-wide).
// AVI has no published category thresholds, so instead of a coloured category the row states the genome-wide rank.
export const AviScorePred = (props: { avi?: string }) => {
  const score = parseFloat(props.avi!)
  if (isNaN(score)) return <></>
  return <div className="prediction-row">
    <div>AVI</div>
    <div>{score.toFixed(PRECISION)}</div>
    <div title="AlphaGenome Variant Impact (AVI), PHRED-scaled: 10 = top 10%, 20 = top 1%, 30 = top 0.1% of all possible SNVs genome-wide">
      {/* invisible dot: lines the text up with the other rows' category labels, without implying a category */}
      <i className="bi bi-circle-fill" style={{visibility: 'hidden'}}></i>
      <Spaces/>{genomeWideRank(score)}
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
