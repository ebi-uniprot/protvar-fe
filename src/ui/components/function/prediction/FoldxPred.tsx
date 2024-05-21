import {Foldx} from "../../../../types/FunctionalResponse";
import Spaces from "../../../elements/Spaces";
import {PUBMED_ID} from "./Prediction";
import {pubmedRef} from "../../common/Common";
import {PRECISION, STD_BENIGN_COLOR, STD_PATHOGENIC_COLOR} from "./PredConstants";
import {Tooltip} from "../../common/Tooltip";

export const FoldxPred = (props: { foldxs: Array<Foldx> }) => {
  if (props.foldxs && props.foldxs.length > 0) {
    return <div>
      <div className="aa-pred">
        <div><Tooltip tip="Difference between the predicted ΔG before and after the variant. A value above 2 often indicates a
      destabilising variant.">Stability change ΔΔG</Tooltip>{pubmedRef(PUBMED_ID.FOLDX)}</div>
        <Tooltip
          tip={`Protein stability difference between wild-type and variant protein calculated using FoldX 5.0. Based on AlphaFold2 structure, position confidence pLDDT ${props.foldxs[0].plddt}`}>
          {formatFoldxScore(props.foldxs[0])}
        </Tooltip>
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
    return <Tooltip tip="A ΔΔG of more than 2 kcal/mole is considered to be likely destabilising to the protein.">
      <i className="bi bi-circle-fill" style={{color: color}}></i>
      <Spaces/>{text}
    </Tooltip>
  }
  return <></>
}