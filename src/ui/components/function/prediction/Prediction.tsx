import {MappingRecord} from "../../../../utills/Convertor";
import {ConservPred} from "./ConservPred";
import {AlphaMissensePred} from "./AlphaMissensePred";
import {EvePred} from "./EvePred";
import {EsmPred} from "./EsmPred";
import {FoldxPred} from "./FoldxPred";
import {Foldx} from "../../../../types/FunctionalResponse";
import {useContext} from "react";
import {StdColorContext} from "../../../App";

export type PredAttr = {
  title: string,
  color: string,
  stdColor: string,
  info?: string
}
export const PUBMED_ID = {
  CONSERV: 11093265,
  AM: 37733863,
  EVE: 34707284,
  ESM: 33876751,
  FOLDX: 15980494,
  INTERFACES: 36690744
}

export const Prediction = (props: { record: MappingRecord, foldxs: Array<Foldx> }) => {
  const stdColor = useContext(StdColorContext);
  return <><br/>
    <ConservPred conserv={props.record.conservScore}/>
    <b>Structure predictions</b><br/>
    <FoldxPred foldxs={props.foldxs}/>
    <b>Pathogenicity predictions</b><br/>
    <AlphaMissensePred am={props.record.amScore} stdColor={stdColor} />
    <EvePred eve={props.record.eveScore} stdColor={stdColor} />
    <EsmPred esm={props.record.esmScore} stdColor={stdColor} />
  </>
}