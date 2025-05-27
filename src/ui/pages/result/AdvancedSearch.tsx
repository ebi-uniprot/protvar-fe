import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import "./AdvancedSearch.css";
import {extractFilters} from "./SearchFiltersUtils";

export interface SearchFilterParams {
  cadd: string[];
  am: string[];
  sort?: string;  // Optional
  order?: "asc" | "desc";  // Optional
}

// TODO move to separate component and reuse elsewhere:
export const CADD_CATEGORIES = [
  { label: "Likely Benign (<15.0)", value: "likely_benign" },
  { label: "Potentially Deleterious (15.0-19.9)", value: "potentially_deleterious" },
  { label: "Quite Likely Deleterious (20.0-24.9)", value: "quite_likely_deleterious" },
  { label: "Probably Deleterious (25.0-29.9)", value: "probably_deleterious" },
  { label: "Highly Likely Deleterious (>29.9)", value: "highly_likely_deleterious" },
];

export const ALPHAMISSENSE_CATEGORIES = [
  { label: "Benign", value: "benign" },
  { label: "Ambiguous", value: "ambiguous" },
  { label: "Pathogenic", value: "pathogenic" },
];

const validCaddValues = CADD_CATEGORIES.map(c => c.value);
const validAmValues = ALPHAMISSENSE_CATEGORIES.map(c => c.value);

function normalizeFilterValues(selected: string[], valid: string[]) {
  const validSet = new Set(valid);
  return selected.filter(v => validSet.has(v));
}

// ResultPage: Genomic|Protein view toggle (default: depends on users input-num of gen/prot inputs on page: gen>prot->gen view)

const AdvancedSearch: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<SearchFilterParams>(extractFilters(searchParams));

  const isAnyFilterSpecified = filters.cadd.length > 0 ||
      filters.am.length > 0 ||
      filters.sort !== undefined ||
      filters.order !== undefined;
  const [isExpanded, setIsExpanded] = useState(isAnyFilterSpecified);

  // Update filters when URL changes
  useEffect(() => {
    setFilters(extractFilters(searchParams));
    setIsExpanded(isAnyFilterSpecified);
  }, [searchParams]);

  const handleCheckboxChange = (key: "cadd" | "am", value: string) => {
    setFilters((prev) => {
      const updatedCategories = prev[key].includes(value)
        ? prev[key].filter((v) => v !== value) // Remove if already selected
        : [...prev[key], value]; // Add if not selected

      return { ...prev, [key]: updatedCategories };
    });
  };
  const handleSortChange = (field: "sort" | "order", value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value || undefined, // Remove empty selections
    }));
  };

  const normalizedCadd = normalizeFilterValues(filters.cadd, validCaddValues);
  const normalizedAm = normalizeFilterValues(filters.am, validAmValues);

  const allCaddSelected = normalizedCadd.length === validCaddValues.length;
  const allAmSelected = normalizedAm.length === validAmValues.length;

  // Apply filters and update the URL
  const applyFilters = () => {
    ["page", "annotation", "cadd", "am", "sort", "order"].forEach(key => searchParams.delete(key));

    //filters.cadd.forEach((val) => searchParams.append("cadd", val));
    //filters.am.forEach((val) => searchParams.append("am", val));
    if (!allCaddSelected)  normalizedCadd.forEach((val) => searchParams.append("cadd", val));
    if (!allAmSelected)  normalizedAm.forEach((val) => searchParams.append("am", val));
    if (filters.sort) searchParams.set("sort", filters.sort);
    if (filters.order) searchParams.set("order", filters.order);
    navigate(`${location.pathname}${searchParams.size > 0 ? `?${searchParams.toString()}` : ``}`);
  };

  const isCaddSelected = (value: string) =>
    normalizedCadd.length === 0 || normalizedCadd.includes(value);

  const isAmSelected = (value: string) =>
    normalizedAm.length === 0 || normalizedAm.includes(value);

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
          {/* CADD Score */}
          <div className="filter-row">
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
          </div>

          {/* Apply Filters Button */}
          <div className="filter-actions">
            <button className="apply-button" onClick={applyFilters}>
              Update Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;