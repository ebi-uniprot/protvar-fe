// Reorganized SearchFilters.tsx
import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  CADD_CATEGORIES,
  AVI_CATEGORIES,
  ALPHAMISSENSE_CATEGORIES,
  POPEVE_CATEGORIES,
  STABILITY_CATEGORIES,
  ALLELE_FREQ_CATEGORIES
} from "./filterConstants";
import FilterChips from "./FilterChips";
import RangeSlider from "./RangeSlider";

export interface SearchFilterParams {
  // Variant Type
  variant?: 'known' | 'potential';  // Radio button (default: 'known')

  // Functional
  ptm?: boolean;
  mutagen?: boolean;
  domain?: boolean;
  binding?: boolean;
  actsite?: boolean;
  consMin?: number;
  consMax?: number;

  // Population
  disease?: boolean;
  freq: string[];

  // Structural
  transmem?: boolean;
  expModel?: boolean;
  interact?: boolean;
  pocket?: boolean;
  stability: string[];

  // Consequence
  cadd: string[];
  aviMin?: number;
  am: string[];
  popeve: string[];
  esmMin?: number;
  esmMax?: number;

  // Sorting
  sort?: string;
  order?: "asc" | "desc";

  // Notes (uploaded result only): lines with notes (any) or without (none), or with any of these codes
  notes?: 'any' | 'none';
  codes?: string[];
}

interface SearchFiltersProps {
  filters: SearchFilterParams;             // staged (locally edited) filters
  appliedFilters?: SearchFilterParams;     // filters the current results reflect
  onFiltersChange: (filters: SearchFilterParams) => void;
  loading?: boolean;
  onApply?: () => void;
  showSorting?: boolean;
  upload?: boolean;                        // uploaded result: default is all submitted variants, not known only
  layout?: 'inline' | 'rail';              // inline: chip bar + expandable panel; rail: always-open side column
  onCollapse?: () => void;                 // rail: collapse button (the page hides the rail)
  className?: string;
  noteCodes?: NoteCodeOption[];            // uploaded result: the note codes its lines have, for the Notes group
  notesReady?: boolean;                    // uploaded result checked (its summary has counts): show the Notes group
}

// A note code an upload's lines have, with its catalogue label and how many lines have it
export interface NoteCodeOption {
  code: string;
  label: string;
  lines: number;
}

// AVI sort/filter need the 2026_02 genomic_score BE; hidden until REACT_APP_AVI_ENABLED=true (set at the cut-over)
const AVI_ENABLED = process.env.REACT_APP_AVI_ENABLED === "true"
const SORT_FIELDS = AVI_ENABLED
  ? ["cadd", "avi", "am", "popeve", "esm1b"]
  : ["cadd", "am", "popeve", "esm1b"]

