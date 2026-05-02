import React, {createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState} from 'react'
import {getServiceStatus} from '../services/ProtVarService'
import {StatusResponse} from '../types/StatusResponse'

interface StatusContextValue {
  status: StatusResponse | null
  error: boolean
  refresh: () => Promise<void>
  /**
   * Start active polling. Pauses when the tab is hidden, resumes on visibility,
   * and hard-stops after {@code maxDurationMs} so a forgotten-open tab doesn't
   * keep hitting the BE forever. Returns a stop fn for the caller.
   */
  startPolling: (intervalMs: number, maxDurationMs: number) => () => void
}

const StatusContext = createContext<StatusContextValue | null>(null)

export function StatusProvider({children}: {children: ReactNode}) {
  const [status, setStatus] = useState<StatusResponse | null>(null)
  const [error, setError] = useState<boolean>(false)
  const inFlight = useRef<Promise<void> | null>(null)

  const refresh = useCallback(async () => {
    if (inFlight.current) return inFlight.current
    inFlight.current = getServiceStatus()
      .then(res => { setStatus(res.data); setError(false) })
      .catch(() => { setError(true) })
      .finally(() => { inFlight.current = null })
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

  return (
    <StatusContext.Provider value={{status, error, refresh, startPolling}}>
      {children}
    </StatusContext.Provider>
  )
}

export function useStatus(): StatusContextValue {
  const ctx = useContext(StatusContext)
  if (!ctx) throw new Error('useStatus must be used inside <StatusProvider>')
  return ctx
}
