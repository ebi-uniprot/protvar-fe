import Spaces from "../../../elements/Spaces";
import {PRECISION, STD_BENIGN_COLOR, STD_PATHOGENIC_COLOR} from "./PredictionConstants";
import {PredictionCategory} from "./Prediction";
import {Foldx} from "../../../../types/Prediction";
import {aminoAcid3to1Letter} from "../../../../utills/Util";
import { CopyLink } from '../../common/CopyLink';
import React from "react";

// Legend bands for FoldX ΔΔG — threshold at 2 kcal/mol, matching FoldxPredIcon.
// No separate non-std colour: FoldX has always used the standardised palette.
export const FOLDX_SCORE_ATTR: PredictionCategory[] = [
  { color: STD_PATHOGENIC_COLOR, stdColor: STD_PATHOGENIC_COLOR, range: 'ΔΔG > 2 kcal/mol', text: 'destabilising' },
  { color: STD_BENIGN_COLOR,     stdColor: STD_BENIGN_COLOR,     range: 'ΔΔG ≤ 2 kcal/mol', text: 'stabilising / neutral' },
];

export const FoldxPred = (props: { foldxs: Array<Foldx>, variantAA: string }) => {
  const variantAA = aminoAcid3to1Letter(props.variantAA);
  const filteredFoldxs = props.variantAA
    ? props.foldxs?.filter(fx => fx.mutatedType.toLowerCase() === variantAA)
    : props.foldxs;

  if (filteredFoldxs && filteredFoldxs.length > 0) {
    return (
      <div>
        <div className="prediction-row">
          <div>FoldX - Stability change (ΔΔG)
            {filteredFoldxs[0].numFragments > 1 && <small>
            <br/>(using AlphaFold fragment {filteredFoldxs[0].afId})
          </small>}
          </div>
          <div>{formatFoldxScore(filteredFoldxs[0])}</div>
          <FoldxPredIcon foldx={filteredFoldxs[0]}/>
          <CopyLink predictionType="foldx" />
        </div>
      </div>
    );
  }
  return <></>;
}

export function formatFoldxScore(foldx?: Foldx) {
  return foldx ? foldx.foldxDdg.toFixed(PRECISION) : "";
}

function FoldxPredIcon(props: { foldx?: Foldx }) {
  if (props.foldx) {
    const color = props.foldx.foldxDdg >= 2 ? STD_PATHOGENIC_COLOR : STD_BENIGN_COLOR
    const text = props.foldx.foldxDdg >= 2 ? 'likely to be destabilising' : 'unlikely to be destabilising'
    return <div>
      <i className="bi bi-circle-fill" style={{color: color}}></i>
      <Spaces/>{text}
    </div>
  }
  return <></>
}