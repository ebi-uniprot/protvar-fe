// Primary-filter rule, mirroring the BE MappingRequestValidator.
//
// The BE accepts a /mapping request only when it has at least one "driver"
// — a field that bounds the leading table of the resulting query to a
// manageable size. Without one, the dispatcher would attempt a full scan
// of the ~169M-row mapping table and time out.
//
// Drivers (any one is sufficient):
//   - q              (variant query)
//   - resultId       (cached upload)
//   - ids[] non-empty (identifier-anchored)
//   - pocket = true
//   - interact = true
//   - experimentalModel = true
//   - known = true
//
// On the FE, `known` corresponds to `variant === 'known'`, which is set
// by default in the filter state. We therefore exclude it from the
// "primary filter" check below — otherwise a fresh form with no user
// interaction would already qualify, defeating the point of asking the
// user to choose. Pocket / Interact / Experimental Model must be picked
// explicitly by the user.

import { SearchFilterParams } from '../ui/components/search/SearchFilters';

/**
 * Whether the user has explicitly selected a structural primary filter.
 * Use this to gate filter-only browse submission when no identifier is given.
 */
export function hasPrimaryFilter(filters: SearchFilterParams): boolean {
  return filters.pocket === true
      || filters.interact === true
      || filters.expModel === true;
}

/**
 * User-facing prompt when neither an identifier nor a primary filter is set.
 * Matches the wording style of the BE 400 response message.
 */
export const PRIMARY_FILTER_PROMPT =
  'Please enter at least one identifier, or select a primary filter ' +
  '(Pocket, Interaction, or Experimental Model) to begin browsing.';
