import { useState } from 'react';
import { ReactComponent as ChevronDownIcon } from "franklin-sites/src/svg/chevron-down.svg";
import { v1 as uuidv1 } from 'uuid';
import { StringVoidFun } from '../../../../constants/CommonTypes';
import { ProteinColocatedVariant } from '../PopulationDetail';
import CoLocatedVariantGenomicLocationAccordion from './CoLocatedVariantGenomicLocationAccordion';
interface CoLocatedVariantAccordionProps {
  toggleCoLocated: StringVoidFun
  coLocatedVariants: Array<ProteinColocatedVariant>
  expendedCoLocatedKey: string
}
function CoLocatedVariantAccordion(props: CoLocatedVariantAccordionProps) {
  const { toggleCoLocated, expendedCoLocatedKey, coLocatedVariants } = props;
  const [expendedGenomicKey, setExpendedGenomicKey] = useState('');

  const toggleGenomic = (key: string) => {
    setExpendedGenomicKey(expendedGenomicKey === key ? '' : key)
  }

  const coLocatedVariantsMap = new Map();
  coLocatedVariants.forEach((variant) => {
    let change = variant.wildType + '>' + variant.alternativeSequence;
    var coLocatedVariants = coLocatedVariantsMap.get(change);
    if (!coLocatedVariants)
      coLocatedVariants = [];

    coLocatedVariants.push(
      <li key={uuidv1()}>
        <CoLocatedVariantGenomicLocationAccordion coLocatedVariant={variant} toggleGenomic={toggleGenomic}
          expendedGenomicKey={expendedGenomicKey} />
      </li>);
    coLocatedVariantsMap.set(change, coLocatedVariants);
  });

  const variantDetails: Array<JSX.Element> = [];
  coLocatedVariantsMap.forEach((genomicLocations, change) => {
    variantDetails.push(
      <li key={uuidv1()}>
        <button type="button" className="collapsible" onClick={(e) => toggleCoLocated(change)}>
          <b>
            {change}({genomicLocations.length})
          </b>
          <ChevronDownIcon className="chevronicon" />
        </button>
        {change === expendedCoLocatedKey && <ul>{genomicLocations}</ul>}
      </li>
    );
  });

  return <>{variantDetails}</>;
}
export default CoLocatedVariantAccordion;