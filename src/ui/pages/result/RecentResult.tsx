import "./RecentResult.css"
import React, {useEffect, useState} from "react";
import {LOCAL_RESULTS} from "../../../constants/const";
import {HOME} from "../../../constants/BrowserPaths";
import {useNavigate, useParams} from "react-router-dom";
import {lastUpdate, ResultRecord} from "../../../types/ResultRecord";
import {APP_URL} from "../../App";
import {categoriseDate} from "../../../utills/DateUtil";
import useLocalStorage from "../../../hooks/useLocalStorage";
import {SET_ITEM} from "../../../context/LocalStorageContext";
import {ShareLink} from "../../components/common/ShareLink";

const RecentResult = () => {
  const {id} = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { getItem, setItem } = useLocalStorage();
  const [results, setResults] = useState<ResultRecord[]>(getItem(LOCAL_RESULTS) || [])

  useEffect(() => {
    const handleStorageChange = (e: CustomEvent) => {
      if (e.detail === LOCAL_RESULTS)
        setResults(getItem(LOCAL_RESULTS) || []);
    };

    // Listen for changes in localStorage
    window.addEventListener(SET_ITEM, handleStorageChange as EventListener);

    return () => {
      // Clean up the listener
      window.removeEventListener(SET_ITEM, handleStorageChange as EventListener);
    };
  }, [results, getItem]);

  const deleteResult = (delId: string, index: number) => {
    const updatedRecords = results.filter((_, i) => i !== index);
    setResults(updatedRecords);
    setItem(LOCAL_RESULTS, updatedRecords); // no re-sort needed
    if (id && id === delId)
      navigate(HOME)
    // TODO API call DELETE /mapping/input/{id}
  };

  // no need to sort as result records are maintained in order
  //const sortedRecords = sortResultsByLatestDate(results);
  const grouped = groupByFirstN(results, 5);

  return (
    <div className="map-container">
      {Array.from(grouped.entries()).map(([key, value]) => (
        <div key={key} className="map-group">
          <h3 className="map-key">{key}</h3>
          <ul className="map-items">
            {value.map((record, index) => (
              <li key={record.id} className={`map-item ${record.id === id ? `selected` : ``}`}>
                <>
              <span title={`Submitted ${record.lastSubmitted || record.firstSubmitted} Viewed ${record.lastViewed}`}
                    onClick={_ => navigate(record.url)}
                    className="map-item-name">
                {record.name ? record.name : record.id}
              </span>
                  <div className="map-item-options">
                    <ShareLink url={`${APP_URL}${record.url}`} />
                    <button title="Delete" className="bi bi-x-lg icon-btn"
                            onClick={() => deleteResult(record.id, index)}></button>
                  </div>
                </>
              </li>

            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function groupByFirstN(records: ResultRecord[], n: number) {
  const map = new Map<string, ResultRecord[]>(); // key=dateCategory
  records.slice(0, n).forEach((record) => {
    const dateCategory = categoriseDate(lastUpdate(record))
    const collection = map.get(dateCategory);
    if (!collection) {
      map.set(dateCategory, [record]);
    } else {
      collection.push(record);
    }
  });
  return map;
}

export default RecentResult;