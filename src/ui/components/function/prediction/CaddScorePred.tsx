import {PredAttr} from "./Prediction";
import {STD_COLOR_GRADIENT} from "./PredConstants";
import Spaces from "../../../elements/Spaces";

const PRECISION: number = 1 // dp

export const CADD_SCORE_ATTR: PredAttr[] = [
  // CADD score range 1 to 99
  // benign (blue) - 15% of lower range
  {color: 'DarkGreen', stdColor: STD_COLOR_GRADIENT.rgbAt(0).toHexString(), text: 'likely benign', range: '<15.0' }, // 15%
  // deleterious (>15%) - 85% of remaining range
  {color: 'DarkSeaGreen', stdColor: STD_COLOR_GRADIENT.rgbAt(0.60).toHexString(), text: 'potentially deleterious', range: '15.0-19.9' }, // 5%
  {color: 'Gold', stdColor: STD_COLOR_GRADIENT.rgbAt(0.65).toHexString(), text: 'quite likely deleterious', range: '20.0-24.9' }, // 5%
  {color: 'DarkOrange', stdColor: STD_COLOR_GRADIENT.rgbAt(0.7).toHexString(), text: 'probably deleterious', range: '25.0-29.9' }, // 5%
  {color: 'FireBrick', stdColor: STD_COLOR_GRADIENT.rgbAt(1).toHexString(), text: 'highly likely deleterious', range: '>29.9' } // 70%
]

export const CaddScorePred = (props: { cadd?: string, stdColor: boolean }) => {
  if (props.cadd) {
  return <div className="aa-pred">
    <div>CADD</div>
  <div>{formatCaddScore(props.cadd)}</div>
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
    return <div>
      <i className="bi bi-circle-fill" style={{color: (props.stdColor ? caddAttr.stdColor : caddAttr.color)}}></i>
      <Spaces/>{caddAttr.text}
    </div>
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


