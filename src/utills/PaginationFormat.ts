// Helpers for displaying paged mapping results when the BE caps the total.
//
// On the filter-only browse path the BE caps COUNT(*) to bound query cost
// and returns the cap value via PagedMappingResponse.totalCap. When the
// real result set exceeds the cap, totalItems comes back as totalCap+1 —
// so the FE can detect the capped state and display it as e.g. "10,000+".
//
// Pagination is clamped at floor(totalCap / pageSize) when capped: the
// underlying SQL data fetch is fast within that range and there's no
// reliable way to enumerate beyond. Users wanting more should refine
// their filters or change sort.

import { PagedMappingResponse } from '../types/PagedMappingResponse';

/**
 * True when the BE returned a capped count and the real total exceeds it.
 */
export function isTotalCapped(data: PagedMappingResponse): boolean {
  return data.totalCap != null && data.totalItems > data.totalCap;
}

/**
 * Page count adjusted for capping. Use this — not data.totalPages — when
 * driving navigation buttons or the "page X of N" indicator.
 */
export function effectiveTotalPages(data: PagedMappingResponse): number {
  if (!isTotalCapped(data)) return data.totalPages;
  return Math.max(1, Math.ceil(data.totalCap! / data.pageSize));
}

/**
 * Human-readable result count, e.g. "1,234" or "10,000+".
 */
export function formatTotalCount(data: PagedMappingResponse): string {
  if (isTotalCapped(data)) return `${data.totalCap!.toLocaleString()}+`;
  return data.totalItems.toLocaleString();
}
