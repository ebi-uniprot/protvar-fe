/**
 * List component for pockets with filtering and pagination
 */

import React, { useState } from 'react';
import { Pocket } from '../../../../types/Prediction';
import { PocketCard } from './PocketCard';
import { PocketFilter } from './PocketFilter';
import { PaginatedList } from '../common/PaginatedList';
import { EmptyState } from '../common/EmptyState';

interface PocketListProps {
  pockets: Pocket[];
  expandedSection: string;
  onToggle: (key: string) => void;
  onViewInStructure: (pocket: Pocket) => void;
}

const SECTION_KEY = 'pockets-0';
const PAGE_SIZE = 2;

export function PocketList({
                             pockets,
                             expandedSection,
                             onToggle,
                             onViewInStructure
                           }: PocketListProps) {
  const [filteredPockets, setFilteredPockets] = useState(pockets);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  if (pockets.length === 0) {
    return <EmptyState message="Variant not predicted to be in a pocket" />;
  }

  const handleFilter = (filteredList: Pocket[]) => {
    setFilteredPockets(filteredList);
    setVisibleCount(PAGE_SIZE); // Reset pagination when filtering
  };

  const isExpanded = expandedSection === SECTION_KEY;

  return (
    <div className="struct-pred-section">
      <button
        type="button"
        className="collapsible"
        onClick={() => onToggle(SECTION_KEY)}
        aria-expanded={isExpanded}
      >
        <i className={`bi bi-chevron-${isExpanded ? 'down' : 'right'} chevron-icon`}></i>
        <span>Pockets containing variant</span>
      </button>

      {isExpanded && (
        <div className="struct-pred-content">
          <PocketFilter
            pockets={pockets}
            onFilter={handleFilter}
          />

          <PaginatedList
            items={filteredPockets}
            visibleCount={visibleCount}
            pageSize={PAGE_SIZE}
            onShowMore={() => setVisibleCount(prev =>
              Math.min(prev + PAGE_SIZE, filteredPockets.length)
            )}
            onShowLess={() => setVisibleCount(prev =>
              Math.max(prev - PAGE_SIZE, PAGE_SIZE)
            )}
            renderItem={(pocket) => (
              <PocketCard
                key={`pocket-${pocket.pocketId}`}
                pocket={pocket}
                onViewInStructure={onViewInStructure}
              />
            )}
          />
        </div>
      )}
    </div>
  );
}