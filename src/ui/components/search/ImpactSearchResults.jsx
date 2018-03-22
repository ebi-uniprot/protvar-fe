
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
          <th>Start position</th>
          <th>End position</th>
          <th>Impact</th>
        </tr>

        {Object.keys(props.rows)
          .map(key => {
            const row = props.rows[key];

            return (
              <tr key={row.accession}>
                <td>{row.accession}</td>
                <td>{row.name}</td>
                <td>{row.geneName}</td>
                <td>{row.transcriptId}</td>
                <td>{row.position.start}</td>
                <td>{row.position.end}</td>
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
