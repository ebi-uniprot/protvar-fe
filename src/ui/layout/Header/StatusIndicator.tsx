import React from 'react'
import {Link} from 'react-router-dom'
import {STATUS} from '../../../constants/BrowserPaths'
import {useStatus} from '../../../context/StatusContext'
import {overallState, ServiceState, StatusResponse} from '../../../types/StatusResponse'

const STATE_LABEL: Record<ServiceState, string> = {
  up:      'All systems operational',
  down:    'Service degraded',
  unknown: 'Status unknown',
}

function tooltip(s: StatusResponse): string {
  const parts: string[] = [
    `API ${s.api}`,
    `Database ${s.db}`,
    `Submissions ${s.cache}`,
    `Downloads ${s.queue}`,
    `AI tools ${s.mcp}`,
  ]
  for (const [model, state] of Object.entries(s.embeddings)) {
    parts.push(`search:${model} ${state}`)
  }
  return parts.join(' · ')
}

export default function StatusIndicator() {
  const {status, error} = useStatus()

  // Pre-load: don't render anything; avoids a flash of "unknown" before
  // the first response.
  if (!status && !error) return null

  const overall: ServiceState = error || !status ? 'down' : overallState(status)
  const title = status ? `${STATE_LABEL[overall]} — ${tooltip(status)}` : 'Status: backend unreachable'

  return (
    <Link to={STATUS} className={`navbar-status status-${overall}`} title={title} aria-label={STATE_LABEL[overall]}>
      <span className="navbar-status-dot" />
    </Link>
  )
}
