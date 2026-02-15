import { useState } from 'react';
import CoLocatedVariant from "./CoLocatedVariant";
import {Variant} from "../../../../types/PopulationObservation";

interface CoLocatedVariantDetailsProps {
  coLocatedVariants: Array<Variant>;
}

function CoLocatedVariantDetails(props: CoLocatedVariantDetailsProps) {
  const [expandedCoLocatedKey, setExpandedCoLocatedKey] = useState('');

  const toggleCoLocated = (key: string) => {
    setExpandedCoLocatedKey(expandedCoLocatedKey === key ? '' : key);
  };

  if (props.coLocatedVariants.length <= 0) {
    return <div className="submitted-variant-no-data">No co-located variants to report</div>;
  }

  return (
    <div>
      <div className="colocated-variants-intro">
        Variants at the same amino acid position with different nucleotide changes
      </div>
      <CoLocatedVariant
          {...props}
          expandedCoLocatedKey={expandedCoLocatedKey}
          toggleCoLocated={toggleCoLocated}
      />
    </div>
  );
}

export default CoLocatedVariantDetails;