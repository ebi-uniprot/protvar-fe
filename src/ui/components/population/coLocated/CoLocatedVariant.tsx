import React from 'react';
import {Variant} from "../../../../types/PopulationObservation";

interface CoLocatedVariantProps {
  coLocatedVariants: Variant[];
  selectedVariant: Variant | null;
  onSelect: (variant: Variant) => void;
}

function getVariantLabel(variant: Variant): string {
  if (variant.genomicLocation?.length > 0) return variant.genomicLocation[0];
  if (variant.xrefs?.length > 0) return variant.xrefs[0].id;
  return '';
}

function CoLocatedVariant({ coLocatedVariants, selectedVariant, onSelect }: CoLocatedVariantProps) {
  return (
    <>
      {coLocatedVariants.map((variant, index) => {
        const change = variant.wildType + ' > ' + variant.alternativeSequence;
        const label = getVariantLabel(variant);
        const isSelected = selectedVariant === variant;

        return (
          <div
            key={index}
            className={`variant-item${isSelected ? ' variant-item--selected' : ''}`}
            onClick={() => onSelect(variant)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onSelect(variant)}
          >
            <span className="variant-change">{change}</span>
            {label && <span className="variant-location">{label}</span>}
          </div>
        );
      })}
    </>
  );
}

export default CoLocatedVariant;
