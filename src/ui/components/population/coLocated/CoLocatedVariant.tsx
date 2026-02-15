import React, { useState } from 'react';
import { StringVoidFun } from '../../../../constants/CommonTypes';
import CoLocatedVariantGenomicLocation from './CoLocatedVariantGenomicLocation';
import {Variant} from "../../../../types/PopulationObservation";
interface CoLocatedVariantProps {
  toggleCoLocated: StringVoidFun
  coLocatedVariants: Array<Variant>
  expandedCoLocatedKey: string
}

function CoLocatedVariant(props: CoLocatedVariantProps) {
  const { toggleCoLocated, expandedCoLocatedKey, coLocatedVariants } = props;
  const [expandedGenomicKey, setExpandedGenomicKey] = useState('');

  const toggleGenomic = (key: string) => {
    setExpandedGenomicKey(expandedGenomicKey === key ? '' : key);
  };

  // Group variants by change (wildType > alternativeSequence)
  const coLocatedVariantsMap = new Map<string, Variant[]>();
  coLocatedVariants.forEach((variant) => {
    const change = variant.wildType + ' > ' + variant.alternativeSequence;
    if (!coLocatedVariantsMap.has(change)) {
      coLocatedVariantsMap.set(change, []);
    }
    coLocatedVariantsMap.get(change)!.push(variant);
  });

  const variantDetails: Array<React.JSX.Element> = [];
  coLocatedVariantsMap.forEach((variants, change) => {
    const isExpanded = change === expandedCoLocatedKey;

    variantDetails.push(
      <div key={change} className="colocated-variant-section">
        <button
          type="button"
          className="collapsible"
          onClick={() => toggleCoLocated(change)}
          aria-expanded={isExpanded}
        >
          <i className={`bi bi-chevron-${isExpanded ? 'down' : 'right'} chevron-icon`}></i>
          <b>{change} ({variants.length})</b>
        </button>

        {isExpanded && (
          <div className="colocated-variant-content">

              {variants.map((variant, index) => (
                <CoLocatedVariantGenomicLocation
                  coLocatedVariant={variant}
                  toggleGenomic={toggleGenomic}
                  expandedGenomicKey={expandedGenomicKey}
                />
              ))}

          </div>
        )}
      </div>
    );
  });

  return <>{variantDetails}</>;
}

export default CoLocatedVariant;