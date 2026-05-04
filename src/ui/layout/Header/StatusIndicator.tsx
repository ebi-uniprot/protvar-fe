import React from 'react'
import {Link} from 'react-router-dom'
import {STATUS} from '../../../constants/BrowserPaths'
import {useStatus} from '../../../context/StatusContext'
import {OverallState, overallState, StatusResponse} from '../../../types/StatusResponse'

const STATE_LABEL: Record<OverallState, string> = {
  up:        'All systems operational',
  degraded:  'Some features unavailable',
  down:      'Service unavailable',
  unknown:   'Status unknown',
}

function tooltip(s: StatusResponse): string {
  const parts: string[] = [
    `API ${s.api}`,
    `Database ${s.db}`,
    `Submissions ${s.cache}`,
    `Downloads ${s.queue}`,
    `MCP ${s.mcp}`,
  ]
  for (const [model, state] of Object.entries(s.embeddings)) {
    parts.push(`search:${model} ${state}`)
  }
  return parts.join(' · ')
}

export default function StatusIndicator() {
  const {status} = useStatus()

  // Pre-load: don't render anything; avoids a flash of "unknown" before
  // the first response. Once we have status (real or synthesized after a
  // BE failure) we always have something useful to show.
  if (!status) return null

  const overall: OverallState = overallState(status)
  const title = `${STATE_LABEL[overall]} — ${tooltip(status)}`

  return (
    <Link to={STATUS} className={`navbar-status status-${overall}`} title={title} aria-label={STATE_LABEL[overall]}>
      <span className="navbar-status-dot" />
    </Link>
  )
}
