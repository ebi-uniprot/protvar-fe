import React from "react";
import {HelpBtn} from "./HelpBtn";

export const ResultHelp = () => {
  return <HelpBtn title="Help" content={<ResultHelpContent/>} />
}

const ResultHelpContent = () => {
  return <div className="help-section"><h5>Where's My Result?</h5>

    <p>All search results are listed on this page. Recent searches can be quickly accessed from the side navigation.</p>

    <p>Every custom search generates a unique ID, allowing you to share the result, including a specific page of results
      and even specific annotations such as functional, population, or structural information for a specific
      variant.</p>

    <p>The generated URL follows this format:</p>

    <p>
      <code>https://www.ebi.ac.uk/ProtVar/result/UUID[?page=PAGE&pageSize=PAGE_SIZE&assembly=ASSEMBLY&annotation=[functional|population|structural]-row-X]</code>
    </p>

    <p><strong>URL Parameters:</strong></p>
    <ul>
      <li><code>UUID</code>: The unique identifier generated for each custom search.</li>
      <li><code>page</code>: Optional parameter to specify a particular page of results.</li>
      <li><code>pageSize</code>: Optional parameter to define the number of results per page.</li>
      <li><code>assembly</code>: Optional parameter specifying the genome assembly version used for the search.</li>
      <li><code>annotation</code>: Optional parameter to open specific annotation section on the result page:
        <ul>
          <li><code>functional</code>: Open the functional annotation.</li>
          <li><code>population</code>: Open the population annotation.</li>
          <li><code>structural</code>: Open structural annotation.</li>
        </ul>
      </li>
      <li><code>X</code>: Corresponds to the specific variant row on the result page.
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
