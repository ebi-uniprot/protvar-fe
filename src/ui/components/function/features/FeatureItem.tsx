/**
 * Individual feature item with collapsible details
 * Displays feature type, description, position, and evidences
 */

import React from 'react';
import { v1 as uuidv1 } from 'uuid';
import { Feature } from '../../../../types/FunctionalInfo';
import { ReactComponent as ChevronDownIcon } from '../../../../images/chevron-down.svg';
import Evidences from '../Evidences';
import {getPositionLabel} from "../utils/featureUtils";

interface FeatureItemProps {
  itemKey: string;
  feature: Feature;
  isExpanded: boolean;
  onToggle: (key: string) => void;
}

export function FeatureItem({ itemKey, feature, isExpanded, onToggle }: FeatureItemProps) {
  return (
    <>
      <button
        type="button"
        className="collapsible"
        onClick={() => onToggle(itemKey)}
      >
        <span className="badge" style={{ margin: "0 5 0 5" }}>
          {feature.type.toLowerCase()}
        </span>
        {feature.description ?? 'Unnamed'}
        <ChevronDownIcon className="chevronicon" />
      </button>

      {isExpanded && (
        <ul style={{ listStyleType: 'none', display: 'inline-block' }}>
          <li key={uuidv1()}>
            {getPositionLabel(feature.begin, feature.end, feature.type)}
            <br />
            <Evidences evidences={feature.evidences} />
          </li>
        </ul>
      )}
    </>
  );
}