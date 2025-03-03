import {PredAttr} from "../function/prediction/Prediction";
import {STD_COLOR_GRADIENT_REVERSE} from "../function/prediction/PredConstants";
import Spaces from "../../elements/Spaces";
import React from "react";

const PRECISION: number = 5 // dp

export const AF_ATTR: PredAttr[] = [
  {color: '#FAD0C9', stdColor: STD_COLOR_GRADIENT_REVERSE.rgbAt(0.1).toHexString(), text: 'very rare', range: 'AF < 0.1%' },
  {color: '#A3D8FF', stdColor: STD_COLOR_GRADIENT_REVERSE.rgbAt(0.5).toHexString(), text: 'rare', range: '0.1% ≤ AF < 0.5%' },
  {color: '#B8E1B1', stdColor: STD_COLOR_GRADIENT_REVERSE.rgbAt(0.8).toHexString(), text: 'low frequency', range: '0.5% ≤ AF < 5%' },
  {color: '#7FBC5C', stdColor: STD_COLOR_GRADIENT_REVERSE.rgbAt(1).toHexString(), text: 'common', range: 'AF ≥ 5%' }
]

export const AlleleFreq = (props: { af: number, stdColor: boolean }) => {
  if (props.af) {
  return <>
    <b>GnomAD 4.1 exomes allele frequency:</b> <span title={props.af.toString()}>{props.af.toFixed(PRECISION)} <Spaces/>  <AFIcon {...props} /></span>
  </>}
  return <></>
}

function AFIcon(props: { af: number, stdColor: boolean }) {
  let attr = afAttr(props.af)
  if (attr) {
    return <>
      <i className="bi bi-circle-fill" style={{color: (props.stdColor ? attr.stdColor : attr.color)}}></i>
      <Spaces/> ({attr.text})
    </>
  }
  return <></>
}

function afAttr(af: number) {
  if (af < 0.001) {
    return AF_ATTR[0];
  } else if (af >= 0.001 && af < 0.005) {
    return AF_ATTR[1];
  } else if (af >= 0.005 && af < 0.05) {
    return AF_ATTR[2];
  } else {
    return AF_ATTR[3];
  }
}