// filterParams.ts
// The interface property names ARE the URL parameter names.

// Array of all filter parameter keys for URL manipulation
// These match the SearchFilterParams interface properties exactly
export const FILTER_PARAM_KEYS = [
  // Variant Type
  'variant',

  // Functional
  'ptm',
  'mutagen',
  'consMin',
  'consMax',
  'domain',

  // Population
  'disease',
  'freq',

  // Structural
  'expModel',
  'interact',
  'pocket',
  'stability',

  // Consequence
  'cadd',
  'am',
  'popeve',
  'esmMin',
  'esmMax',

  // Sorting
  'sort',
  'order'
] as const;

// Type-safe parameter keys
export type FilterParamKey = typeof FILTER_PARAM_KEYS[number];