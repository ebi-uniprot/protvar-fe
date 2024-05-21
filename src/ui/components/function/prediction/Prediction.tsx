import {MappingRecord} from "../../../../utills/Convertor";
import {ConservPred} from "./ConservPred";
import {AlphaMissensePred} from "./AlphaMissensePred";
import {EvePred} from "./EvePred";
import {EsmPred} from "./EsmPred";
import {FoldxPred} from "./FoldxPred";
import {Foldx} from "../../../../types/FunctionalResponse";
import {useContext} from "react";
import {AppContext} from "../../../App";
import {CaddScorePred} from "./CaddScorePred";
import {ColourCheckbox} from "../../../modal/ColourCheckbox";

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

export const Prediction = (props: { record: MappingRecord, foldxs: Array<Foldx> }) => {
  const {stdColor, toggleStdColor} = useContext(AppContext);
  return <><br/>
    <ConservPred conserv={props.record.conservScore} stdColor={stdColor} />
    <b>Structure predictions</b><br/>
    <FoldxPred foldxs={props.foldxs}/>
    <b>Pathogenicity predictions</b><br/>
    {(!props.record.cadd && !props.record.amScore && !props.record.eveScore && !props.record.esmScore) &&
      <div>No predictions available for this variant</div>
    }
    <CaddScorePred cadd={props.record.cadd} stdColor={stdColor}/>
    <AlphaMissensePred am={props.record.amScore} stdColor={stdColor}/>
    <EvePred eve={props.record.eveScore} stdColor={stdColor}/>
    <EsmPred esm={props.record.esmScore} stdColor={stdColor}/>
    <ColourCheckbox stdColor={stdColor} toggleStdColor={toggleStdColor}/>
  </>
}

