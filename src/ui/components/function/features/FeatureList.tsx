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
} from '../utils/featureRanking';

interface FeatureListProps {
  features: Feature[];
  expandedSections: Set<string>;
  onToggle: (key: string) => void;
  keyPrefix: string;
}

export function FeatureList({ features, expandedSections, onToggle, keyPrefix }: FeatureListProps) {
  if (features.length === 0) return null;

  const grouped = groupFeaturesByType(features);

  return (
    <div className="feature-list">
      {Array.from(grouped.entries()).map(([type, typeFeatures]) => (
        <FeatureGroup
          key={type}
          type={type}
          features={typeFeatures}
          expandedSections={expandedSections}
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
  expandedSections: Set<string>;
  onToggle: (key: string) => void;
  keyPrefix: string;
}

function FeatureGroup({ type, features, expandedSections, onToggle, keyPrefix }: FeatureGroupProps) {
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
              isExpanded={expandedSections.has(key)}
              onToggle={onToggle}
            />
          );
        })}
      </div>
    </div>
  );
}
