import { Identifier } from '../types/InputType'

interface AutoJobNameInput {
  q?: string
  ids?: Identifier[]
  searchParams?: URLSearchParams
  upload?: boolean   // an upload shows all submitted variants unless variant=known; browse defaults to known
}

/**
 * Suggests a human-readable default job name for a download. Used as the
 * placeholder in the Downloads form when no saved history name is available.
 * The user can override with anything more meaningful.
 *
 * Collisions don't matter — this is only the display label, not the file ID.
 */
export function autoJobName({ q, ids, searchParams, upload }: AutoJobNameInput): string {
  if (q && q.trim()) {
    return q.trim().split(/\s+/).join('-')
  }

  if (ids && ids.length > 0) {
    const values = ids.map(id => id.value)
    if (values.length === 1) return values[0]
    if (values.length === 2) return values.join(', ')
    return `${values[0]}, ${values[1]} +${values.length - 2} more`
  }

  if (searchParams) {
    if (searchParams.get('pocket') === 'true') return 'Pocket browse'
    if (searchParams.get('interact') === 'true') return 'Interaction browse'
    if (searchParams.get('expModel') === 'true') return 'Experimental model browse'
    if (upload ? searchParams.get('variant') === 'known' : searchParams.get('variant') !== 'potential') return 'Known variants'
    return 'Filtered browse'
  }

  return ''
}
