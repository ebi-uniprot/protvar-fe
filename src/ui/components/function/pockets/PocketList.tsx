/**
 * List component for pockets with filtering and expandable show more/less
 */

import React, { useState } from 'react';
import { Pocket } from '../../../../types/Prediction';
import { PocketCard } from './PocketCard';
import { PocketFilter } from './PocketFilter';
import { EmptyState } from '../common/EmptyState';
import { ExpandableList } from '../../common/ExpandableList';
import structureIcon from '../../../../images/structures-3d.svg';

interface PocketListProps {
  pockets: Pocket[];
  expandedSections: Set<string>;
  onToggle: (key: string) => void;
  onViewInStructure: (pocket: Pocket) => void;
}

const SECTION_KEY = 'pockets-0';

export function PocketList({ pockets, expandedSections, onToggle, onViewInStructure }: PocketListProps) {
  const [filteredPockets, setFilteredPockets] = useState(pockets);

  if (!pockets || pockets.length === 0) {
    return <EmptyState message="Variant not predicted to be in a pocket" />;
  }

  const isExpanded = expandedSections.has(SECTION_KEY);

  return (
    <div className="struct-pred-section">
      <button
        type="button"
        className="collapsible"
        onClick={() => onToggle(SECTION_KEY)}
        aria-expanded={isExpanded}
      >
        <i className="bi bi-chevron-right chevron-icon" />
        <span>Pockets containing variant <span className="count-badge">{pockets.length}</span></span>
      </button>

      <div className={`collapsible-anim${isExpanded ? ' open' : ''}`}>
        <div className="struct-pred-content">
          <PocketFilter pockets={pockets} onFilter={setFilteredPockets} />

          <div className="structure-col-header pocket-list-col-header">
            <span>Pocket</span>
            <span>Score</span>
            <span>pLDDT</span>
          </div>

          <ExpandableList
            items={filteredPockets}
            className="pocket-entries"
            renderItem={(pocket) => (
              <PocketCard
                key={pocket.pocketId}
                pocket={pocket}
                onViewInStructure={onViewInStructure}
              />
            )}
          />

          <p className="struct-pred-help">
            Click <img src={structureIcon} alt="3D structure" className="structure-icon-sm" /> to view in the structure tab.
          </p>
        </div>
      </div>
    </div>
  );
}
