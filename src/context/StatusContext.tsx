import React, {createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState} from 'react'
import {getMcpStatus, getServiceStatus} from '../services/ProtVarService'
import {ServiceState, StatusResponse} from '../types/StatusResponse'

interface StatusContextValue {
  status: StatusResponse | null
  error: boolean
  hasBackendData: boolean
  refresh: () => Promise<void>
  /**
   * Start active polling. Pauses when the tab is hidden, resumes on visibility,
   * and hard-stops after {@code maxDurationMs} so a forgotten-open tab doesn't
   * keep hitting the BE forever. Returns a stop fn for the caller.
   */
  startPolling: (intervalMs: number, maxDurationMs: number) => () => void
}

const StatusContext = createContext<StatusContextValue | null>(null)

// When the BE is unreachable, surface what we *can* probe directly so the
// page is still informative. api is the BE itself (so: down). db/cache/queue
// are cluster-internal — we genuinely don't know.
function synthesize(mcp: ServiceState): StatusResponse {
  return {
    api: 'down',
    db: 'unknown',
    queue: 'unknown',
    cache: 'unknown',
    mcp,
    embeddings: {},
    checked: new Date().toISOString(),
  }
}

export function StatusProvider({children}: {children: ReactNode}) {
  const [beStatus, setBeStatus] = useState<StatusResponse | null>(null)
  const [error, setError] = useState<boolean>(false)
  const [mcpDirect, setMcpDirect] = useState<ServiceState | null>(null)
  const inFlight = useRef<Promise<void> | null>(null)

  const refresh = useCallback(async () => {
    if (inFlight.current) return inFlight.current
    const be = getServiceStatus()
      .then(res => { setBeStatus(res.data); setError(false) })
      .catch(() => { setError(true) })
    const mcp = getMcpStatus()
      .then(() => setMcpDirect('up'))
      .catch(() => setMcpDirect('down'))
    inFlight.current = Promise.allSettled([be, mcp]).then(() => {
      inFlight.current = null
    })
    return inFlight.current
  }, [])

  // Initial load — every page benefits from a snapshot (header indicator).
  useEffect(() => {
    refresh()
  }, [refresh])

  const startPolling = useCallback((intervalMs: number, maxDurationMs: number) => {
    const startedAt = Date.now()
    let timer: number | null = null
    let stopped = false

    const expired = () => Date.now() - startedAt > maxDurationMs

    const schedule = () => {
      if (stopped || expired()) return
      timer = window.setTimeout(tick, intervalMs)
    }

    const tick = () => {
      if (stopped || expired()) return
      if (document.visibilityState === 'visible') {
        refresh().finally(schedule)
      } else {
        // Tab hidden: skip the fetch, wait for visibilitychange.
      }
    }

    const onVisibility = () => {
      if (stopped || expired()) return
      if (document.visibilityState === 'visible') {
        // Refresh immediately on return; restart the cadence.
        if (timer) clearTimeout(timer)
        refresh().finally(schedule)
      }
    }

    document.addEventListener('visibilitychange', onVisibility)
    schedule()

    return () => {
      stopped = true
      if (timer) clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [refresh])

  // Best-effort merged view: BE-reported state, with mcp overridden by the
  // direct probe (it answers "can the user reach MCP through the gateway",
  // not just "can the BE see MCP from inside the cluster"). Synthesize a
  // partial response when BE is unreachable so the page still has content.
  const status: StatusResponse | null = beStatus
    ? {...beStatus, mcp: mcpDirect ?? beStatus.mcp}
    : (error ? synthesize(mcpDirect ?? 'unknown') : null)

  return (
    <StatusContext.Provider value={{status, error, hasBackendData: beStatus !== null, refresh, startPolling}}>
      {children}
    </StatusContext.Provider>
  )
}

export function useStatus(): StatusContextValue {
  const ctx = useContext(StatusContext)
  if (!ctx) throw new Error('useStatus must be used inside <StatusProvider>')
  return ctx
}
