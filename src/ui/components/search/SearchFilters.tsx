// Reorganized SearchFilters.tsx
import React, { useState, useEffect } from 'react';
import './SearchFilters.css';
import {
  CADD_CATEGORIES,
  ALPHAMISSENSE_CATEGORIES,
  POPEVE_CATEGORIES,
  STABILITY_CATEGORIES,
  ALLELE_FREQ_CATEGORIES
} from "./filterConstants";
import RangeSlider from "./RangeSlider";

export interface SearchFilterParams {
  // Variant Type
  variant?: 'known' | 'potential';  // Radio button (default: 'known')

  // Functional
  ptm?: boolean;
  mutagen?: boolean;
  consMin?: number;
  consMax?: number;
  domain?: boolean;

  // Population
  disease?: boolean;
  freq: string[];

  // Structural
  expModel?: boolean;
  interact?: boolean;
  pocket?: boolean;
  stability: string[];

  // Consequence
  cadd: string[];
  am: string[];
  popeve: string[];
  esmMin?: number;
  esmMax?: number;

  // Sorting
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

const SORT_FIELDS = ["cadd", "am", "popeve", "esm1b"]

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
    filters.variant !== undefined ||
    filters.ptm !== undefined ||
    filters.mutagen !== undefined ||
    filters.consMin !== undefined ||
    filters.consMax !== undefined ||
    filters.domain !== undefined ||
    filters.disease !== undefined ||
    filters.freq.length > 0 ||
    filters.expModel !== undefined ||
    filters.interact !== undefined ||
    filters.pocket !== undefined ||
    filters.stability.length > 0 ||
    filters.cadd.length > 0 ||
    filters.am.length > 0 ||
    filters.popeve.length > 0 ||
    filters.esmMin !== undefined ||
    filters.esmMax !== undefined ||
    filters.sort !== undefined;

  const [isExpanded, setIsExpanded] = useState(isAnyFilterActive);

  useEffect(() => {
    if (isAnyFilterActive) {
      setIsExpanded(true);
    }
  }, [isAnyFilterActive]);

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
    <div className={`search-filters ${className}`}>
      {/* Toggle Header */}
      <button className="filter-header" onClick={() => setIsExpanded(!isExpanded)}>
        <span><i className="bi bi-funnel"></i> Search Filters</span>
        <i className={isExpanded ? 'bi-chevron-down' : 'bi-chevron-up'}></i>
      </button>

      {/* Filters Panel */}
      {isExpanded && (
        <div className="filter-panel">

          {/* 1. Variant Type - Radio Buttons */}
          <div className="filter-section">
            <h4 className="section-title">Variant Type</h4>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="variant"
                  value="known"
                  checked={filters.variant === 'known' || filters.variant === undefined}
                  onChange={() => handleVariantChange('known')}
                />
                <span>Known variants</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="variant"
                  value="potential"
                  checked={filters.variant === 'potential'}
                  onChange={() => handleVariantChange('potential')}
                />
                <span>Potential variants</span>
              </label>
            </div>
          </div>

          {/* 2. Functional */}
          <div className="filter-section">
            <h4 className="section-title">Functional</h4>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  disabled={true}
                  title={"COMING SOON"}
                  type="checkbox"
                  checked={filters.ptm === true}
                  onChange={(e) => handleBooleanChange('ptm', e.target.checked)}
                />
                <span>PTM (Post-Translational Modification)</span>
              </label>

              <label className="checkbox-label">
                <input
                  disabled={true}
                  title={"COMING SOON"}
                  type="checkbox"
                  checked={filters.mutagen === true}
                  onChange={(e) => handleBooleanChange('mutagen', e.target.checked)}
                />
                <span>Mutagenesis</span>
              </label>

              <label className="checkbox-label">
                <input
                  disabled={true}
                  title={"COMING SOON"}
                  type="checkbox"
                  checked={filters.domain === true}
                  onChange={(e) => handleBooleanChange('domain', e.target.checked)}
                />
                <span>Functional Domain</span>
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
          <div className="filter-section">
            <h4 className="section-title">Population</h4>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  disabled={true}
                  title={"COMING SOON"}
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
          <div className="filter-section">
            <h4 className="section-title">Structural</h4>

            <div className="checkbox-group">
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
                        {field === "cadd" ? "CADD" :
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

          {/* Apply Filters Button */}
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