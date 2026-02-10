/**
 * Filter component for pockets by confidence level
 */

import React from 'react';
import { Dropdown } from 'react-dropdown-now';
import { Pocket } from '../../../../types/Prediction';
import {POCKET_FILTER_OPTIONS} from "../utils/confidenceUtils";

interface PocketFilterProps {
  pockets: Pocket[];
  onFilter: (filteredPockets: Pocket[]) => void;
}

export function PocketFilter({ pockets, onFilter }: PocketFilterProps) {
  const handleFilterChange = (option: any) => {
    const filterValue = option.value;

    const filtered = pockets.filter(pocket => {
      if (filterValue === 0) {
        // Very high confidence: >900
        return pocket.score > 900;
      } else if (filterValue === 1) {
        // High confidence: 800-900
        return pocket.score >= 800 && pocket.score <= 900;
      } else if (filterValue === 2) {
        // Low confidence: <800
        return pocket.score < 800;
      } else {
        // Show all (filterValue === -1)
        return true;
      }
    });

    onFilter(filtered);
  };

  return (
    <div className="pocket-grid">
      <div>Pocket confidence</div>
      <div>
        <Dropdown
          className="pocket-confidence-dropdown"
          placeholder="Show all"
          options={POCKET_FILTER_OPTIONS}
          onChange={handleFilterChange}
        />
      </div>
    </div>
  );
}