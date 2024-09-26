import DefaultPageLayout from "../../layout/DefaultPageLayout";
import React, {useEffect, useState} from "react";
import {LOCAL_RESULTS, TITLE} from "../../../constants/const"
import {getRelativeTime, parseDateString} from "../../../utills/DateUtil";
import {ResultRecord} from "../../../types/ResultRecord";
import {NavLink} from "react-router-dom";
import {APP_URL} from "../../App";
import useLocalStorage from "../../../hooks/useLocalStorage";
import {HelpButton} from "../../components/help/HelpButton";
import {HelpContent} from "../../components/help/HelpContent";
import Spaces from "../../elements/Spaces";
import {ShareLink} from "../../components/common/ShareLink";

function ResultListPageContent() {
  const {getItem, setItem} = useLocalStorage();
  const [results, setResults] = useState<ResultRecord[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    document.title = "Search Results - " + TITLE;
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

  const handleDeleteAll = () => {
    setItem(LOCAL_RESULTS, []);
    setResults([]);
  }

  return <div className="container">

    <div>
      <h5 className="page-header">Search Results</h5>
      <span className="help-icon">
      <HelpButton title="" content={<HelpContent name="search-results" />}/>
        </span>
    </div>
  {
    results.length === 0 ? (
      <p>No result</p>
    ) : (<>

        <div style={{display: "flex", justifyContent: "space-between", padding: "5px"}}>
          <div>{results.length} previous search{results.length > 1 ? 'es' : ''}
            {results.length > 1 && <> (
              <button className="bi bi-trash icon-btn" onClick={_ => handleDeleteAll()}> Delete all</button>
              )</>}
          </div>
        </div>
        <table className="table download-table">
          <thead style={{backgroundColor: '#6987C3', color: '#FFFFFF'}}>
          <tr>
            <th scope="col">Last Viewed</th>
            <th scope="col">Submitted</th>
            {
              //<th scope="col">Expires</th>
            }
            <th scope="col">Name</th>
            <th scope="col">Input ID</th>
            <th scope="col">Manage</th>
          </tr>
          </thead>
          <tbody>

          {results.map((record, index) => {
            return (
              <tr key={`download-${index}`}>
                <td>
                  {getRelativeTime(parseDateString(record.lastViewed))}
                </td>
                <td>
                  {record.lastSubmitted ?
                    getRelativeTime(parseDateString(record.lastSubmitted)) :
                    (record.firstSubmitted ?
                        getRelativeTime(parseDateString(record.firstSubmitted)) : ``
                    )
                  }
                </td>
                {
                  //<td>in {}</td>
                }
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
                        className="bi bi-pencil icon-btn"></i></span>
                  )}
                </td>
                <td><NavLink to={record.url}>{record.id}</NavLink></td>
                <td>
                  <ShareLink url={`${APP_URL}${record.url}`} />
                  <Spaces count={2}/>
                  <button title="Delete" onClick={() => handleDelete(index)}
                          className="bi bi-trash icon-btn"></button>
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