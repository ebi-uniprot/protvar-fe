import {MappingRecord} from "../../../../utills/Convertor";
import {ConservPred} from "./ConservPred";
import {AlphaMissensePred} from "./AlphaMissensePred";
import {EvePred} from "./EvePred";
import {EsmPred} from "./EsmPred";
import {FoldxPred} from "./FoldxPred";
import {Foldx} from "../../../../types/FunctionalResponse";

export type PredAttr = {
  title: string,
  color: string,
}
export const PUBMED_ID = {
  CONSERV: 31606900,
  AM: 37733863,
  EVE: 34707284,
  ESM: 33876751,
  FOLDX: 15980494,
}

export const getPredRef = (id: number) => {
  return <sup><a href={`http://www.ncbi.nlm.nih.gov/pubmed/${id}`} target="_blank"
                 rel="noreferrer" title={`Source: PubMed ID ${id}`}>ref</a></sup>
}

export const Prediction = (props: { record: MappingRecord, foldxs: Array<Foldx> }) => {
  return <>
    <b>Predictions</b><br/>
    <ConservPred conserv={props.record.conservScore}/>
    <AlphaMissensePred am={props.record.amScore}/>
    <EvePred eve={props.record.eveScore}/>
    <EsmPred esm={props.record.esmScore}/>
    <FoldxPred foldxs={props.foldxs}/>
  </>
}