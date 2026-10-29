const MAX_FILTERS = 2

interface AutoJobNameInput {
  subject?: string    // what is downloaded: the variant, identifier(s) or upload name; none for a filter-only browse
  filters?: string[]  // active filter labels, as the filter chips show them
  page?: number       // set for a current-page download
}

/**
 * Suggests a human-readable default job name for a download, e.g. "P22304 · PTM",
 * "humsavar · Known variants only, CADD: High +1" or "Predicted Pocket (page 3)".
 * Used as the placeholder in the Downloads form; the user can override it.
 *
 * Collisions don't matter — this is only the display label, not the file ID.
 */
export function autoJobName({ subject, filters = [], page }: AutoJobNameInput): string {
  const shown = filters.slice(0, MAX_FILTERS).join(', ')
    + (filters.length > MAX_FILTERS ? ` +${filters.length - MAX_FILTERS}` : '')
  // a filter-only browse with only the default filter (known variants) has no chips
  const name = subject && shown ? `${subject} · ${shown}` : subject || shown || 'Known variants'
  return page ? `${name} (page ${page})` : name
}
