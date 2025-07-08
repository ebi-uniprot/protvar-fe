import XRefDetail from "./common/XRefDetail";
import {Variant} from "../../../types/PopulationObservation";
import React from "react";

interface SubmittedVariantDetailsProps {
  variants: Array<Variant>
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
      <XRefDetail xrefs={variant.xrefs} populationFrequencies={variant.populationFrequencies}
                  clinicalSignificances={variant.clinicalSignificances}/>
    </ul>
  );
}

export default SubmittedVariantDetails;