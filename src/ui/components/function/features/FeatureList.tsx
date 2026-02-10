/**
 * List component for displaying feature annotations
 * Handles expandable/collapsible feature sections
 */

import { Feature } from '../../../../types/FunctionalInfo';
import { FeatureItem } from './FeatureItem';

interface FeatureListProps {
  features: Feature[];
  expandedSection: string;
  onToggle: (key: string) => void;
  keyPrefix: string; // e.g., "residue" or "region"
}

export function FeatureList({
                              features,
                              expandedSection,
                              onToggle,
                              keyPrefix
                            }: FeatureListProps) {
  if (features.length === 0) {
    return null;
  }

  return (
    <div className="feature-list">
      {features.map((feature, index) => {
        const key = `${keyPrefix}-${index}`;
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
  );
}