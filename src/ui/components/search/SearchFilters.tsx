// Simple SearchFilters.tsx fix - just return what user selects
import React, { useState, useEffect } from 'react';
import './SearchFilters.css';
import {
  CADD_CATEGORIES,
  ALPHAMISSENSE_CATEGORIES,
  STABILITY_CATEGORIES
} from "./filterConstants";

export interface SearchFilterParams {
  cadd: string[];
  am: string[];
  stability: string[];
  known?: boolean;
  pocket?: boolean;
  interact?: boolean;
  sort?: string;
  order?: "asc" | "desc";
}

interface SearchFiltersProps {
  filters: SearchFilterParams;
  onFiltersChange: (filters: SearchFilterParams) => void;
  loading?: boolean;
  onApply?: () => void;
  showSorting?: boolean;
  className?: string;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
                                                       filters,
                                                       onFiltersChange,
                                                       loading = false,
                                                       onApply,
                                                       showSorting = false,
                                                       className = ''
                                                     }) => {
  // Auto-expand if any filters are active
  const isAnyFilterActive =
    filters.cadd.length > 0 ||
    filters.am.length > 0 ||
    filters.stability.length > 0 ||
    filters.known !== undefined ||
    filters.pocket !== undefined ||
    filters.interact !== undefined ||
    filters.sort !== undefined;

  const [isExpanded, setIsExpanded] = useState(isAnyFilterActive);

  useEffect(() => {
    if (isAnyFilterActive) {
      setIsExpanded(true);
    }
  }, [isAnyFilterActive]);

  const handleCheckboxChange = (key: "cadd" | "am" | "stability", value: string) => {
    const lowerValue = value.toLowerCase();
    const currentValues = filters[key].map(v => v.toLowerCase());
    const updated = currentValues.includes(lowerValue)
      ? currentValues.filter(v => v !== lowerValue)
      : [...currentValues, lowerValue];

    // Simply return whatever the user has selected - that's it!
    onFiltersChange({ ...filters, [key]: updated });
  };

  const handleBooleanChange = (key: 'known' | 'pocket' | 'interact', checked: boolean) => {
    onFiltersChange({
      ...filters,
      [key]: checked ? true : undefined
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

  const isCaddSelected = (value: string) =>
    filters.cadd.includes(value.toLowerCase());

  const isAmSelected = (value: string) =>
    filters.am.includes(value.toLowerCase());

  const isStabilitySelected = (value: string) =>
    filters.stability.includes(value.toLowerCase());

  return (
    <div className={`search-filters ${className}`}>
      {/* Toggle Header */}
      <button className="filter-header" onClick={() => setIsExpanded(!isExpanded)}>
        <span><i className="bi bi-funnel"></i> Search Filters</span>
        <i className={isExpanded ? 'bi-chevron-down' : 'bi-chevron-up'}></i>
      </button>

      {/* Filters Panel */}
      {isExpanded && (
        <div className="filter-panel">
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

            {/* Sorting - Only show if showSorting is true (results page) */}
            {showSorting && (
              <>
                <div className="filter-group">
                  <label>Sort By</label>
                  <div className="button-group compact">
                    {["cadd", "am"].map(field => (
                      <button
                        key={field}
                        className={`filter-button ${filters.sort === field ? "selected" : ""}`}
                        onClick={() => handleSortChange("sort", filters.sort === field ? "" : field)}
                      >
                        {field === "cadd" ? "CADD" : "AlphaMissense"}
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
                          {dir === "asc" ? "Asc" : "Desc"}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Stability */}
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

          {/* Boolean Filters */}
          <div className="boolean-filters">
            <div className="filter-group" style={{width: '100%', marginTop: '1rem'}}>
              <label>
                <input
                  type="checkbox"
                  checked={filters.known === true}
                  onChange={(e) => handleBooleanChange('known', e.target.checked)}
                />
                {' '}Show only known variants{' '}
                <span style={{fontWeight: 'normal', fontSize: '0.9em', color: '#666'}}>
                  (default: potential included)
                </span>
              </label>
            </div>

            <div className="filter-group" style={{width: '100%', marginTop: '1rem'}}>
              <label>
                <input
                  type="checkbox"
                  checked={filters.pocket === true}
                  onChange={(e) => handleBooleanChange('pocket', e.target.checked)}
                />
                {' '}Show only variants in predicted pockets
              </label>
            </div>

            <div className="filter-group" style={{width: '100%', marginTop: '1rem'}}>
              <label>
                <input
                  type="checkbox"
                  checked={filters.interact === true}
                  onChange={(e) => handleBooleanChange('interact', e.target.checked)}
                />
                {' '}Show only variants in P-P interaction
              </label>
            </div>
          </div>

          {/* Apply Filters Button - Only show if onApply is provided (results page) */}
          {onApply && (
            <div className="filter-actions">
              <button className="apply-button" onClick={onApply} disabled={loading}>
                {loading ? 'Loading...' : 'Update Results'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilters;