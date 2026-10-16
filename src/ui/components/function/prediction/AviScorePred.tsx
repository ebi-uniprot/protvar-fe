import { AVI_INFO_URL } from "../../../../constants/ExternalUrls";

const PRECISION: number = 1 // dp

// AlphaGenome Variant Impact (AVI), PHRED-scaled like CADD (20 ≈ top 1% most deleterious genome-wide).
// No category colours: AVI has no published thresholds, so only the score is shown.
export const AviScorePred = (props: { avi?: string }) => {
  const score = parseFloat(props.avi!)
  if (isNaN(score)) return <></>
  return <div className="prediction-row">
    <div>AVI</div>
    <div>{score.toFixed(PRECISION)}</div>
    <div>
      <a href={AVI_INFO_URL} target="_blank" rel="noopener noreferrer"
         title="AlphaGenome Variant Impact (AVI), Google DeepMind. PHRED-scaled: 20 ≈ top 1% genome-wide">AlphaGenome</a>
    </div>
  </div>
}
