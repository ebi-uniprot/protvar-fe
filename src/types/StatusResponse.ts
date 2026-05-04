export type ServiceState = 'up' | 'down' | 'unknown'
export type OverallState = ServiceState | 'degraded'

export interface StatusResponse {
  api: ServiceState
  db: ServiceState
  queue: ServiceState
  cache: ServiceState
  mcp: ServiceState
  embeddings: Record<string, ServiceState>
  checked: string         // ISO instant
}

// Rollup for the header dot. The site is unusable only when api/db/cache
// are down (api needs both for any useful work). queue/mcp/embeddings
// failing means a feature is offline (downloads, AI tools, semantic search)
// but the site as a whole still works — surface that as 'degraded'.
export function overallState(s: StatusResponse): OverallState {
  const critical: ServiceState[] = [s.api, s.db, s.cache]
  if (critical.some(v => v === 'down')) return 'down'

  const nonCritical: ServiceState[] = [s.queue, s.mcp, ...Object.values(s.embeddings)]
  if (nonCritical.some(v => v === 'down')) return 'degraded'

  if ([...critical, ...nonCritical].some(v => v === 'unknown')) return 'unknown'
  return 'up'
}
