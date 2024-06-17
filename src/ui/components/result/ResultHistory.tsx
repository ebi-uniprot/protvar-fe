import "./ResultHistory.css"
import {useEffect, useState} from "react";
import {LOCAL_RESULTS} from "../../../constants/const";
import {useLocalStorageContext} from "../../../provider/LocalStorageContextProps";
import {HOME, RESULT} from "../../../constants/BrowserPaths";
import {useNavigate, useParams} from "react-router-dom";
import {ResultRecord} from "../../../types/ResultRecord";

const sortResultsByLatestDate = (records: ResultRecord[]): ResultRecord[] => {
  return records.sort((a, b) => {
    const getLatestDate = (record: ResultRecord) => {
      const dates = [record.firstSubmitted, record.lastSubmitted, record.lastViewed].filter(Boolean).map(date => new Date(date!));
      return dates.length ? Math.max(...dates.map(date => date.getTime())) : 0;
    };

    return getLatestDate(b) - getLatestDate(a);
  });
};

const ResultHistory = () => {
  const {id} = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { getValue, setValue } = useLocalStorageContext();
  const [results, setResults] = useState<ResultRecord[]>(getValue(LOCAL_RESULTS) || [])

  useEffect(() => {
    const handleStorageChange = () => {
      console.log('Storage changed!');
      setResults(getValue(LOCAL_RESULTS) || []);
    };

    // Listen for changes in localStorage
    window.addEventListener('storage', handleStorageChange);

    return () => {
      // Clean up the listener
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [results, getValue]);


  const saveResults = (updatedRecords: ResultRecord[]) => {
    setResults(updatedRecords);
    setValue(LOCAL_RESULTS, updatedRecords);
  };

  const deleteResult = (delId: string) => {
    const updatedRecords = results.filter(record => record.id !== delId);
    saveResults(updatedRecords);
    if (id && id === delId)
      navigate(HOME)
    // TODO API call DELETE /mapping/input/{id}
  };

  const sortedRecords = sortResultsByLatestDate(results);
  const shareUrl = `${window.location.origin}${process.env.PUBLIC_URL}${RESULT}`

  return (
    <ul className="item-list">
        {sortedRecords.map(record => (
          <li key={record.id} className="item">
            <>
              <span title={`Submitted ${record.lastSubmitted || record.firstSubmitted} Viewed ${record.lastViewed}`}
                    onClick={_=>navigate(record.url)}
                    className="item-name">
                {`${record.id.slice(0, 6)}...`}
              </span>
              <div className="item-options">
                <button title="Delete" className="bi bi-x-lg result-op-btn"
                        onClick={() => deleteResult(record.id)}></button>
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