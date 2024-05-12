import {PredAttr} from "../function/prediction/Prediction";

export const CADD_SCORE_ATTR: PredAttr[] = [
  {color: 'DarkGreen',    title: '<15.0 Likely benign' },
  {color: 'DarkSeaGreen', title: '15.0-19.9 Potentially deleterious' },
  {color: 'Gold',         title: '20.0-24.9 Quite likely deleterious' },
  {color: 'DarkOrange',   title: '25.0-29.9 Probably deleterious' },
  {color: 'FireBrick',    title: '>29.9 Highly likely deleterious' }
]

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