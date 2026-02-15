/**
 * Individual feature item with collapsible details
 * Displays feature type, description, position, and evidences
 */

import React from 'react';
import { Feature } from '../../../../types/FunctionalInfo';
import {getPositionLabel} from "../utils/featureUtils";
import Evidences from "../../common/Evidences";

interface FeatureItemProps {
  itemKey: string;
  feature: Feature;
  isExpanded: boolean;
  onToggle: (key: string) => void;
}

export function FeatureItem({ itemKey, feature, isExpanded, onToggle }: FeatureItemProps) {
  return (
    <div className="feature-item">
      <button
        type="button"
        className="collapsible"
        onClick={() => onToggle(itemKey)}
        aria-expanded={isExpanded}
      >
        <i className={`bi bi-chevron-${isExpanded ? 'down' : 'right'} chevron-icon`}></i>
        <span className="badge">
          {feature.type.toLowerCase()}
        </span>
        <span className="feature-title">{feature.description ?? 'Unnamed'}</span>
      </button>

      {isExpanded && (
        <div className="feature-content">
          <div className="feature-position">
            {getPositionLabel(feature.begin, feature.end, feature.type)}
          </div>
          <Evidences evidences={feature.evidences} />
        </div>
      )}
    </div>
  );
}