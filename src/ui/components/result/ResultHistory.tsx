import "./ResultHistory.css"
import {useEffect, useState} from "react";
import {LOCAL_RESULTS} from "../../../constants/const";
import {LOCAL_STORAGE_SET, useLocalStorageContext} from "../../../provider/LocalStorageContextProps";
import {HOME} from "../../../constants/BrowserPaths";
import {useNavigate, useParams} from "react-router-dom";
import {lastUpdate, ResultRecord} from "../../../types/ResultRecord";
import {APP_URL} from "../../App";
import {categoriseDate} from "../../../utills/DateUtil";

const ResultHistory = () => {
  const {id} = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { getValue, setValue } = useLocalStorageContext();
  const [results, setResults] = useState<ResultRecord[]>(getValue(LOCAL_RESULTS) || [])

  useEffect(() => {
    const handleStorageChange = (e: CustomEvent) => {
      if (e.detail === LOCAL_RESULTS)
        setResults(getValue(LOCAL_RESULTS) || []);
    };

    // Listen for changes in localStorage
    window.addEventListener(LOCAL_STORAGE_SET, handleStorageChange as EventListener);

    return () => {
      // Clean up the listener
      window.removeEventListener(LOCAL_STORAGE_SET, handleStorageChange as EventListener);
    };
  }, [results, getValue]);

  const deleteResult = (delId: string) => {
    const updatedRecords = results.filter(record => record.id !== delId);
    setResults(updatedRecords);
    setValue(LOCAL_RESULTS, updatedRecords); // no re-sort needed
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
                    <button title="Delete" className="bi bi-x-lg result-op-btn"
                            onClick={() => deleteResult(record.id)}></button>
                    <button title="Share" onClick={() => {
                      let url = `${APP_URL}${record.url}`;
                      navigator.clipboard.writeText(url);
                      alert(`Copy URL: ${url}`)
                    }} className="bi bi-share result-op-btn"></button>
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

export default ResultHistory;