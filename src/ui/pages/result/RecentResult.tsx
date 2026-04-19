import "./RecentResult.css"
import React, {useEffect, useState} from "react";
import {HOME} from "../../../constants/BrowserPaths";
import {useNavigate, useParams} from "react-router-dom";
import {lastActivity, ResultRecord} from "../../../types/ResultRecord";
import {APP_URL} from "../../App";
import {categoriseDate, parseDateString} from "../../../utills/DateUtil";
import {useStorage, STORAGE_CHANGE} from "../../../context/StorageContext";
import {ShareLink} from "../../components/common/ShareLink";
import {STORE_HISTORY} from "../../../constants/storage";

const RecentResult = () => {
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

  const handleDelete = (id: string) => {
    deleteResult(id)
    if (input && input === id) navigate(HOME)
  }

  const grouped = groupByFirstN(results, 5)

  return (
    <div className="map-container">
      {Array.from(grouped.entries()).map(([key, records]) => (
        <div key={key} className="map-group">
          <h3 className="map-key">{key}</h3>
          <ul className="map-items">
            {records.map(record => (
              <li key={record.id} className={`map-item ${record.id === input ? 'selected' : ''}`}>
                <span
                  title={`Saved ${record.savedAt}${record.lastViewed ? ` · Viewed ${record.lastViewed}` : ''}`}
                  onClick={() => navigate(record.url)}
                  className="map-item-name"
                >
                  {record.name ?? record.id}
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
        </div>
      ))}
    </div>
  )
}

function groupByFirstN(records: ResultRecord[], n: number): Map<string, ResultRecord[]> {
  const map = new Map<string, ResultRecord[]>()
  records.slice(0, n).forEach(record => {
    const category = categoriseDate(parseDateString(lastActivity(record)))
    const group = map.get(category)
    if (group) group.push(record)
    else map.set(category, [record])
  })
  return map
}

export default RecentResult
