import {Variant} from "../../../types/PopulationObservation";
import React from "react";

interface SubmittedVariantDetailsProps {
  variants: Variant[];
  selectedVariant: Variant | null;
  onSelect: (variant: Variant) => void;
}

function SubmittedVariantDetails({ variants, selectedVariant, onSelect }: SubmittedVariantDetailsProps) {
  if (variants.length <= 0) {
    return <div className="submitted-variant-no-data">The variant has not been reported before</div>;
  }

  const variant = variants[0];
  const change = variant.wildType + ' > ' + variant.alternativeSequence;
  const isSelected = selectedVariant === variant;

  return (
    <div>
      <div
        className={`variant-item${isSelected ? ' variant-item--selected' : ''}`}
        onClick={() => onSelect(variant)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && onSelect(variant)}
      >
        <span className="variant-change">{change}</span>
        {variant.genomicLocation?.[0] && (
          <span className="variant-location">{variant.genomicLocation[0]}</span>
        )}
      </div>
    </div>
  );
}

export default SubmittedVariantDetails;
