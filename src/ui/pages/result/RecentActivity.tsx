import React, {useEffect, useState} from "react";
import {ACTIVITY, HOME} from "../../../constants/BrowserPaths";
import {NavLink, useNavigate, useParams} from "react-router-dom";
import {lastActivity, ResultRecord} from "../../../types/ResultRecord";
import {APP_URL} from "../../App";
import {getRelativeTime} from "../../../utills/DateUtil";
import {useStorage, STORAGE_CHANGE} from "../../../context/StorageContext";
import {ShareLink} from "../../components/common/ShareLink";
import {STORE_HISTORY} from "../../../constants/storage";

const RecentActivity = () => {
  const { input } = useParams()
  const navigate = useNavigate()
  const { getHistory, deleteResult } = useStorage()
  const [results, setResults] = useState<ResultRecord[]>(() => getHistory())

  useEffect(() => {
    const handleStorageChange = (e: CustomEvent) => {
      if (e.detail === STORE_HISTORY) setResults(getHistory())
    }
    window.addEventListener(STORAGE_CHANGE, handleStorageChange as EventListener)
    return () => window.removeEventListener(STORAGE_CHANGE, handleStorageChange as EventListener)
  }, [getHistory])

  const handleNavigate = (url: string) => {
    window.scrollTo(0, 0)
    navigate(url)
  }

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this result from history?')) return
    deleteResult(id)
    if (input && input === id) navigate(HOME)
  }

  return (
    <div className="map-container">
      <ul className="map-items">
        {results.slice(0, 10).map(record => (
          <li key={record.id} className={`map-item ${record.id === input ? 'selected' : ''}`}>
            <span
              title={`Saved ${getRelativeTime(record.savedAt)}${record.lastViewed ? ` · Viewed ${getRelativeTime(record.lastViewed)}` : ''}`}
              onClick={() => handleNavigate(record.url)}
              className="map-item-name"
            >
              <span className="map-item-label">{record.name ?? record.id}</span>
              <span className="map-item-time">{getRelativeTime(lastActivity(record))}</span>
            </span>
            <div className="map-item-options">
              <ShareLink url={`${APP_URL}${record.url}`} />
              <button
                title="Delete"
                className="bi bi-trash icon-btn icon-btn-danger"
                onClick={() => handleDelete(record.id)}
              />
            </div>
          </li>
        ))}
      </ul>
      {results.length > 10 && (
        <NavLink to={ACTIVITY} className="map-view-all">View all history →</NavLink>
      )}
    </div>
  )
}

export default RecentActivity
