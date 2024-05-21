import tinygradient from "tinygradient";
import {ConservScore} from "../../../../types/MappingResponse";
import {PredAttr, PUBMED_ID} from "./Prediction";
import Spaces from "../../../elements/Spaces";
import {pubmedRef} from "../../common/Common";
import {Tooltip} from "../../common/Tooltip";
import {
  PRECISION,
  STD_COLOR_GRADIENT
} from "./PredConstants";

export const CONSERV_SCORE_ATTR: PredAttr[] = [
  {color: '#732faf', stdColor: STD_COLOR_GRADIENT.rgbAt(0).toHexString(), text: 'very low', tip: 'Very low conservation = 0-0.15' },
  {color: '#194888', stdColor: STD_COLOR_GRADIENT.rgbAt(0.166).toHexString(), text: 'low', tip: 'Low conservation = 0.15-0.3' },
  {color: '#277777', stdColor: STD_COLOR_GRADIENT.rgbAt(0.333).toHexString(), text: 'fairly low', tip: 'Fairly low conservation = 0.3-0.45' },
  {color: '#72cb5d', stdColor: STD_COLOR_GRADIENT.rgbAt(0.5).toHexString(), text: 'moderate', tip: 'Moderate conservation = 0.45-0.6' },
  {color: '#bab518', stdColor: STD_COLOR_GRADIENT.rgbAt(0.666).toHexString(), text: 'fairly high', tip: 'Fairly high conservation = 0.6-0.75' },
  {color: '#c46307', stdColor: STD_COLOR_GRADIENT.rgbAt(0.833).toHexString(), text: 'high', tip: 'High conservation = 0.75-0.9' },
  {color: '#9d0101', stdColor: STD_COLOR_GRADIENT.rgbAt(1).toHexString(), text: 'very high', tip: 'Very high conservation = 0.9-1.0' }
]

export const CONSERV_COLOUR_GRADIENT = tinygradient(CONSERV_SCORE_ATTR.map(s => s.color));

export const ConservPred = (props: { conserv?: ConservScore, stdColor: boolean }) => {
  if (props.conserv) {
  return <div className="aa-pred">
    <div>Conservation {pubmedRef(PUBMED_ID.CONSERV)}</div>
    <Tooltip tip="Inter species conservation based on UniRef90 alignments using the ScoreCons algorithm.&#013;0=no conservation across alignment&#013;1=total conservation.">
      {formatConservScore(props.conserv)}
    </Tooltip>
    <ConservPredIcon {...props}/>
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
    return <Tooltip tip={scoreAttr.tip}>
      <i className="bi bi-circle-fill" style={{color: colorAtPos }}></i>
      <Spaces/>{scoreAttr.text}
    </Tooltip>
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