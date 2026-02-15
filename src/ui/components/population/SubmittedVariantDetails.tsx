import XRefDetail from "./common/XRefDetail";
import {Variant} from "../../../types/PopulationObservation";
import React from "react";

interface SubmittedVariantDetailsProps {
  variants: Variant[];
}

function SubmittedVariantDetails(props: SubmittedVariantDetailsProps) {
  if (props.variants.length <= 0) {
    return <div className="submitted-variant-no-data">The variant has not been reported before</div>;
  }

  const variant = props.variants[0];
  const change = variant.wildType + ' > ' + variant.alternativeSequence;

  return (
    <div className="submitted-variant-details">
      <div className="protein-change-card">
        <div className="protein-change">{change}</div>
        {variant.genomicLocation?.[0] && (
          <div className="genomic-location">{variant.genomicLocation[0]}</div>
        )}
      </div>

      <XRefDetail
        xrefs={variant.xrefs}
        populationFrequencies={variant.populationFrequencies}
        clinicalSignificances={variant.clinicalSignificances}
      />
    </div>
  );
}

export default SubmittedVariantDetails;