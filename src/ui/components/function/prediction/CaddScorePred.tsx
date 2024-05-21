import {PredAttr, PUBMED_ID} from "./Prediction";
import {STD_COLOR_GRADIENT} from "./PredConstants";
import {pubmedRef} from "../../common/Common";
import {Tooltip} from "../../common/Tooltip";
import Spaces from "../../../elements/Spaces";

const PRECISION: number = 1 // dp

export const CADD_SCORE_ATTR: PredAttr[] = [
  {color: 'DarkGreen', stdColor: STD_COLOR_GRADIENT.rgbAt(0).toHexString(), text: 'likely benign', range: '<15.0' },
  {color: 'DarkSeaGreen', stdColor: STD_COLOR_GRADIENT.rgbAt(0.5).toHexString(), text: 'potentially deleterious', range: '15.0-19.9' },
  {color: 'Gold', stdColor: STD_COLOR_GRADIENT.rgbAt(0.65).toHexString(), text: 'quite likely deleterious', range: '20.0-24.9' },
  {color: 'DarkOrange', stdColor: STD_COLOR_GRADIENT.rgbAt(0.8).toHexString(), text: 'probably deleterious', range: '25.0-29.9' },
  {color: 'FireBrick', stdColor: STD_COLOR_GRADIENT.rgbAt(1).toHexString(), text: 'highly likely deleterious', range: '>29.9' }
]

export const CaddScorePred = (props: { cadd?: string, stdColor: boolean }) => {
  if (props.cadd) {
  return <div className="aa-pred">
    <div>CADD {pubmedRef(PUBMED_ID.CADD)}</div>
  <Tooltip tip="(CADD) Scaled Combined Annotation Dependent Depletion score. Scores are relative to all other possible scores. They are log10 scaled with higher numbers indicating a more deleterious consequence">
    {formatCaddScore(props.cadd)}
  </Tooltip>
  <CADDIcon {...props} />
  </div>}
  return <></>
}

export function formatCaddScore(cadd?: string) {
  return isNaN(parseFloat(cadd!)) ? "" : parseFloat(cadd!).toFixed(PRECISION)
}

function CADDIcon(props: { cadd?: string, stdColor: boolean }) {
  let caddAttr = caddScoreAttr(props.cadd)
  if (caddAttr) {
    return <Tooltip tip={`CADD score ${caddAttr.range}`}>
      <i className="bi bi-circle-fill" style={{color: (props.stdColor ? caddAttr.stdColor : caddAttr.color)}}></i>
      <Spaces/>{caddAttr.text}
    </Tooltip>
  }
  return <></>
}

export function caddScoreAttr(cadd?: string) {
  if (cadd === undefined || cadd === '-') {
    return null;
  }
  let score = parseFloat(cadd)
  let idx: number = 0
  if (score >= 15 && score < 20) {
    idx = 1
  } else if (score >= 20 && score < 25) {
    idx = 2
  } else if (score >= 25 && score < 30) {
    idx = 3
  } else if (score >= 30) {
    idx = 4
  }
  return CADD_SCORE_ATTR[idx];
}


