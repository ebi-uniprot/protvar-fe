/**
 * Feature list — sorted by clinical relevance rank, grouped by type.
 */

import React from 'react';
import { Feature } from '../../../../types/FunctionalInfo';
import { FeatureItem } from './FeatureItem';
import {
  groupFeaturesByType,
  getFeatureLabel,
  getFeaturePriority,
  FeaturePriority,
} from '../utils/featureRanking';

interface FeatureListProps {
  features: Feature[];
  expandedSection: string;
  onToggle: (key: string) => void;
  keyPrefix: string;
}

export function FeatureList({ features, expandedSection, onToggle, keyPrefix }: FeatureListProps) {
  if (features.length === 0) return null;

  const grouped = groupFeaturesByType(features);

  return (
    <div className="feature-list">
      {Array.from(grouped.entries()).map(([type, typeFeatures]) => (
        <FeatureGroup
          key={type}
          type={type}
          features={typeFeatures}
          expandedSection={expandedSection}
          onToggle={onToggle}
          keyPrefix={keyPrefix}
        />
      ))}
    </div>
  );
}

interface FeatureGroupProps {
  type: string;
  features: Feature[];
  expandedSection: string;
  onToggle: (key: string) => void;
  keyPrefix: string;
}

function FeatureGroup({ type, features, expandedSection, onToggle, keyPrefix }: FeatureGroupProps) {
  const label = getFeatureLabel(type);
  const priority = getFeaturePriority(type);

  return (
    <div className={`feature-group feature-group--${priority}`}>
      <div className="feature-group-header">
        <span className="feature-type-label">{label}</span>
        {features.length > 1 && (
          <span className="count-badge">{features.length}</span>
        )}
      </div>
      <div className="feature-group-items">
        {features.map((feature, index) => {
          const key = `${keyPrefix}-${type}-${index}`;
          return (
            <FeatureItem
              key={key}
              itemKey={key}
              feature={feature}
              isExpanded={expandedSection === key}
              onToggle={onToggle}
            />
          );
        })}
      </div>
    </div>
  );
}
