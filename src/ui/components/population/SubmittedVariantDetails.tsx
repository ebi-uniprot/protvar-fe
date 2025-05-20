import XRefDetail from "./common/XRefDetail";
import {Variant} from "../../../types/PopulationObservation";
import {AlleleFreq} from "./AlleleFreq";
import React from "react";
import {GnomadFreq} from "../../../types/MappingResponse";

interface SubmittedVariantDetailsProps {
  variants: Array<Variant>
  gnomadFreq: GnomadFreq
  gnomadCoord: string
}
function SubmittedVariantDetails(props: SubmittedVariantDetailsProps) {
  if (props.variants.length <= 0) {
    return <label><b>The variant has not been reported before</b></label>
  }

  let variant = props.variants[0];
  let change = variant.wildType + '>' + variant.alternativeSequence;

  return (
    <ul>
      <li>
        <b>Change:</b> {change}
      </li>
      <li>
        <b>Genomic Location:</b> {variant.genomicLocation?.[0]}
      </li>
      {props.gnomadFreq && <li>
        <AlleleFreq gnomadFreq={props.gnomadFreq} gnomadCoord={props.gnomadCoord} stdColor={false}/>
      </li>}
      <XRefDetail xrefs={variant.xrefs} populationFrequencies={variant.populationFrequencies}
                  clinicalSignificances={variant.clinicalSignificances}/>
    </ul>
  );
}

export default SubmittedVariantDetails;