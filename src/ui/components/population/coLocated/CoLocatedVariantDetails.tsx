import CoLocatedVariant from "./CoLocatedVariant";
import {Variant} from "../../../../types/PopulationObservation";

interface CoLocatedVariantDetailsProps {
  coLocatedVariants: Variant[];
  selectedVariant: Variant | null;
  onSelect: (variant: Variant) => void;
}

function CoLocatedVariantDetails({ coLocatedVariants, selectedVariant, onSelect }: CoLocatedVariantDetailsProps) {
  if (coLocatedVariants.length <= 0) {
    return (
      <div className="empty-state-wrapper">
        <span className="empty-state">No co-located variants to report</span>
      </div>
    );
  }

  return (
    <div>
      <div className="colocated-variants-intro">
        Variants at the same amino acid position with different nucleotide changes
      </div>
      <CoLocatedVariant
        coLocatedVariants={coLocatedVariants}
        selectedVariant={selectedVariant}
        onSelect={onSelect}
      />
    </div>
  );
}

export default CoLocatedVariantDetails;
