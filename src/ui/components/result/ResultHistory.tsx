import "./ResultHistory.css"
import {useEffect, useState} from "react";
import {LOCAL_RESULTS} from "../../../constants/const";
import {useLocalStorageContext} from "../../../provider/LocalStorageContextProps";
import {RESULT} from "../../../constants/BrowserPaths";

// Maybe group results by Viewed & Submitted
export interface ResultRecord {
  id: string  // required
  firstSubmitted: string // TODO make optional - when shared, user will only have viewed this, not submitted
  lastSubmitted: string // TODO same for this
  lastViewed: string // required
  name?: string
  numItems?: number
  params?: string // page, pageSize, assembly
}
const ResultHistory = () => {
  const { getValue, setValue } = useLocalStorageContext();
  const [records, setRecords] = useState<ResultRecord[]>([]);

  useEffect(() => {
    const savedRecords = getValue<ResultRecord[]>(LOCAL_RESULTS);
    if (savedRecords) {
      setRecords(savedRecords);
    }
  }, [getValue]);

  const saveRecords = (updatedRecords: ResultRecord[]) => {
    setRecords(updatedRecords);
    setValue(LOCAL_RESULTS, updatedRecords);
  };

  const deleteRecord = (id: string) => {
    const updatedRecords = records.filter(record => record.id !== id);
    saveRecords(updatedRecords);
    // TODO API call DELETE /mapping/input/{id}
  };

  const sortedRecords = [...records].sort((a, b) => new Date(b.lastViewed).getTime() - new Date(a.lastViewed).getTime());

  const shareUrl = `${window.location.origin}${process.env.PUBLIC_URL}${RESULT}`

  return (
    <ul className="item-list">
        {sortedRecords.map(record => (
          <li key={record.id} className="item">
            <>
              <span title={`Submitted ${record.lastSubmitted || record.firstSubmitted} Viewed ${record.lastViewed}`}
                    className="item-name">
                {`${record.id.slice(0, 6)}...`}
              </span>
              <div className="item-options">
                <button title="Delete" className="bi bi-x-lg result-op-btn"
                        onClick={() => deleteRecord(record.id)}></button>
                <button title="Share" onClick={() => { let url = `${shareUrl}/${record.id}`;
                  navigator.clipboard.writeText(url);
                  alert(`Copy URL: ${url}`)}} className="bi bi-share result-op-btn"></button>
              </div>
            </>
          </li>
          ))}
    </ul>
  )
}

export default ResultHistory;