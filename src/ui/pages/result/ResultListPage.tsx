import DefaultPageLayout from "../../layout/DefaultPageLayout";
import React, {useEffect, useState} from "react";
import {LOCAL_RESULTS, TITLE} from "../../../constants/const"
import {getRelativeTime} from "../../../utills/DateUtil";
import {lastUpdate, ResultRecord} from "../../../types/ResultRecord";
import {NavLink} from "react-router-dom";
import {APP_URL} from "../../App";
import useLocalStorage from "../../../hooks/useLocalStorage";
import {ResultHelp} from "../../components/help/ResultHelp";


function ResultListPageContent() {
  const {getItem, setItem} = useLocalStorage();
  const [results, setResults] = useState<ResultRecord[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null);


  useEffect(() => {
    document.title = "Results - " + TITLE;
    // Retrieve result records from local storage
    const localResults = getItem<ResultRecord[]>(LOCAL_RESULTS) || []
    setResults(localResults)
  }, [getItem, setItem]);

  const handleNameChange = (index: number|null, newName: string) => {
    const updatedResults = results.map((r, idx) =>
      idx === index ? { ...r, name: newName } : r
    );
    setItem(LOCAL_RESULTS, updatedResults); // no sort needed
    setResults(updatedResults);
  };

  const handleDelete = (index: number) => {
    const updatedResults = results.filter((_, idx) => idx !== index);
    setItem(LOCAL_RESULTS, updatedResults); // no re-sort needed
    setResults(updatedResults);
  }

  return <div className="container">

    <h6>Search Results</h6>
    <ResultHelp /><br/>

    {results.length === 0 ? (
      <p>No result</p>
    ) : (<>


        {results.length} previous search{results.length > 1 ? 'es' : ''}
        <table className="table download-table">
          <thead style={{backgroundColor: '#6987C3', color: '#FFFFFF'}}>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Last submitted/viewed</th>
            {
            //<th scope="col">Expires</th>
            }
            <th scope="col">Share</th>
            <th scope="col">Delete</th>
          </tr>
          </thead>
          <tbody>

          {results.map((record, index) => {
            return (
              <tr key={`download-${index}`}>
                <td><NavLink to={record.url}>{record.id}</NavLink></td>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      className="edit-name"
                      value={record.name}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      onBlur={() => setEditingIndex(null)}
                      autoFocus
                    />
                  ) : (
                    <span onClick={() => setEditingIndex(index)}>{record.name ? record.name : <i>Unnamed</i>}
                      <i
                        className="bi bi-pencil"></i></span>
                  )}
                </td>
                <td title={`Submitted ${record.lastSubmitted || record.firstSubmitted || `N/A`} Viewed ${record.lastViewed || `N/A`}`}>{getRelativeTime(lastUpdate(record))}</td>
                {
                //<td>in {}</td>
                }
                <td>
                  <button title="Share" onClick={() => {
                    let url = `${APP_URL}${record.url}`;
                    navigator.clipboard.writeText(url);
                    alert(`URL copied: ${url}`)
                  }} className="bi bi-share result-op-btn"></button>
                </td>
                <td>
                  <button className="bi bi-trash trash-btn" onClick={_ => handleDelete(index)}></button>
                </td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </>
    )}
  </div>
}

function ResultListPage() {
  return <DefaultPageLayout content={<ResultListPageContent/>}/>
}

export default ResultListPage;