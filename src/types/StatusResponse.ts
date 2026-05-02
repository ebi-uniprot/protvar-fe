export type ServiceState = 'up' | 'down' | 'unknown'

export interface StatusResponse {
  api: ServiceState
  db: ServiceState
  queue: ServiceState
  cache: ServiceState
  mcp: ServiceState
  embeddings: Record<string, ServiceState>
  checked: string         // ISO instant
}

/** Roll-up for the header dot. 'up' iff every component is up. */
export function overallState(s: StatusResponse): ServiceState {
  const everything: ServiceState[] = [s.api, s.db, s.queue, s.cache, s.mcp, ...Object.values(s.embeddings)]
  if (everything.some(v => v === 'down')) return 'down'
  if (everything.some(v => v === 'unknown')) return 'unknown'
  return 'up'
}
