import React, { Component } from 'react';
import PropTypes from 'prop-types';

const ImpactSearchResults = props => (
  <div className="search-results">
    <table>
      <tbody>
        <tr>
          <th>Protein accession</th>
          <th>Protein name</th>
          <th>Gene name</th>
          <th>Transcript Id</th>
          <th>Position</th>
          <th>Impact</th>
        </tr>

        {Object.keys(props.rows)
          .map(key => {
            const row = props.rows[key];
console.log("++ row:", row);
            return (
              <tr key={`${row.proteinAccession}-${row.geneName}`}>
                <td>{row.proteinAccession}</td>
                <td>{row.proteinName}</td>
                <td>{row.geneName}</td>
                <td>{row.transcriptIds}</td>
                <td>{`${row.chromosome}:${row.start}-${row.end}`}</td>
                <td></td>
              </tr>
            );
        })}
      </tbody>
    </table>
    { /* props.results */ }
  </div>
);

export default ImpactSearchResults;
