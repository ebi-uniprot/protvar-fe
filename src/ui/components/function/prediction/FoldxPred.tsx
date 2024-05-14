import {Foldx} from "../../../../types/FunctionalResponse";
import Spaces from "../../../elements/Spaces";
import {PUBMED_ID} from "./Prediction";
import {Info, pubmedRef} from "../../common/Common";

export const FoldxPred = (props: { foldxs: Array<Foldx> }) => {
  if (props.foldxs === null || props.foldxs.length === 0) {
    return <></>
  }
  return <div>
    <div className="aa-pred">
      <div>Stability change ΔΔG{pubmedRef(PUBMED_ID.FOLDX)}</div>
      <div title="Difference between the predicted ΔG before and after the variant. A value above 2 often indicates a
      destabilising variant.">{props.foldxs[0].foldxDdg}
        <Info text={`Protein stability difference between wild-type and variant protein calculated using FoldX 5.0. Based on AlphaFold2 structure, position confidence pLDDT ${props.foldxs[0].plddt}`} />
      </div>
      <div><FoldxPredIcon foldx={props.foldxs[0]}/></div>
    </div>
  </div>
}

function FoldxPredIcon(props: { foldx?: Foldx }) {
  if (props.foldx) {
    const color = props.foldx.foldxDdg >= 2 ? 'red' : 'blue'
    const text = props.foldx.foldxDdg >= 2 ? 'likely to be destabilising' : 'unlikely to be destabilising'
    return <>
      <i className="bi bi-circle-fill" style={{color: color}}></i>
      <Spaces/>{text}
      <Info text="A ΔΔG of more than 2 kcal/mole is considered to be likely destabilising to the protein" />
    </>
  }
  return <></>
}