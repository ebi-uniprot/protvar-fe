/**
 * Individual feature item — compact single-line display within a feature group.
 * Type badge is shown at the group level; this shows description + position + evidences.
 */

import React from 'react';
import { Feature } from '../../../../types/FunctionalInfo';
import { getPositionLabel } from '../utils/featureUtils';
import Evidences from '../../common/Evidences';

interface FeatureItemProps {
  itemKey: string;
  feature: Feature;
  isExpanded: boolean;
  onToggle: (key: string) => void;
}

export function FeatureItem({ itemKey, feature, isExpanded, onToggle }: FeatureItemProps) {
  const hasEvidences = feature.evidences && feature.evidences.length > 0;

  return (
    <div className="feature-item">
      <div className="feature-item-row">
        <span className="feature-description" title={feature.description ?? ''}>
          {feature.description || <em className="feature-no-desc">No description</em>}
        </span>
        <span className="feature-pos-inline">
          {getPositionLabel(feature.begin, feature.end, feature.type)}
        </span>
        {hasEvidences && (
          <button
            type="button"
            className="feature-evidence-toggle"
            onClick={() => onToggle(itemKey)}
            aria-expanded={isExpanded}
            title={isExpanded ? 'Hide evidences' : 'Show evidences'}
          >
            <i className={`bi bi-${isExpanded ? 'journal-text' : 'journal'}`}></i>
          </button>
        )}
      </div>

      {hasEvidences && (
        <div className={`collapsible-anim${isExpanded ? ' open' : ''}`}>
          <div className="feature-evidence-panel">
            <Evidences evidences={feature.evidences} />
          </div>
        </div>
      )}
    </div>
  );
}
