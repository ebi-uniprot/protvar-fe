/**
 * Confidence-level pill filter for pockets.
 * Only renders when pockets span more than one confidence level.
 */

import React, { useState, useMemo } from 'react';
import { Pocket } from '../../../../types/Prediction';
import { getPocketConfidence, CONFIDENCE_LEVELS, ConfidenceLevel } from '../utils/confidenceUtils';

interface PocketFilterProps {
  pockets: Pocket[];
  onFilter: (filteredPockets: Pocket[]) => void;
}

const ORDERED_LEVELS: ConfidenceLevel[] = [
  CONFIDENCE_LEVELS.VERY_HIGH,
  CONFIDENCE_LEVELS.HIGH,
  CONFIDENCE_LEVELS.LOW,
];

export function PocketFilter({ pockets, onFilter }: PocketFilterProps) {
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const presentLevels = useMemo(() => {
    const labels = new Set(pockets.map(p => getPocketConfidence(p.score).label));
    return ORDERED_LEVELS.filter(level => labels.has(level.label));
  }, [pockets]);

  // Only show when there are multiple distinct confidence levels
  if (presentLevels.length <= 1) return null;

  const handlePill = (label: string) => {
    const next = activeLabel === label ? null : label;
    setActiveLabel(next);
    onFilter(
      next ? pockets.filter(p => getPocketConfidence(p.score).label === next) : pockets
    );
  };

  return (
    <div className="pocket-filter-pills-row">
      <span className="pocket-filter-label">Filter:</span>
      {presentLevels.map(level => (
        <button
          key={level.label}
          className={`pocket-filter-pill${activeLabel === level.label ? ' active' : ''}`}
          onClick={() => handlePill(level.label)}
          title={activeLabel === level.label ? 'Clear filter' : `Show ${level.label} only`}
        >
          <i className={`bi ${level.icon} ${level.className}`} /> {level.label}
        </button>
      ))}
      {activeLabel && (
        <button className="pocket-filter-clear" onClick={() => handlePill(activeLabel)}>
          ✕ clear
        </button>
      )}
    </div>
  );
}
