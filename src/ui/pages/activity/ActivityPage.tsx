import React, {useEffect, useState} from 'react'
import DefaultPageLayout from '../../layout/DefaultPageLayout'
import {useSearchParams, useNavigate, NavLink} from 'react-router-dom'
import {useStorage, STORAGE_CHANGE} from '../../../context/StorageContext'
import {ResultRecord, lastActivity} from '../../../types/ResultRecord'
import {DownloadRecord, DOWNLOAD_STATUS_INFO, DownloadStatus} from '../../../types/DownloadRecord'
import {downloadStatus} from '../../../services/ProtVarService'
import {getRelativeTime, parseDateString} from '../../../utills/DateUtil'
import {humanFileSize} from '../../../utills/Util'
import {APP_URL} from '../../App'
import {PV_FTP, TITLE} from '../../../constants/const'
import {ShareLink} from '../../components/common/ShareLink'
import {HelpButton} from '../../components/help/HelpButton'
import {ActivityHelp} from '../../components/help/content/ActivityHelp'
import Spaces from '../../elements/Spaces'
import {STORE_DOWNLOADS, STORE_HISTORY} from '../../../constants/storage'

type Tab = 'history' | 'downloads'

// ── History tab ────────────────────────────────────────────────────────────────

function HistoryTab() {
  const { getHistory, updateResult, deleteResult, clearHistory } = useStorage()
  const [records, setRecords] = useState<ResultRecord[]>(() => getHistory())
  const [editingId, setEditingId] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      if (e.detail === STORE_HISTORY) setRecords(getHistory())
    }
    window.addEventListener(STORAGE_CHANGE, handler as EventListener)
    return () => window.removeEventListener(STORAGE_CHANGE, handler as EventListener)
  }, [getHistory])

  const handleNameChange = (id: string, name: string) => {
    updateResult(id, { name })
    setRecords(prev => prev.map(r => r.id === id ? { ...r, name } : r))
  }

  const handleDelete = (id: string) => {
    deleteResult(id)
  }

  const handleDeleteAll = () => {
    if (window.confirm('Are you sure you want to delete all history?')) clearHistory()
  }

  if (records.length === 0) return <p>No history yet.</p>

  return (
    <>
      <div className="activity-list-header">
        <span>{records.length} entr{records.length === 1 ? 'y' : 'ies'}</span>
        {records.length > 1 && (
          <button className="bi bi-trash icon-btn icon-btn-danger" onClick={handleDeleteAll}> Delete all</button>
        )}
      </div>
      <div className="table-scroll">
        <table className="activity-table activity-table--history">
          <thead>
            <tr>
              <th>Last activity</th>
              <th className="col-center">Type</th>
              <th>Name / ID</th>
              <th className="col-center">Manage</th>
            </tr>
          </thead>
          <tbody>
            {records.map(record => (
              <tr key={record.id}>
                <td>{getRelativeTime(parseDateString(lastActivity(record)))}</td>
                <td className="col-center">
                  <span className={`activity-type-badge activity-type-${record.type}`}>
                    {record.type === 'submission' ? 'Submitted' : 'Browse'}
                  </span>
                </td>
                <td>
                  {editingId === record.id ? (
                    <input
                      className="edit-name"
                      type="text"
                      value={record.name ?? ''}
                      autoFocus
                      onChange={e => handleNameChange(record.id, e.target.value)}
                      onBlur={() => setEditingId(null)}
                    />
                  ) : (
                    <span className="activity-name-cell">
                      <NavLink to={record.url} className="activity-result-link">
                        {record.name ?? record.id}
                      </NavLink>
                      <i className="bi bi-pencil icon-btn" onClick={() => setEditingId(record.id)} />
                    </span>
                  )}
                </td>
                <td className="col-center">
                  <ShareLink url={`${APP_URL}${record.url}`} />
                  <Spaces count={2} />
                  <button className="bi bi-trash icon-btn icon-btn-danger" title="Delete" onClick={() => handleDelete(record.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

// ── Downloads tab ──────────────────────────────────────────────────────────────

function downloadFile(url: string) {
  window.open(url, '_blank')
}

function DownloadsTab() {
  const { getDownloads, updateDownload, deleteDownload, clearDownloads, refreshDownloadStatuses } = useStorage()
  const [downloads, setDownloads] = useState<DownloadRecord[]>(() => getDownloads())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      if (e.detail === STORE_DOWNLOADS) setDownloads(getDownloads())
    }
    window.addEventListener(STORAGE_CHANGE, handler as EventListener)
    return () => window.removeEventListener(STORAGE_CHANGE, handler as EventListener)
  }, [getDownloads])

  // Refresh statuses from API on mount
  useEffect(() => {
    const local = getDownloads()
    if (local.length === 0) return
    const ids = local.map(d => d.id)
    downloadStatus(ids)
      .then(res => refreshDownloadStatuses(res.data))
      .catch(() => setError('Failed to refresh download statuses'))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleNameChange = (id: string, jobName: string) => {
    updateDownload(id, { jobName })
    setDownloads(prev => prev.map(d => d.id === id ? { ...d, jobName } : d))
  }

  const handleDelete = (id: string) => deleteDownload(id)

  const handleDeleteAll = () => {
    if (window.confirm('Are you sure you want to delete all downloads?')) clearDownloads()
  }

  return (
    <>
      <div className="activity-ftp-note">
        <p>
          Bulk pre-computed datasets are available from the{' '}
          <a href={PV_FTP} title="ProtVar FTP site" target="_blank" rel="noreferrer" className="ref-link">
            FTP site
          </a>.
        </p>
      </div>

      {error && <p className="activity-error">{error}</p>}

      {downloads.length === 0 ? (
        <p>No downloads yet. Use the <i className="bi bi-download" /> Download button on any result page.</p>
      ) : (
        <>
          <div className="activity-list-header">
            <span>{downloads.length} download{downloads.length !== 1 ? 's' : ''}</span>
            {downloads.length > 1 && (
              <button className="bi bi-trash icon-btn icon-btn-danger" onClick={handleDeleteAll}> Delete all</button>
            )}
          </div>
          <div className="table-scroll">
            <table className="activity-table activity-table--downloads">
              <thead>
                <tr>
                  <th>Requested</th>
                  <th>Job name</th>
                  <th className="col-center">Input</th>
                  <th>Options</th>
                  <th className="col-center">Annotations</th>
                  <th>Status</th>
                  <th className="col-center">Manage</th>
                </tr>
              </thead>
              <tbody>
                {downloads.map(dl => {
                  const statusInfo = DOWNLOAD_STATUS_INFO[dl.status]
                  return (
                    <tr key={dl.id}>
                      <td>{getRelativeTime(parseDateString(dl.requestedAt))}</td>
                      <td>
                        {editingId === dl.id ? (
                          <input
                            className="edit-name"
                            type="text"
                            value={dl.jobName}
                            autoFocus
                            onChange={e => handleNameChange(dl.id, e.target.value)}
                            onBlur={() => setEditingId(null)}
                          />
                        ) : (
                          <span className="activity-name-cell" onClick={() => setEditingId(dl.id)}>
                            {dl.jobName || <i>Unnamed</i>}
                            <i className="bi bi-pencil icon-btn" />
                          </span>
                        )}
                      </td>
                      <td className="col-center">
                        <span
                          className={dl.resultUrl ? 'activity-result-link' : undefined}
                          style={{ cursor: dl.resultUrl ? 'pointer' : undefined }}
                          title={dl.resultUrl ? 'View result' : undefined}
                          onClick={() => dl.resultUrl && navigate(dl.resultUrl)}
                        >
                          {dl.id.substring(0, 8)}
                        </span>
                      </td>
                      <td>
                        {dl.page && <> p{dl.page}{dl.pageSize && ` (${dl.pageSize})`}</>}
                        {dl.assembly && (dl.assembly.toLowerCase() !== 'auto') && ` ${dl.assembly}`}
                      </td>
                      <td className="col-center">
                        {dl.fun ? <i className="bi bi-check green" /> : <i className="bi bi-x red" />} fun
                        {dl.pop ? <i className="bi bi-check green" /> : <i className="bi bi-x red" />} pop
                        {dl.str ? <i className="bi bi-check green" /> : <i className="bi bi-x red" />} str
                      </td>
                      <td>
                        <span className={statusInfo.icon} /> {statusInfo.text}
                        {dl.size && dl.size > 0 ? ` (${humanFileSize(dl.size)})` : ''}
                      </td>
                      <td className="col-center">
                        <button
                          className="bi bi-download icon-btn"
                          title="Download file"
                          disabled={dl.status !== 'ready'}
                          onClick={() => downloadFile(dl.fileUrl)}
                        />
                        <Spaces count={2} />
                        <ShareLink url={dl.fileUrl} disabled={dl.status !== 'ready'} />
                        <Spaces count={2} />
                        <button
                          className="bi bi-trash icon-btn icon-btn-danger"
                          title="Delete"
                          onClick={() => handleDelete(dl.id)}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  )
}

// ── Combined view ──────────────────────────────────────────────────────────────

function GroupedView() {
  const { getHistory, getDownloads } = useStorage()
  const [records, setRecords] = useState<ResultRecord[]>(() => getHistory())
  const [downloads, setDownloads] = useState<DownloadRecord[]>(() => getDownloads())
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      if (e.detail === STORE_HISTORY) setRecords(getHistory())
      if (e.detail === STORE_DOWNLOADS) setDownloads(getDownloads())
    }
    window.addEventListener(STORAGE_CHANGE, handler as EventListener)
    return () => window.removeEventListener(STORAGE_CHANGE, handler as EventListener)
  }, [getHistory, getDownloads])

  if (records.length === 0 && downloads.length === 0) return <p>No activity yet.</p>

  // Orphaned downloads — those with no matching history record
  const orphanedDownloads = downloads.filter(d => !d.resultId || !records.some(r => r.id === d.resultId))

  return (
    <div className="grouped-view">
      {records.map(record => {
        const related = downloads.filter(d => d.resultId === record.id)
        return (
          <div key={record.id} className="grouped-item">
            <div className="grouped-item-header">
              <span className={`activity-type-badge activity-type-${record.type}`}>
                {record.type === 'submission' ? 'Submitted' : 'Browse'}
              </span>
              <span
                className="activity-result-link grouped-item-title"
                onClick={() => navigate(record.url)}
              >
                {record.name ?? record.id}
              </span>
              <span className="grouped-item-date">
                {getRelativeTime(parseDateString(lastActivity(record)))}
              </span>
            </div>
            {related.length > 0 && (
              <ul className="grouped-downloads">
                {related.map(dl => {
                  const info = DOWNLOAD_STATUS_INFO[dl.status]
                  return (
                    <li key={dl.id} className="grouped-download-item">
                      <span className={info.icon} />
                      <span className="grouped-download-name">{dl.jobName || dl.id.substring(0, 8)}</span>
                      <span className="grouped-download-meta">
                        {[dl.fun && 'fun', dl.pop && 'pop', dl.str && 'str'].filter(Boolean).join('+')}
                        {dl.size && dl.size > 0 ? ` · ${humanFileSize(dl.size)}` : ''}
                      </span>
                      {dl.status === 'ready' && (
                        <button
                          className="bi bi-download icon-btn"
                          title="Download"
                          onClick={() => downloadFile(dl.fileUrl)}
                        />
                      )}
                      <span className="grouped-download-date">
                        {getRelativeTime(parseDateString(dl.requestedAt))}
                      </span>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )
      })}

      {orphanedDownloads.length > 0 && (
        <div className="grouped-orphans">
          <h6>Other downloads</h6>
          {orphanedDownloads.map(dl => {
            const info = DOWNLOAD_STATUS_INFO[dl.status]
            return (
              <div key={dl.id} className="grouped-item">
                <div className="grouped-item-header">
                  <span className={info.icon} />
                  <span className="grouped-download-name">{dl.jobName || dl.id.substring(0, 8)}</span>
                  <span className="grouped-item-date">
                    {getRelativeTime(parseDateString(dl.requestedAt))}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

function ActivityPageContent() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const activeTab: Tab = tabParam === 'downloads' ? 'downloads' : 'history'
  const [view, setView] = useState<'flat' | 'grouped'>('flat')

  useEffect(() => {
    document.title = `Activity | ${TITLE}`
  }, [])

  const setTab = (tab: Tab) => {
    const next = new URLSearchParams(searchParams)
    if (tab === 'history') next.delete('tab')
    else next.set('tab', tab)
    setSearchParams(next, { replace: true })
  }

  return (
    <div className="container">
      <div className="page-header-row">
        <h5 className="page-header">Activity</h5>
        <HelpButton title="" content={<ActivityHelp />} />
      </div>

      <div className="activity-tabs">
        <button
          className={`activity-tab${activeTab === 'history' ? ' active' : ''}`}
          onClick={() => setTab('history')}
        >
          <i className="bi bi-clock-history" /> History
        </button>
        <button
          className={`activity-tab${activeTab === 'downloads' ? ' active' : ''}`}
          onClick={() => setTab('downloads')}
        >
          <i className="bi bi-download" /> Downloads
        </button>
        {activeTab === 'history' && (
          <div className="view-toggle" title="Switch view">
            <button
              className={view === 'flat' ? 'active' : ''}
              onClick={() => setView('flat')}
            >
              <i className="bi bi-list-ul" /> List
            </button>
            <button
              className={view === 'grouped' ? 'active' : ''}
              onClick={() => setView('grouped')}
            >
              <i className="bi bi-diagram-3" /> Grouped
            </button>
          </div>
        )}
      </div>

      <div className="activity-panel">
        {activeTab === 'history' && view === 'flat' && <HistoryTab />}
        {activeTab === 'history' && view === 'grouped' && <GroupedView />}
        {activeTab === 'downloads' && <DownloadsTab />}
      </div>
    </div>
  )
}

function ActivityPage() {
  return <DefaultPageLayout content={<ActivityPageContent />} />
}

export default ActivityPage
