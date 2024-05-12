import tinygradient from "tinygradient";
import {ESMScore} from "../../../../types/MappingResponse";
import {getPredRef, PredAttr, PUBMED_ID} from "./Prediction";
import Spaces from "../../../elements/Spaces";

// James: A score of -7.5 appears to be used for pathogenicity in ESM1b. I am not sure we can say that 0--7.5 is benign though.
// Perhaps just leave those blank for now and just label the ones -7.5 and below.
export const ESM_SCORE_ATTR: PredAttr[] = [
  {color: '#460556',    title: 'pathogenic' },
  {color: '#218c8f',    title: '' },
  {color: '#f9e725',    title: '' } // maybe benign
]

export const ESM_MAX_SCORE = -25
export const ESM_PATHOGENIC_SCORE = -7.5

export const ESM_COLOUR_GRADIENT = tinygradient(ESM_SCORE_ATTR.map(s => s.color));

export const EsmPred = (props: { esm?: ESMScore }) => {
  if (props.esm === undefined || props.esm === null) {
    return <></>
  }
  return <div className="aa-pred">
    <div>ESM-1b {getPredRef(PUBMED_ID.ESM)}</div>
    <div>{props.esm.score}</div>
    <div><EsmPredIcon esmScore={props.esm}/></div>
  </div>
}

function EsmPredIcon(props: {esmScore?: ESMScore}) {
  if (props.esmScore) {
    let title = '';
    if (props.esmScore.score < ESM_PATHOGENIC_SCORE) {
      title = ESM_SCORE_ATTR[0].title
    }
    const colorAtPos = ESM_COLOUR_GRADIENT.rgbAt(props.esmScore.score/ ESM_MAX_SCORE).toHexString()
    return <>
      <i className="bi bi-circle-fill" style={{color: colorAtPos}}></i>
      <Spaces/>{title}
    </>
  }
  return <></>
}