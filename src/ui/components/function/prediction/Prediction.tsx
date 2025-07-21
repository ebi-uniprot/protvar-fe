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

export type PredAttr = {
  text: string,
  color: string,
  stdColor: string,
  tip?: string,
  range?: string
}

export const Prediction = (props: ResidueRegionTableProps) => {
  const state = useContext(AppContext);
  return <><br/>
    <ConservPred conserv={props.functionalData.conservScore} stdColor={state.stdColor} />
    <b>Structure predictions</b><br/>
    <FoldxPred foldxs={props.functionalData.foldxs} variantAA={props.variantAA}/>
    <b>Pathogenicity predictions</b><br/>
    {(!props.caddScore && !props.amScore && !props.functionalData.eveScore && !props.functionalData.esmScore) &&
      <div>No predictions available for this variant</div>
    }
    <CaddScorePred cadd={props.caddScore} stdColor={state.stdColor}/>
    <AlphaMissensePred am={props.amScore} stdColor={state.stdColor}/>
    <EvePred eve={props.functionalData.eveScore} stdColor={state.stdColor}/>
    <EsmPred esm={props.functionalData.esmScore} stdColor={state.stdColor}/>
    <ColourCheckbox state={state} />
  </>
}

