import { useState } from 'react';
import CoLocatedVariantAccordion from "./CoLocatedVariantAccordion";
import {Variant} from "../../../../types/PopulationObservation";

interface CoLocatedVariantDetailsProps {
  coLocatedVariants: Array<Variant>
}

function CoLocatedVariantDetails(props: CoLocatedVariantDetailsProps) {
  const [expandedCoLocatedKey, setExpandedCoLocatedKey] = useState('');
  const toggleCoLocated = (key: string) => {
    setExpandedCoLocatedKey(expandedCoLocatedKey === key ? '' : key)
  }

  if (props.coLocatedVariants.length <= 0) {
    return <label><b>No co-located variants to report</b></label>
  }

  return (
    <>
      The following variants alter the same amino acid (but alter a different nucleotide in the codon)
      <br />
      <ul><CoLocatedVariantAccordion {...props} expandedCoLocatedKey={expandedCoLocatedKey} toggleCoLocated={toggleCoLocated} /></ul>
    </>
  );

}

export default CoLocatedVariantDetails;