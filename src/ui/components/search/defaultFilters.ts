// defaultFilters.ts
// Shared default filter values across SearchPage and ResultPage

import { SearchFilterParams } from './SearchFilters';

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
