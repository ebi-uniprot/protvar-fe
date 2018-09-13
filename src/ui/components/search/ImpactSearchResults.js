import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

const ImpactSearchResults = props => {
  let counter = 0;

  return (
    <div className="search-results">
      <table border="1" className="unstriped">
        <tbody>
          <tr>
            <th rowSpan="2">#</th>
            <th colSpan="4">Protein</th>
            <th colSpan="4">Genomic</th>
            <th rowSpan="2">Significance</th>
          </tr>
          <tr>
            <th>Accession</th>
            <th>Length</th>
            <th>Position</th>
            <th>Variant</th>
            <th>ENSG</th>
            <th>ENST</th>
            <th>Location</th>
            <th>Allele</th>
          </tr>

          {Object.keys(props.rows)
            .map(key => {
              const group = props.rows[key];
              return (
                <Fragment key={`${group.key}`}>
                  <tr>
                    <td colSpan="10">Query: {group.input}</td>
                  </tr>
                  {group.rows.map((row, i) => {
                    const { protein, gene } = row;
                    const proteinPosition = (protein.start === protein.end)
                      ? protein.start
                      : `${protein.start}-${protein.end}`;
                    const geneLocation = `${gene.chromosome}:${gene.start}-${gene.end}`;

                    return (
                      <tr key={`${group.key}-${i}`}>
                        <td>{++counter}</td>
                        <td></td>
                        <td></td>
                        <td>{proteinPosition || '-'}</td>
                        <td>{protein.variant || '-'}</td>
                        <td>{gene.ensgId.substring(4)}</td>
                        <td>{gene.enstId.substring(4)}</td>
                        <td>{geneLocation}</td>
                        <td>{gene.allele}</td>
                        <td></td>
                      </tr>
                    )
                  })}
                </Fragment>
              );
          })}
        </tbody>
      </table>
      { /* props.results */ }
    </div>
  );
}

export default ImpactSearchResults;
