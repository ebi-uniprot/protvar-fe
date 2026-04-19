import React, { createContext, ReactNode, useContext } from 'react'
import {
  STORE_DOWNLOADS, STORE_HISTORY, STORE_PREFS, STORE_SCHEMA, STORE_USER,
} from '../constants/storage'
import { DEFAULT_PREFS, UserPrefs } from '../types/UserPrefs'
import { DEFAULT_USER_STATE, UserState } from '../types/UserState'
import { ResultRecord } from '../types/ResultRecord'
import { DownloadRecord, DownloadStatus, DownloadStatusEntry } from '../types/DownloadRecord'

// ── Schema migration ───────────────────────────────────────────────────────────
//
// v1 is the baseline — no migration needed.
// To add a future migration:
//   1. Increment CURRENT_VERSION
//   2. Add an entry to migrations: { [newVersion]: () => { /* transform localStorage data */ } }
//
const CURRENT_VERSION = 1
type Migration = () => void
const migrations: Partial<Record<number, Migration>> = {}

function runMigrations(): void {
  const raw = localStorage.getItem(STORE_SCHEMA)
  const from: number = raw ? (JSON.parse(raw) as { version: number }).version : 0
  for (let v = from + 1; v <= CURRENT_VERSION; v++) {
    migrations[v]?.()
  }
  localStorage.setItem(STORE_SCHEMA, JSON.stringify({ version: CURRENT_VERSION }))
}

// Run once at module load, before any component mounts
runMigrations()

// ── Low-level helpers ──────────────────────────────────────────────────────────

export const STORAGE_CHANGE = 'PV_STORAGE_CHANGE'

function read<T>(key: string): T | null {
  const raw = localStorage.getItem(key)
  return raw ? (JSON.parse(raw) as T) : null
}

function write<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
  window.dispatchEvent(new CustomEvent(STORAGE_CHANGE, { detail: key }))
}

// ── Prune expired history records on read ─────────────────────────────────────

function pruneExpired(records: ResultRecord[]): ResultRecord[] {
  const now = Date.now()
  return records.filter(r => !r.expiresAt || new Date(r.expiresAt).getTime() > now)
}

// ── Context interface ──────────────────────────────────────────────────────────

interface StorageContextValue {
  // history
  getHistory(): ResultRecord[]
  saveResult(record: ResultRecord): void
  touchResult(id: string, url: string): void
  updateResult(id: string, patch: Partial<ResultRecord>): void
  deleteResult(id: string): void
  clearHistory(): void

  // downloads
  getDownloads(): DownloadRecord[]
  addDownload(record: DownloadRecord): void
  updateDownload(id: string, patch: Partial<DownloadRecord>): void
  refreshDownloadStatuses(statusMap: Record<string, DownloadStatusEntry>): void
  deleteDownload(id: string): void
  clearDownloads(): void

  // prefs
  getPrefs(): UserPrefs
  setPrefs(patch: Partial<UserPrefs>): void

  // user state
  getUserState(): UserState
  setUserState(patch: Partial<UserState>): void
}

const StorageContext = createContext<StorageContextValue | undefined>(undefined)

// ── Provider ───────────────────────────────────────────────────────────────────

export const StorageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  // — history —

  const getHistory = (): ResultRecord[] =>
    pruneExpired(read<ResultRecord[]>(STORE_HISTORY) ?? [])

  const saveResult = (record: ResultRecord): void => {
    const records = getHistory()
    const idx = records.findIndex(r => r.id === record.id)
    if (idx !== -1) {
      // Update in-place, keep savedAt, move to front
      const updated = { ...records[idx], ...record, savedAt: records[idx].savedAt }
      records.splice(idx, 1)
      records.unshift(updated)
    } else {
      records.unshift(record)
    }
    write(STORE_HISTORY, records)
  }

  // Only updates existing records — browse results that haven't been saved are ignored
  const touchResult = (id: string, url: string): void => {
    const records = getHistory()
    const idx = records.findIndex(r => r.id === id)
    if (idx === -1) return
    const updated = { ...records[idx], url, lastViewed: new Date().toISOString() }
    records.splice(idx, 1)
    records.unshift(updated)
    write(STORE_HISTORY, records)
  }

  const updateResult = (id: string, patch: Partial<ResultRecord>): void => {
    const records = getHistory()
    const idx = records.findIndex(r => r.id === id)
    if (idx === -1) return
    records[idx] = { ...records[idx], ...patch }
    write(STORE_HISTORY, records)
  }

  const deleteResult = (id: string): void =>
    write(STORE_HISTORY, getHistory().filter(r => r.id !== id))

  const clearHistory = (): void => write(STORE_HISTORY, [])

  // — downloads —

  const getDownloads = (): DownloadRecord[] =>
    read<DownloadRecord[]>(STORE_DOWNLOADS) ?? []

  const addDownload = (record: DownloadRecord): void => {
    const downloads = getDownloads()
    downloads.unshift(record)
    write(STORE_DOWNLOADS, downloads)
  }

  const updateDownload = (id: string, patch: Partial<DownloadRecord>): void => {
    const downloads = getDownloads()
    const idx = downloads.findIndex(d => d.id === id)
    if (idx === -1) return
    downloads[idx] = { ...downloads[idx], ...patch }
    write(STORE_DOWNLOADS, downloads)
  }

  // Batch-update statuses from the /download/status API response
  const refreshDownloadStatuses = (
    statusMap: Record<string, DownloadStatusEntry>
  ): void => {
    const downloads = getDownloads()
    const updated = downloads.map(d => {
      const s = statusMap[d.id]
      if (!s) return d
      return { ...d, status: s.status as DownloadStatus, size: s.size }
    })
    write(STORE_DOWNLOADS, updated)
  }

  const deleteDownload = (id: string): void =>
    write(STORE_DOWNLOADS, getDownloads().filter(d => d.id !== id))

  const clearDownloads = (): void => write(STORE_DOWNLOADS, [])

  // — prefs —

  const getPrefs = (): UserPrefs => ({
    ...DEFAULT_PREFS,
    ...(read<Partial<UserPrefs>>(STORE_PREFS) ?? {}),
  })

  const setPrefs = (patch: Partial<UserPrefs>): void =>
    write(STORE_PREFS, { ...getPrefs(), ...patch })

  // — user state —

  const getUserState = (): UserState => ({
    ...DEFAULT_USER_STATE,
    ...(read<Partial<UserState>>(STORE_USER) ?? {}),
  })

  const setUserState = (patch: Partial<UserState>): void =>
    write(STORE_USER, { ...getUserState(), ...patch })

  return (
    <StorageContext.Provider value={{
      getHistory, saveResult, touchResult, updateResult, deleteResult, clearHistory,
      getDownloads, addDownload, updateDownload, refreshDownloadStatuses, deleteDownload, clearDownloads,
      getPrefs, setPrefs,
      getUserState, setUserState,
    }}>
      {children}
    </StorageContext.Provider>
  )
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export const useStorage = (): StorageContextValue => {
  const ctx = useContext(StorageContext)
  if (!ctx) throw new Error('useStorage must be used within a StorageProvider')
  return ctx
}
