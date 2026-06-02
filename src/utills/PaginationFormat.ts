// Helpers for paged mapping results.
//
// The BE returns three states for filter-only browse:
//
//   1. Exact total       — totalItems = N (>= 0), totalCap = null
//                          (identifier / variant / uploaded-result paths
//                          always land here; filter-only with a small
//                          result set lands here too)
//   2. Capped total      — totalItems = totalCap + 1, totalCap set
//                          (filter-only with > totalCap matches)
//   3. Unknown total     — totalItems = -1, totalCap may or may not be set
//                          (filter-only where the bounded COUNT exceeded
//                          its query timeout — sparse multi-filter
//                          intersections like pocket+known)
//
// Pagination behaviour:
//   - Exact: full pagination, exact total displayed.
//   - Capped: navigation clamped to floor(totalCap / pageSize); display
//     "{totalCap}+". User refines filters / sort to see beyond.
//   - Unknown: no jump-to-last; only Prev/Next, driven by data.last (the
//     BE sets this from the data fetch row count).

import { PagedMappingResponse } from '../types/PagedMappingResponse';

/**
 * True when the BE could not compute a total (COUNT(*) timed out).
 */
export function isTotalUnknown(data: PagedMappingResponse): boolean {
  return data.totalItems < 0;
}

/**
 * True when the BE returned a capped count and the real total exceeds it.
 */
export function isTotalCapped(data: PagedMappingResponse): boolean {
  return !isTotalUnknown(data) && data.totalCap != null && data.totalItems > data.totalCap;
}

/**
 * Page count adjusted for capping. Use this — not data.totalPages — when
 * driving navigation buttons or the "page X of N" indicator. Returns null
 * when the total is unknown; callers should hide the page count and the
 * jump-to-last button in that case.
 */
export function effectiveTotalPages(data: PagedMappingResponse): number | null {
  if (isTotalUnknown(data)) return null;
  if (!isTotalCapped(data)) return data.totalPages;
  return Math.max(1, Math.ceil(data.totalCap! / data.pageSize));
}

/**
 * Human-readable result count, e.g. "1,234", "10,000+", or "Many results".
 */
export function formatTotalCount(data: PagedMappingResponse): string {
  if (isTotalUnknown(data)) return 'Many results';
  if (isTotalCapped(data)) return `${data.totalCap!.toLocaleString()}+`;
  return data.totalItems.toLocaleString();
}