const SearchFilters: React.FC<SearchFiltersProps> = ({
                                                       filters,
                                                       appliedFilters,
                                                       onFiltersChange,
                                                       loading = false,
                                                       onApply,
                                                       showSorting = false,
                                                       upload = false,
                                                       layout = 'inline',
                                                       onCollapse,
                                                       className = '',
                                                       noteCodes = [],
                                                       notesReady = false
                                                     }) => {
  // Panel stays collapsed by default — the chip bar shows what's active, so
  // the user only opens the tall panel to add a new selection.
  const [isExpanded, setIsExpanded] = useState(false);

  // Measure the panel's true height so the expand/collapse animates max-height
  // to an exact px target — no overshoot, so it's smooth rather than abrupt.
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelHeight, setPanelHeight] = useState(0);
  useLayoutEffect(() => {
    if (panelRef.current) setPanelHeight(panelRef.current.scrollHeight);
  }, [isExpanded, showSorting]);

  const rootRef = useRef<HTMLDivElement>(null);

  // Collapsed → sticky bar; expanded → normal flow (so the growing panel
  // pushes the results table down rather than overlapping it). On expand,
  // scroll the panel into view so it doesn't vanish upward if the user was
  // scrolled down while it was stuck.
  const toggleExpanded = () => {
    const next = !isExpanded;
    setIsExpanded(next);
    if (next) {
      requestAnimationFrame(() =>
        rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
  };

  const isRail = layout === 'rail';

  // "Applied" = filters the current results reflect (falls back to staged).
  const applied = appliedFilters ?? filters;

  const hasPendingChanges = JSON.stringify(filters) !== JSON.stringify(applied);

  const handleCheckboxChange = (key: "cadd" | "am" | "popeve" | "stability" | "freq", value: string) => {
    const lowerValue = value.toLowerCase();
    const currentValues = filters[key].map(v => v.toLowerCase());
    const updated = currentValues.includes(lowerValue)
      ? currentValues.filter(v => v !== lowerValue)
      : [...currentValues, lowerValue];

    onFiltersChange({ ...filters, [key]: updated });
  };

  const handleBooleanChange = (key: keyof SearchFilterParams, checked: boolean) => {
    onFiltersChange({
      ...filters,
      [key]: checked ? true : undefined
    });
  };

  // Sections open and close from their title; each shows how many of its filters are on. Sections with active
  // filters (and Variant Type, Notes) start open.
  const counts: Record<string, number> = {
    variant: (upload ? filters.variant === 'known' : filters.variant === 'potential') ? 1 : 0,
    notes: (filters.notes ? 1 : 0) + (filters.codes?.length ?? 0),
    functional: [filters.ptm, filters.mutagen, filters.domain, filters.binding, filters.actsite].filter(Boolean).length
      + (filters.consMin !== undefined || filters.consMax !== undefined ? 1 : 0),
    population: (filters.disease ? 1 : 0) + (filters.freq?.length ?? 0),
    structural: [filters.transmem, filters.expModel, filters.interact, filters.pocket].filter(Boolean).length
      + (filters.stability?.length ?? 0),
    consequence: (filters.cadd?.length ?? 0) + (filters.aviMin !== undefined ? 1 : 0) + (filters.am?.length ?? 0)
      + (filters.popeve?.length ?? 0) + (filters.esmMin !== undefined || filters.esmMax !== undefined ? 1 : 0),
    sort: filters.sort ? 1 : 0,
  };
  const [closed, setClosed] = useState<Record<string, boolean>>(() => Object.fromEntries(
    Object.entries(counts).map(([id, n]) => [id, n === 0 && id !== 'variant' && id !== 'notes'])));
  const sectionClass = (id: string) => `filter-section${closed[id] ? ' filter-section--closed' : ''}`;
  const sectionTitle = (id: string, title: string) => (
    <button type="button" className="section-title section-toggle" aria-expanded={!closed[id]}
            onClick={() => setClosed(c => ({ ...c, [id]: !c[id] }))}>
      <span>{title}{counts[id] > 0 && <span className="section-count">{counts[id]}</span>}</span>
      <i className={`bi bi-chevron-${closed[id] ? 'right' : 'down'}`} aria-hidden="true" />
    </button>
  );

  const handleNotesChange = (value: 'any' | 'none' | undefined) => {
    onFiltersChange({ ...filters, notes: value });
  };

  const handleCodeChange = (code: string, checked: boolean) => {
    const codes = filters.codes ?? [];
    onFiltersChange({ ...filters, codes: checked ? [...codes, code] : codes.filter(c => c !== code) });
  };

  const handleVariantChange = (value: 'known' | 'potential') => {
    onFiltersChange({
      ...filters,
      variant: value
    });
  };

  const handleConservationChange = (low: number | undefined, high: number | undefined) => {
    onFiltersChange({
      ...filters,
      consMin: low,
      consMax: high
    });
  };

  const handleEsm1bChange = (low: number | undefined, high: number | undefined) => {
    onFiltersChange({
      ...filters,
      esmMin: low,
      esmMax: high
    });
  };

  const handleSortChange = (field: "sort" | "order", value: string) => {
    if (field === 'sort') {
      onFiltersChange({
        ...filters,
        sort: value || undefined,
        order: value ? "asc" : undefined
      });
    } else if (field === 'order') {
      onFiltersChange({
        ...filters,
        order: (value as "asc" | "desc") || undefined
      });
    }
  };

  const isCaddSelected = (value: string) => filters.cadd.includes(value.toLowerCase());
  const isAmSelected = (value: string) => filters.am.includes(value.toLowerCase());
  const isPopEveSelected = (value: string) => filters.popeve.includes(value.toLowerCase());
  const isStabilitySelected = (value: string) => filters.stability.includes(value.toLowerCase());
  const isFreqSelected = (value: string) => filters.freq.includes(value.toLowerCase());

  return (
    <div ref={rootRef} className={`search-filters${isRail ? ' search-filters--rail' : (isExpanded ? ' expanded' : '')} ${className}`}>
      {/* Active-filter chips — inline layout only, while the panel is collapsed (they summarise the
          selection; expanded, the panel itself shows it). With the rail the page shows them above the table. */}
      {isRail || isExpanded ? null : (
        <FilterChips filters={filters} appliedFilters={appliedFilters} onFiltersChange={onFiltersChange}
                     onApply={onApply} loading={loading} upload={upload} />
      )}

      {/* Collapse toggle — funnel + label grouped left, chevron (disclosure) right */}
      {isRail ? (
        <div className="filter-header filter-header--rail">
          <span><i className="bi bi-funnel"></i>Filters</span>
          {onCollapse && (
            <button type="button" className="filter-rail-collapse" onClick={onCollapse}
                    aria-label="Hide filters" title="Hide filters">
              <i className="bi bi-chevron-double-left"></i>
            </button>
          )}
        </div>
      ) : (
        <button className="filter-header" onClick={toggleExpanded} aria-expanded={isExpanded}>
          <span><i className="bi bi-funnel"></i>Search Filters</span>
          <i className={`bi ${isExpanded ? 'bi-chevron-down' : 'bi-chevron-right'}`}></i>
        </button>
      )}

      {/* Filters Panel — max-height animates to the measured panel height
          (exact target → smooth, no max-height overshoot). */}
      <div
        className={isRail ? 'filter-rail-body' : `collapsible-anim${isExpanded ? ' open' : ''}`}
        style={isRail ? undefined : { maxHeight: isExpanded ? panelHeight : 0 }}
      >
        <div className="filter-panel" ref={panelRef}>

          {/* Update Results — top-right of the panel */}
          {onApply && (
            <div className="filter-panel-actions">
              <button className="apply-button" onClick={onApply} disabled={loading || !hasPendingChanges}>
                <i className="bi bi-arrow-clockwise"></i> {loading ? 'Loading…' : 'Update'}
              </button>
            </div>
          )}

          {/* 1. Variant Type - Radio Buttons */}
          <div className={sectionClass('variant')}>
            {sectionTitle('variant', 'Variant Type')}
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="variant"
                  value="known"
                  checked={filters.variant === 'known' || (!upload && filters.variant === undefined)}
                  onChange={() => handleVariantChange('known')}
                />
                <span>{upload ? 'Known variants only' : 'Known variants'}</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="variant"
                  value="potential"
                  checked={filters.variant === 'potential' || (upload && filters.variant === undefined)}
                  onChange={() => handleVariantChange('potential')}
                />
                <span>{upload ? 'All submitted variants' : 'Potential variants'}</span>
              </label>
            </div>
          </div>

          {/* Notes (uploaded result only): lines by their notes, across the whole upload */}
          {upload && notesReady && (
            <div className={sectionClass('notes')}>
              {sectionTitle('notes', 'Notes')}
              <div className="radio-group radio-group--stacked">
                {([[undefined, 'All lines'], ['any', 'Lines with notes'], ['none', 'Lines without notes']] as const)
                  .map(([value, label]) => (
                    <label key={label} className="radio-label">
                      <input type="radio" name="notes" checked={filters.notes === value}
                             onChange={() => handleNotesChange(value)} />
                      <span>{label}</span>
                    </label>
                  ))}
              </div>
              {noteCodes.length > 0 && (
                <div className="checkbox-group note-codes">
                  <span className="note-codes-label">By code</span>
                  {noteCodes.map(n => (
                    <label key={n.code} className="checkbox-label">
                      <input type="checkbox" checked={(filters.codes ?? []).includes(n.code)}
                             onChange={(e) => handleCodeChange(n.code, e.target.checked)} />
                      <span><span className="msg-code">{n.code}</span>{' '}{n.label}</span>
                      <span className="note-code-count">{n.lines.toLocaleString()}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. Functional */}
          <div className={sectionClass('functional')}>
            {sectionTitle('functional', 'Functional')}

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.ptm === true}
                  onChange={(e) => handleBooleanChange('ptm', e.target.checked)}
                />
                <span>PTM (Post-Translational Modification)</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.mutagen === true}
                  onChange={(e) => handleBooleanChange('mutagen', e.target.checked)}
                />
                <span>Mutagenesis</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.domain === true}
                  onChange={(e) => handleBooleanChange('domain', e.target.checked)}
                />
                <span>Functional Domain</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.binding === true}
                  onChange={(e) => handleBooleanChange('binding', e.target.checked)}
                />
                <span>Binding Site</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.actsite === true}
                  onChange={(e) => handleBooleanChange('actsite', e.target.checked)}
                />
                <span>Active Site</span>
              </label>
            </div>

            <div className="filter-row" style={{marginTop: '1rem'}}>
              <RangeSlider
                label="Conservation"
                min={0}
                max={1}
                step={0.01}
                initialLow={filters.consMin}
                initialHigh={filters.consMax}
                onChange={handleConservationChange}
              />
            </div>
          </div>

          {/* 3. Population */}
          <div className={sectionClass('population')}>
            {sectionTitle('population', 'Population')}

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.disease === true}
                  onChange={(e) => handleBooleanChange('disease', e.target.checked)}
                />
                <span>Disease Association</span>
              </label>
            </div>

            <div className="filter-row" style={{marginTop: '1rem'}}>
              <div className="filter-group">
                <label>Allele Frequency</label>
                <div className="button-group compact">
                  {ALLELE_FREQ_CATEGORIES.map(cat => (
                    <button
                      key={cat.value}
                      className={`filter-button ${isFreqSelected(cat.value) ? "selected" : ""}`}
                      onClick={() => handleCheckboxChange("freq", cat.value)}
                    >
                      {isFreqSelected(cat.value)
                        ? <i className="bi-check-lg tick"></i>
                        : <i className="bi-plus-lg plus"></i>}
                      {' '}{cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 4. Structural */}
          <div className={sectionClass('structural')}>
            {sectionTitle('structural', 'Structural')}

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.transmem === true}
                  onChange={(e) => handleBooleanChange('transmem', e.target.checked)}
                />
                <span>Transmembrane Region</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.expModel === true}
                  onChange={(e) => handleBooleanChange('expModel', e.target.checked)}
                />
                <span>Experimental Model</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.interact === true}
                  onChange={(e) => handleBooleanChange('interact', e.target.checked)}
                />
                <span>Protein-Protein Interface</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.pocket === true}
                  onChange={(e) => handleBooleanChange('pocket', e.target.checked)}
                />
                <span>Predicted Pocket</span>
              </label>
            </div>

            <div className="filter-row" style={{marginTop: '1rem'}}>
              <div className="filter-group">
                <label>Stability</label>
                <div className="button-group compact">
                  {STABILITY_CATEGORIES.map(cat => (
                    <button
                      key={cat.value}
                      className={`filter-button ${isStabilitySelected(cat.value) ? "selected" : ""}`}
                      onClick={() => handleCheckboxChange("stability", cat.value)}
                    >
                      {isStabilitySelected(cat.value)
                        ? <i className="bi-check-lg tick"></i>
                        : <i className="bi-plus-lg plus"></i>}
                      {' '}{cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 5. Consequence */}
          <div className={sectionClass('consequence')}>
            {sectionTitle('consequence', 'Consequence')}
            <div className="filter-row">
              {/* CADD Score */}
              <div className="filter-group">
                <label>CADD Score</label>
                <div className="button-group">
                  {CADD_CATEGORIES.map(cat => (
                    <button
                      key={cat.value}
                      className={`filter-button ${isCaddSelected(cat.value) ? "selected" : ""}`}
                      onClick={() => handleCheckboxChange("cadd", cat.value)}
                    >
                      {isCaddSelected(cat.value)
                        ? <i className="bi-check-lg tick"></i>
                        : <i className="bi-plus-lg plus"></i>}
                      {' '}{cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {AVI_ENABLED && (
                <div className="filter-group">
                  <label>AVI genome-wide rank</label>
                  <div className="button-group">
                    {AVI_CATEGORIES.map(cat => {
                      const selected = filters.aviMin === cat.min;
                      return (
                        <button
                          key={cat.min}
                          className={`filter-button ${selected ? "selected" : ""}`}
                          onClick={() => onFiltersChange({ ...filters, aviMin: selected ? undefined : cat.min })}
                          title={`AVI ≥ ${cat.min}`}
                        >
                          {selected ? <i className="bi-check-lg tick"></i> : <i className="bi-plus-lg plus"></i>}
                          {' '}{cat.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* AlphaMissense */}
              <div className="filter-group">
                <label>AlphaMissense</label>
                <div className="button-group compact">
                  {ALPHAMISSENSE_CATEGORIES.map(cat => (
                    <button
                      key={cat.value}
                      className={`filter-button ${isAmSelected(cat.value) ? "selected" : ""}`}
                      onClick={() => handleCheckboxChange("am", cat.value)}
                    >
                      {isAmSelected(cat.value)
                        ? <i className="bi-check-lg tick"></i>
                        : <i className="bi-plus-lg plus"></i>}
                      {' '}{cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* popEVE */}
              <div className="filter-group">
                <label>popEVE</label>
                <div className="button-group compact">
                  {POPEVE_CATEGORIES.map(cat => (
                    <button
                      key={cat.value}
                      className={`filter-button ${isPopEveSelected(cat.value) ? "selected" : ""}`}
                      onClick={() => handleCheckboxChange("popeve", cat.value)}
                    >
                      {isPopEveSelected(cat.value)
                        ? <i className="bi-check-lg tick"></i>
                        : <i className="bi-plus-lg plus"></i>}
                      {' '}{cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ESM1b */}
              <RangeSlider
                label="ESM1b"
                min={-25}
                max={0}
                step={0.1}
                initialLow={filters.esmMin}
                initialHigh={filters.esmMax}
                onChange={handleEsm1bChange}
              />
            </div>
          </div>

          {/* 6. Sorting */}
          {showSorting && (
            <div className={sectionClass('sort')}>
              {sectionTitle('sort', 'Sort Results')}
              <div className="filter-row">
                <div className="filter-group">
                  <label>Sort By</label>
                  <div className="button-group compact">
                    {SORT_FIELDS.map(field => (
                      <button
                        key={field}
                        className={`filter-button ${filters.sort === field ? "selected" : ""}`}
                        onClick={() => handleSortChange("sort", filters.sort === field ? "" : field)}
                      >
                        {field === "cadd" ? "CADD" :
                          field === "avi" ? "AVI" :
                          field === "am" ? "AlphaMissense" :
                            field === "popeve" ? "popEVE" : "ESM1b"}
                      </button>
                    ))}
                  </div>
                </div>

                {filters.sort && (
                  <div className="filter-group">
                    <label>Order</label>
                    <div className="button-group compact">
                      {["asc", "desc"].map(dir => (
                        <button
                          key={dir}
                          className={`filter-button ${filters.order === dir ? "selected" : ""}`}
                          onClick={() => handleSortChange("order", dir)}
                        >
                          {dir === "asc" ? "Ascending" : "Descending"}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SearchFilters;