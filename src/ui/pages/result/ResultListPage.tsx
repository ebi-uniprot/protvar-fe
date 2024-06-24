import DefaultPageLayout from "../../layout/DefaultPageLayout";
import React, {useEffect, useState} from "react";
import {LOCAL_RESULTS, TITLE} from "../../../constants/const"
import {getRelativeTime} from "../../../utills/DateUtil";
import {lastUpdate, ResultRecord} from "../../../types/ResultRecord";
import {NavLink} from "react-router-dom";
import {APP_URL} from "../../App";
import useLocalStorage from "../../../hooks/useLocalStorage";


function ResultListPageContent() {
  const {getItem, setItem} = useLocalStorage();
  const [results, setResults] = useState<ResultRecord[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showHelp, setShowHelp] = useState(false)


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
    <p>
      <button className={`bi bi-info-circle${showHelp ? `-fill` : ``}`}
              onClick={_ => setShowHelp(!showHelp)}> Help <i
        className={`bi bi-chevron-${showHelp ? `up` : `down`}`}></i></button>
      {showHelp && <ResultHelp/>}
    </p>

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
                <td>
                  <button title="Share" onClick={() => {
                    let url = `${APP_URL}${record.url}`;
                    navigator.clipboard.writeText(url);
                    alert(`Copy URL: ${url}`)
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

const ResultHelp = () => {
  return <div className="page-help"><h5>Where's My Result?</h5>

    <p>All search results are listed on this page. Recent searches can be quickly accessed from the side navigation.</p>

    <p>Every custom search generates a unique ID, allowing you to share the result, including a specific page of results
      and even specific annotations such as functional, population, or structural information for a specific
      variant.</p>

    <p>The generated URL follows this format:</p>

    <p>
      <code>https://www.ebi.ac.uk/ProtVar/result/UUID[?page=PAGE&pageSize=PAGE_SIZE&assembly=ASSEMBLY&annotation=[function|population|structure]-X]</code>
    </p>

    <p><strong>URL Parameters:</strong></p>
    <ul>
      <li><code>UUID</code>: The unique identifier generated for each custom search.</li>
      <li><code>page</code>: Optional parameter to specify a particular page of results.</li>
      <li><code>pageSize</code>: Optional parameter to define the number of results per page.</li>
      <li><code>assembly</code>: Optional parameter specifying the genome assembly version used for the search.</li>
      <li><code>annotation</code>: Optional parameter to open specific annotation section on the result page:
        <ul>
          <li><code>function</code>: Open the functional annotation.</li>
          <li><code>population</code>: Open the population annotation.</li>
          <li><code>structure</code>: Open structural annotation.</li>
        </ul>
      </li>
      <li><code>X</code>: Corresponds to the specific variant on the result page.
      </li>
    </ul>


    <p><strong>Protein Accession</strong></p>
    <p>The  URL follows this format:</p>

    <p>
      <code>https://www.ebi.ac.uk/ProtVar/ACCESSION</code>
    </p>

    And the same parameters as above.

    <p><strong>Result Management</strong></p>
    <p>Use <em>edit</em> <i className="bi bi-pencil"></i>, <em>share</em> <i
      className="bi bi-share"></i> and <em>delete</em> <i className="bi bi-trash"></i> to manage results.</p>

  </div>
}

function ResultListPage() {
  return <DefaultPageLayout content={<ResultListPageContent/>}/>
}

export default ResultListPage;