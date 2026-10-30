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
  'domain',
  'binding',
  'actsite',
  'transmem',
  'consMin',
  'consMax',

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
  'aviMin',
  'am',
  'popeve',
  'esmMin',
  'esmMax',

  // Sorting
  'sort',
  'order',

  // Notes (uploaded result only)
  'notes',
  'codes'
] as const;

// Type-safe parameter keys
export type FilterParamKey = typeof FILTER_PARAM_KEYS[number];