import { useState } from 'react';
import CoLocatedVariantAccordion from "./CoLocatedVariantAccordion";
import { ProteinColocatedVariant } from "../PopulationDetail";

interface CoLocatedVariantDetailsProps {
  coLocatedVariants: Array<ProteinColocatedVariant>
}

function CoLocatedVariantDetails(props: CoLocatedVariantDetailsProps) {
  const [expendedCoLocatedKey, setExpendedCoLocatedKey] = useState('');
  const toggleCoLocated = (key: string) => {
    setExpendedCoLocatedKey(expendedCoLocatedKey === key ? '' : key)
  }

  if (props.coLocatedVariants.length <= 0) {
    return <label><b>No co-located variants to report</b></label>
  }

  return (
    <>
      The following variants alter the same amino acid (but alter a different nucleotide in the codon)
      <br />
      <ul><CoLocatedVariantAccordion {...props} expendedCoLocatedKey={expendedCoLocatedKey} toggleCoLocated={toggleCoLocated} /></ul>
    </>
  );

}

export default CoLocatedVariantDetails;