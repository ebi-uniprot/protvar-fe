import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import "./AdvancedSearch.css";
import {extractFilters} from "./SearchFiltersUtils";
import {ALPHAMISSENSE_CATEGORIES, CADD_CATEGORIES, VALID_AM_VALUES, VALID_CADD_VALUES} from "./filterConstants";

export interface SearchFilterParams {
  cadd: string[];
  am: string[];
  known?: boolean; // only set to true if explicitly enabled
  sort?: string;  // Optional
  order?: "asc" | "desc";  // Optional
}

function normalizeFilterValues(selected: string[], valid: string[]) {
  const validSet = new Set(valid);
  return selected.map(v => v.toLowerCase())
    .filter(v => validSet.has(v));
}

// ResultPage: Genomic|Protein view toggle (default: depends on users input-num of gen/prot inputs on page: gen>prot->gen view)


interface AdvancedSearchProps {
  loading: boolean
}

const AdvancedSearch = ({
                                    loading
                                  }: AdvancedSearchProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<SearchFilterParams>(extractFilters(searchParams));

  const isAnyFilterSpecified =
    filters.cadd.length > 0 ||
    filters.am.length > 0 ||
    filters.sort !== undefined ||
    filters.order !== undefined;
  const [isExpanded, setIsExpanded] = useState(isAnyFilterSpecified);

  // Update filters when URL changes
  useEffect(() => {
    setFilters(extractFilters(searchParams));
  }, [searchParams]);

  const handleCheckboxChange = (key: "cadd" | "am", value: string) => {
    const lowerValue = value.toLowerCase();
    setFilters((prev) => {
      const currentValues = prev[key].map(v => v.toLowerCase());
      const updated = currentValues.includes(lowerValue)
        ? currentValues.filter((v) => v !== lowerValue) // Remove if already selected
        : [...currentValues, lowerValue]; // Add if not selected
      return { ...prev, [key]: updated };
    });
  };
  const handleSortChange = (field: "sort" | "order", value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value || undefined, // Remove empty selections
    }));
  };

  const normalizedCadd = normalizeFilterValues(filters.cadd, VALID_CADD_VALUES);
  const normalizedAm = normalizeFilterValues(filters.am, VALID_AM_VALUES);

  const allCaddSelected = normalizedCadd.length === VALID_CADD_VALUES.length;
  const allAmSelected = normalizedAm.length === VALID_AM_VALUES.length;

  // Apply filters and update the URL
  const applyFilters = () => {
    ["page", "annotation", "cadd", "am", "sort", "order"].forEach((key) =>
      searchParams.delete(key)
    );

    //filters.cadd.forEach((val) => searchParams.append("cadd", val));
    //filters.am.forEach((val) => searchParams.append("am", val));
    if (!allCaddSelected)  normalizedCadd.forEach((val) => searchParams.append("cadd", val));
    if (!allAmSelected)  normalizedAm.forEach((val) => searchParams.append("am", val));
    filters.known === true ? searchParams.set("known", "true") : searchParams.delete("known");
    if (filters.sort) searchParams.set("sort", filters.sort);
    if (filters.order) searchParams.set("order", filters.order);
    navigate(`${location.pathname}${searchParams.size > 0 ? `?${searchParams}` : ``}`);
  };

  const isCaddSelected = (value: string) =>
    normalizedCadd.length === 0 || normalizedCadd.includes(value.toLowerCase());

  const isAmSelected = (value: string) =>
    normalizedAm.length === 0 || normalizedAm.includes(value.toLowerCase());

  return (
    <div className="advanced-search">
      {/* Toggle button */}
      <button className="section-header" onClick={() => setIsExpanded(!isExpanded)}>
        <span><i className="bi bi-filter"></i> Search Filters</span>
        <i className={isExpanded ? 'bi-chevron-down' : 'bi-chevron-up'}></i>
      </button>

      {/* Search panel */}
      {isExpanded && (
        <div className="search-panel">
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
                      : <i className="bi-x-lg cross"></i>}
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
                      : <i className="bi-x-lg cross"></i>}
                    {' '}{cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sorting */}
            <div className="filter-group">
              <label>Sort By</label>
              <div className="button-group compact">
                {["cadd", "am"].map(field => (
                  <button
                    key={field}
                    className={`filter-button ${filters.sort === field ? "selected" : ""}`}
                    onClick={() =>
                      setFilters(prev => ({
                        ...prev,
                        sort: filters.sort === field ? undefined : field,
                        order: filters.sort === field ? undefined : "asc",
                      }))
                    }
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


            {/* Known Variants Filter */}
            <div className="filter-group" style={{ width: '100%', marginTop: '1rem' }}>
              <label>
                <input
                  type="checkbox"
                  checked={filters.known === true}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      known: e.target.checked ? true : undefined, // omit if not checked
                    }))}
                />
                {' '}Show only known variants{' '}<span style={{fontWeight: 'normal', fontSize: '0.9em', color: '#666'}}>
                  (default: potential included)
                  </span>
              </label>
            </div>

          </div>

          {/* Apply Filters Button */}
          <div className="filter-actions">
            <button className="apply-button" onClick={applyFilters} disabled={loading}>
              {loading ? `Loading...` : `Update Results`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;