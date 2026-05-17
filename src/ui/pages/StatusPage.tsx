import React, {useEffect} from 'react'
import DefaultPageLayout from '../layout/DefaultPageLayout'
import {TITLE} from '../../constants/const'
import {useStatus} from '../../context/StatusContext'
import {OverallState, ServiceState} from '../../types/StatusResponse'
import {getRelativeTime, parseDateString} from '../../utills/DateUtil'

const POLL_INTERVAL_MS = 30_000
const MAX_POLL_DURATION_MS = 15 * 60 * 1000   // give up after 15 min of an idle/forgotten tab

const STATE_INFO: Record<OverallState, { label: string; cls: string; icon: string }> = {
  up:       { label: 'Operational', cls: 'status-up',       icon: 'bi bi-check-circle-fill' },
  degraded: { label: 'Degraded',    cls: 'status-degraded', icon: 'bi bi-exclamation-circle-fill' },
  down:     { label: 'Down',        cls: 'status-down',      icon: 'bi bi-x-circle-fill' },
  unknown:  { label: 'Unknown',     cls: 'status-unknown',   icon: 'bi bi-question-circle-fill' },
}

function StateIndicator({state}: {state: OverallState}) {
  const info = STATE_INFO[state] ?? STATE_INFO.unknown
  return (
    <span className={`status-pill ${info.cls}`}>
      <i className={info.icon} /> {info.label}
    </span>
  )
}

function ServiceCard({name, state, hint}: {name: string; state: ServiceState; hint?: string}) {
  return (
    <div className="status-card">
      <div className="status-card-name">{name}</div>
      <StateIndicator state={state} />
      {hint && <div className="status-card-hint">{hint}</div>}
    </div>
  )
}

function modelsOverall(states: ServiceState[]): OverallState {
  if (states.length === 0) return 'unknown'
  if (states.every(s => s === 'up')) return 'up'
  if (states.every(s => s === 'down')) return 'down'
  return 'degraded'   // some — but not all — models down/unknown
}

// Display order for the semantic-search models — matches the model-guidance
// table in public/markdown/semantic-search.md. Unlisted models sort last.
const MODEL_ORDER = ['biobert', 'bge', 'biolord', 'mpnet', 'minilm']

// One card for all semantic-search models: an overall state pill plus the
// model list, each model individually marked (down/unknown stand out). Single
// card rather than one-per-model — same shape as the MCP server card.
function SemanticSearchCard({embeddings}: {embeddings: [string, ServiceState][]}) {
  const rank = (id: string) => {
    const i = MODEL_ORDER.indexOf(id)
    return i === -1 ? MODEL_ORDER.length : i
  }
  const ordered = [...embeddings].sort(([a], [b]) => rank(a) - rank(b))
  const overall = modelsOverall(ordered.map(([, state]) => state))
  return (
    <div className="status-card">
      <div className="status-card-name">Semantic search</div>
      <StateIndicator state={overall} />
      <div className="status-card-hint status-card-models">
        {ordered.map(([model, state], i) => (
          <React.Fragment key={model}>
            {i > 0 && <span className="model-sep"> · </span>}
            <span className={`model-state model-${state}`} title={`${model}: ${STATE_INFO[state].label}`}>
              {model}
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

function StatusPageContent() {
  const {status, error, hasBackendData, startPolling} = useStatus()

  useEffect(() => {
    document.title = `Status | ${TITLE}`
  }, [])

  // Active polling while this page is open. Pauses on hidden tabs; gives up
  // after MAX_POLL_DURATION_MS so a forgotten tab stops hammering the BE.
  useEffect(() => startPolling(POLL_INTERVAL_MS, MAX_POLL_DURATION_MS), [startPolling])

  if (!status) {
    return (
      <div className="container">
        <h5 className="page-header">Status</h5>
        <p>Loading…</p>
      </div>
    )
  }

  const embeddings = Object.entries(status.embeddings)

  return (
    <div className="container">
      <h5 className="page-header">Status</h5>
      <p className="status-meta">
        Last checked {getRelativeTime(parseDateString(status.checked))}. Refreshes every 30s while this tab is open;
        pauses in background tabs.
      </p>

      {error && hasBackendData && (
        <div className="status-error status-error--inline">
          <i className="bi bi-exclamation-triangle-fill" /> Last refresh failed. Showing the previous successful check.
        </div>
      )}
      {error && !hasBackendData && (
        <div className="status-error status-error--inline">
          <i className="bi bi-exclamation-triangle-fill" /> Backend unreachable. Database, submissions and downloads
          run inside the cluster and can only be checked through the API — their state is unknown until the API is back.
        </div>
      )}

      <h6 className="status-section-header">Core services</h6>
      <div className="status-grid">
        <ServiceCard name="ProtVar API"         state={status.api} />
        <ServiceCard name="Database"            state={status.db} />
        <ServiceCard name="Submissions & cache" state={status.cache} hint="Redis" />
        <ServiceCard name="Download processing" state={status.queue} hint="RabbitMQ" />
      </div>

      <h6 className="status-section-header">AI tools</h6>
      <div className="status-grid">
        <ServiceCard name="MCP server" state={status.mcp} hint="protvar-mcp" />
        <SemanticSearchCard embeddings={embeddings} />
      </div>
    </div>
  )
}

function StatusPage() {
  return <DefaultPageLayout content={<StatusPageContent />} />
}

export default StatusPage
