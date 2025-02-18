import {Foldx} from "../../../../types/FunctionalResponse";
import Spaces from "../../../elements/Spaces";
import {PRECISION, STD_BENIGN_COLOR, STD_PATHOGENIC_COLOR} from "./PredConstants";

export const FoldxPred = (props: { foldxs: Array<Foldx> }) => {
  if (props.foldxs && props.foldxs.length > 0) {
    return <div>
      <div className="aa-pred">
        <div>Stability change ΔΔG {props.foldxs[0].numFragments > 1 && <small>
          <br/>(using AlphaFold fragment {props.foldxs[0].afId})
        </small>}</div>
        <div>{formatFoldxScore(props.foldxs[0])}</div>
        <FoldxPredIcon foldx={props.foldxs[0]}/>
      </div>
    </div>
  }
  return <div>No predictions available for this variant</div>
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