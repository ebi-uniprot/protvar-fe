// filterParams.ts
// The SearchFilterParams property names ARE the URL parameter names.
import { SearchFilterParams } from './SearchFilters';

// One entry per SearchFilterParams key: a filter added to the interface but not here is a type error, so the
// URL clean-up (ResultPage deletes these keys before writing the new filters) can't miss one.
const KEYS: Record<keyof SearchFilterParams, true> = {
  // Variant Type
  variant: true, knownIn: true, curated: true,
  // Functional
  ptm: true, mutagen: true, domain: true, binding: true, actsite: true, consMin: true, consMax: true,
  // Population
  disease: true, freq: true,
  // Structural
  transmem: true, expModel: true, interact: true, pocket: true, stability: true,
  // Consequence
  cadd: true, aviMin: true, am: true, popeve: true, esmMin: true, esmMax: true,
  // Sorting
  sort: true, order: true,
  // Notes (uploaded result only)
  notes: true, codes: true,
};

// Every filter parameter key, for URL manipulation
export const FILTER_PARAM_KEYS = Object.keys(KEYS) as (keyof SearchFilterParams)[];

export type FilterParamKey = keyof SearchFilterParams;
