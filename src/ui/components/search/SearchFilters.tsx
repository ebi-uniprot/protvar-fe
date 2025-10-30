// Reorganized SearchFilters.tsx
import React, { useState, useEffect } from 'react';
import './SearchFilters.css';
import {
  CADD_CATEGORIES,
  ALPHAMISSENSE_CATEGORIES,
  POPEVE_CATEGORIES,
  STABILITY_CATEGORIES
} from "./filterConstants";
//import RangeSlider from "./RangeSlider";

export interface SearchFilterParams {
  known?: boolean;
  cadd: string[];
  am: string[];
  popeve: string[];  // NEW: Added popEVE categories
  interact?: boolean;
  pocket?: boolean;
  stability: string[];
  sort?: string;
  order?: "asc" | "desc";
  // COMMENTED OUT - EVE range parameters
  // eve_min?: number;
  // eve_max?: number;
}

interface SearchFiltersProps {
  filters: SearchFilterParams;
  onFiltersChange: (filters: SearchFilterParams) => void;
  loading?: boolean;
  onApply?: () => void;
  showSorting?: boolean;
  className?: string;
}

const SORT_FIELDS = ["cadd", "am", "popeve"]  // Changed from "eve" to "popeve"

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
    filters.known !== undefined ||
    filters.cadd.length > 0 ||
    filters.am.length > 0 ||
    filters.popeve.length > 0 ||  // NEW: Check popEVE
    filters.interact !== undefined ||
    filters.pocket !== undefined ||
    filters.stability.length > 0 ||
    filters.sort !== undefined;
  // COMMENTED OUT - EVE range check
  // filters.eve_min !== undefined ||
  // filters.eve_max !== undefined;

  const [isExpanded, setIsExpanded] = useState(isAnyFilterActive);

  useEffect(() => {
    if (isAnyFilterActive) {
      setIsExpanded(true);
    }
  }, [isAnyFilterActive]);

  const handleCheckboxChange = (key: "cadd" | "am" | "popeve" | "stability", value: string) => {
    const lowerValue = value.toLowerCase();
    const currentValues = filters[key].map(v => v.toLowerCase());
    const updated = currentValues.includes(lowerValue)
      ? currentValues.filter(v => v !== lowerValue)
      : [...currentValues, lowerValue];

    onFiltersChange({ ...filters, [key]: updated });
  };

  const handleBooleanChange = (key: 'known' | 'interact' | 'pocket', checked: boolean) => {
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
  // COMMENTED OUT - EVE range handler
  /*
  const handleRangeChange = (paramName: string, low: number | null, high: number | null) => {
    const minKey = `${paramName}_min` as keyof SearchFilterParams;
    const maxKey = `${paramName}_max` as keyof SearchFilterParams;

    onFiltersChange({
      ...filters,
      [minKey]: low ?? undefined,
      [maxKey]: high ?? undefined
    });
  };
  */

  const isCaddSelected = (value: string) =>
    filters.cadd.includes(value.toLowerCase());

  const isAmSelected = (value: string) =>
    filters.am.includes(value.toLowerCase());

  const isPopEveSelected = (value: string) =>
    filters.popeve.includes(value.toLowerCase());

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

          {/* 1. Variant Type Filter - Known/Potential */}
          <div className="filter-section">
            <div className="switch-filter">
              <label className="switch-label">
                <div className="switch-container">
                  <input
                    type="checkbox"
                    className="switch-input"
                    checked={filters.known !== true}
                    onChange={(e) => handleBooleanChange('known', !e.target.checked)}
                  />
                  <span className="switch-slider"></span>
                </div>
                <span className="switch-text">
                  {filters.known !== true
                    ? "Include known + potential variants"
                    : "Known variants only"
                  }
                </span>
              </label>
            </div>
          </div>

          {/* 2. Consequence */}
          <div className="filter-section">
            <h4 className="section-title">Consequence</h4>
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

              {/* NEW: popEVE Score Categories */}
              <div className="filter-group">
                <label>popEVE Score</label>
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

              {/* COMMENTED OUT - EVE Score Range */}
              {/*
              <RangeSlider
                label="EVE Score"
                paramName="eve"
                min={0}
                max={1}
                step={0.01}
                onRangeChange={handleRangeChange}
                initialLow={filters.eve_min}
                initialHigh={filters.eve_max}
              />
              */}
            </div>
          </div>

          {/* 3. Structural */}
          <div className="filter-section">
            <h4 className="section-title">Structural</h4>
            <div className="filter-row">
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

            {/* Pocket and Interaction filters */}
            <div className="structural-switches">
              <div className="switch-filter">
                <label className="switch-label">
                  <div className="switch-container">
                    <input
                      type="checkbox"
                      className="switch-input"
                      checked={filters.pocket === true}
                      onChange={(e) => handleBooleanChange('pocket', e.target.checked)}
                    />
                    <span className="switch-slider"></span>
                  </div>
                  <span className="switch-text">Variants in predicted pockets only</span>
                </label>
              </div>

              <div className="switch-filter">
                <label className="switch-label">
                  <div className="switch-container">
                    <input
                      type="checkbox"
                      className="switch-input"
                      checked={filters.interact === true}
                      onChange={(e) => handleBooleanChange('interact', e.target.checked)}
                    />
                    <span className="switch-slider"></span>
                  </div>
                  <span className="switch-text">Variants in protein interactions only</span>
                </label>
              </div>
            </div>
          </div>

          {/* 4. Sorting - Only show if showSorting is true (results page) */}
          {showSorting && (
            <div className="filter-section">
              <h4 className="section-title">Sort Results</h4>
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
                        {field === "cadd" ? "CADD" : field === "am" ? "AlphaMissense" : "popEVE"}
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