import React from 'react';
import { describeFilters, removeChip, restoreChip } from "./filterUtils";
import { SearchFilterParams } from "./SearchFilters";

interface FilterChipsProps {
  filters: SearchFilterParams;             // staged (locally edited) filters
  appliedFilters?: SearchFilterParams;     // filters the current results reflect
  onFiltersChange: (filters: SearchFilterParams) => void;
  onApply?: () => void;
  loading?: boolean;
  upload?: boolean;
}

/**
 * Active-filter chips: a summary of the selection with per-chip remove/restore, Clear all and a reload
 * button. Used inside the inline filter panel and, with the filter rail, above the results table.
 */
const FilterChips: React.FC<FilterChipsProps> = ({ filters, appliedFilters, onFiltersChange, onApply,
                                                    loading = false, upload = false }) => {
  // "Applied" = filters the current results reflect (falls back to staged).
  const applied = appliedFilters ?? filters;

  // Union of staged + applied, keyed by id. A chip is "staged for removal" (greyed) when it's applied but no
  // longer staged.
  const localChips = describeFilters(filters, upload);
  const localIds = new Set(localChips.map(c => c.id));
  const chipMap = new Map<string, { id: string; label: string; staged: boolean }>();
  describeFilters(applied, upload).forEach(c => chipMap.set(c.id, { ...c, staged: !localIds.has(c.id) }));
  localChips.forEach(c => chipMap.set(c.id, { ...c, staged: false }));
  const chips = Array.from(chipMap.values());

  const hasPendingChanges = JSON.stringify(filters) !== JSON.stringify(applied);

  // × on a chip stages a removal (greys it); × on a greyed chip restores it.
  const toggleChip = (id: string, staged: boolean) => {
    onFiltersChange(staged ? restoreChip(filters, applied, id) : removeChip(filters, id, upload));
  };

  const handleClearAll = () => {
    let cleared = filters;
    describeFilters(filters, upload).forEach(c => { cleared = removeChip(cleared, c.id, upload); });
    onFiltersChange(cleared);
  };

  if (chips.length === 0) return null;

  return (
    <div className="filter-chips">
      {chips.map(c => (
        <span key={c.id} className={`filter-chip${c.staged ? ' filter-chip--staged' : ''}`}>
          <button
            type="button"
            className="filter-chip__x"
            onClick={() => toggleChip(c.id, c.staged)}
            aria-label={`${c.staged ? 'Restore' : 'Remove'} ${c.label}`}
            title={c.staged ? 'Restore' : 'Remove'}
          >
            <i className={`bi ${c.staged ? 'bi-arrow-counterclockwise' : 'bi-x-lg'}`}></i>
          </button>
          <span className="filter-chip__label">{c.label}</span>
        </span>
      ))}
      <button type="button" className="filter-chip-clear" onClick={handleClearAll}>Clear all</button>
      {onApply && (
        <button
          type="button"
          className={`filter-chip-reload${hasPendingChanges ? ' filter-chip-reload--pending' : ''}`}
          onClick={onApply}
          disabled={loading || !hasPendingChanges}
          aria-label="Apply filter changes and reload results"
          title={hasPendingChanges ? 'Apply changes' : 'No pending changes'}
        >
          <i className="bi bi-arrow-clockwise"></i>
        </button>
      )}
    </div>
  );
};

export default FilterChips;
