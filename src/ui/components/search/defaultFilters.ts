// defaultFilters.ts
// Shared default filter values across SearchPage and ResultPage

import { SearchFilterParams } from './SearchFilters';
/*
{!hasSearchTerms && filters.variant === 'known' && (
  <Alert type="warning">
    Database-wide searches with 'Known variants only' may take 10-30 seconds.
  For faster results, provide a gene or protein name.
</Alert>
)}

// In your filter component
const getRecommendedVariantFilter = (hasSearchTerms: boolean) => {
  if (hasSearchTerms) {
    // Has gene/protein - 'known' is fine as default
    return 'known';
  } else {
    // No search terms - suggest 'all' for better performance
    return 'all';
  }
};

// Show hint to user
{!hasSearchTerms && filters.variant === 'known' && (
  <Tooltip>
    💡 Tip: Searching without a gene/protein takes longer.
  Consider searching for 'All variants' or adding a gene name.
</Tooltip>
)}

// When user removes search terms, show suggestion
useEffect(() => {
  if (!hasSearchTerms && filters.variant === 'known') {
    showNotification({
      type: 'info',
      message: 'Database-wide search enabled. Consider adding a gene name for faster results.',
      action: {
        label: 'Search all variants instead',
        onClick: () => setFilters({...filters, variant: 'all'})
      }
    });
  }
}, [hasSearchTerms, filters.variant]);
*/
// Base default filters (used by both search and result pages)
export const DEFAULT_FILTERS: Readonly<SearchFilterParams> = Object.freeze({
  // Variant Type
  variant: 'known',  // Default to known variants

  // Functional
  ptm: undefined,
  mutagen: undefined,
  consMin: undefined,
  consMax: undefined,
  domain: undefined,

  // Population
  disease: undefined,
  freq: [],

  // Structural
  expModel: undefined,
  interact: undefined,
  pocket: undefined,
  stability: [],

  // Consequence
  cadd: [],
  am: [],
  popeve: [],
  esmMin: undefined,
  esmMax: undefined,

  // Sorting
  sort: undefined,
  order: undefined,
});

// For SearchPage (no sorting needed, but included for consistency)
export const DEFAULT_SEARCH_FILTERS: Readonly<SearchFilterParams> = DEFAULT_FILTERS;

// For ResultPage (includes sorting)
export const DEFAULT_RESULT_FILTERS: Readonly<SearchFilterParams> = DEFAULT_FILTERS;
