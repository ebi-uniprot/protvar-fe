import {Foldx} from "../../../../types/FunctionalResponse";
import Spaces from "../../../elements/Spaces";
import {getPredRef, PUBMED_ID} from "./Prediction";

export const FoldxPred = (props: { foldxs: Array<Foldx> }) => {
  if (props.foldxs === null || props.foldxs.length === 0) {
    return <></>
  }
  return <div>
    Foldx {getPredRef(PUBMED_ID.FOLDX)}
    <div className="aa-pred">
      <div title="Difference between the predicted ΔG before and after the variant. A value above 2 often indicates a
      destabilising variant."><Spaces count={4}/>ΔΔG<sub>pred</sub></div>
      <div>{props.foldxs[0].foldxDdg}</div>
    </div>
    <div className="aa-pred">
      <div title="AlphaFold per-residue confidence score (pLDDT)."><Spaces count={4}/>pLDDT</div>
      <div>{props.foldxs[0].plddt}</div>
    </div>
  </div>
}