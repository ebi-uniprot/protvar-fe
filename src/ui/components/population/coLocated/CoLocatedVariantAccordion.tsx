import { useState } from 'react';
import { ReactComponent as ChevronDownIcon } from "../../../../images/chevron-down.svg"
import { v1 as uuidv1 } from 'uuid';
import { StringVoidFun } from '../../../../constants/CommonTypes';
import CoLocatedVariantGenomicLocationAccordion from './CoLocatedVariantGenomicLocationAccordion';
import {ProteinColocatedVariant} from "../../../../types/PopulationObservationResponse";
interface CoLocatedVariantAccordionProps {
  toggleCoLocated: StringVoidFun
  coLocatedVariants: Array<ProteinColocatedVariant>
  expandedCoLocatedKey: string
}
function CoLocatedVariantAccordion(props: CoLocatedVariantAccordionProps) {
  const { toggleCoLocated, expandedCoLocatedKey, coLocatedVariants } = props;
  const [expandedGenomicKey, setExpandedGenomicKey] = useState('');
  const toggleGenomic = (key: string) => {
    setExpandedGenomicKey(expandedGenomicKey === key ? '' : key)
  }

  const coLocatedVariantsMap = new Map();
  coLocatedVariants.forEach((variant) => {
    let change = variant.wildType + ' > ' + variant.alternativeSequence;
    var coLocatedVariants = coLocatedVariantsMap.get(change);
    if (!coLocatedVariants)
      coLocatedVariants = [];

    coLocatedVariants.push(
      <li key={uuidv1()}>
        <CoLocatedVariantGenomicLocationAccordion coLocatedVariant={variant} toggleGenomic={toggleGenomic}
          expandedGenomicKey={expandedGenomicKey} />
      </li>);
    coLocatedVariantsMap.set(change, coLocatedVariants);
  });

  const variantDetails: Array<JSX.Element> = [];
  coLocatedVariantsMap.forEach((genomicLocations, change) => {
    variantDetails.push(
      <li key={uuidv1()}>
        <button type="button" className="collapsible" onClick={(e) => toggleCoLocated(change)}>
          <b>
            {change} ({genomicLocations.length})
          </b>
          <ChevronDownIcon className="chevronicon" />
        </button>
        {change === expandedCoLocatedKey && <ul>{genomicLocations}</ul>}
      </li>
    );
  });

  return <>{variantDetails}</>;
}
export default CoLocatedVariantAccordion;