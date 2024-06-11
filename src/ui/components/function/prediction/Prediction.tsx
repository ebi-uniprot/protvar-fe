import {ConservPred} from "./ConservPred";
import {AlphaMissensePred} from "./AlphaMissensePred";
import {EvePred} from "./EvePred";
import {EsmPred} from "./EsmPred";
import {FoldxPred} from "./FoldxPred";
import {useContext} from "react";
import {AppContext} from "../../../App";
import {CaddScorePred} from "./CaddScorePred";
import {ColourCheckbox} from "../../../modal/ColourCheckbox";
import {ResidueRegionTableProps} from "../ResidueRegionTable";
import {aminoAcid3to1Letter} from "../../../../utills/Util";

export type PredAttr = {
  text: string,
  color: string,
  stdColor: string,
  tip?: string,
  range?: string
}
export const PUBMED_ID = {
  CADD: 30371827,
  CONSERV: 11093265,
  AM: 37733863,
  EVE: 34707284,
  ESM: 33876751,
  FOLDX: 15980494,
  INTERFACES: 36690744
}

export const Prediction = (props: ResidueRegionTableProps) => {
  const state = useContext(AppContext);
  const oneLetterVariantAA = aminoAcid3to1Letter(props.variantAA);
  const foldxs = props.functionalData.foldxs
  let foldxs_ = oneLetterVariantAA ? foldxs.filter(foldx => foldx.mutatedType.toLowerCase() === oneLetterVariantAA) : foldxs

  return <><br/>
    <ConservPred conserv={props.conservScore} stdColor={state.stdColor} />
    <b>Structure predictions</b><br/>
    <FoldxPred foldxs={foldxs_}/>
    <b>Pathogenicity predictions</b><br/>
    {(!props.caddScore && !props.amScore && !props.eveScore && !props.esmScore) &&
      <div>No predictions available for this variant</div>
    }
    <CaddScorePred cadd={props.caddScore} stdColor={state.stdColor}/>
    <AlphaMissensePred am={props.amScore} stdColor={state.stdColor}/>
    <EvePred eve={props.eveScore} stdColor={state.stdColor}/>
    <EsmPred esm={props.esmScore} stdColor={state.stdColor}/>
    <ColourCheckbox state={state} />
  </>
}

