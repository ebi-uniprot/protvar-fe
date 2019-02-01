import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Button from '../../elements/form/Button';
import ExpandedPositionalSignificance from '../significances/ExpandedPositionalSignificance';
import ExpandedTranscriptSignificance from '../significances/ExpandedTranscriptSignificance';
import ExpandedClinicalSignificance from '../significances/ExpandedClinicalSignificance';
import ExpandedStructuralSignificance from '../significances/ExpandedStructuralSignificance';

class ImpactSearchResults extends Component {
  state = {
    expandedRow: null,
  }

  toggleSignificanceRow(rowId, significanceType) {
    const { expandedRow } = this.state;
    const rowIdAndType = `${rowId}:${significanceType}`;

    this.setState({
      expandedRow: (rowIdAndType !== expandedRow)
        ? rowIdAndType
        : null
    });
  }

  render() {
    const { expandedRow } = this.state;
    const { rows } = this.props;
    let counter = 0;

    const totalCounts = Object.values(rows)
      .reduce((total, current) => {
        return total + current.rows.length;
      }, 0);

    return (
      <div className="search-results">
        <div className="results-and-counter">
          <span className="results-counter">
            {totalCounts} Results Found
          </span>
          <Button>Download</Button>
        </div>
        <div className="legends">
          <div className="legends-item">
            <span className="legends-icon button--positional">P</span> Positional Significances
          </div>
          <div className="legends-item">
            <span className="legends-icon button--clinical">C</span> Clinical Significances
          </div>
          <div className="legends-item">
            <span className="legends-icon button--structural">S</span> Structural Significances
          </div>
          <div className="legends-item">
            <span className="legends-icon button--transcript">T</span> Transcript Significances
          </div>
        </div>

        <table border="0" className="unstriped" cellPadding="0" cellSpacing="1">
          <tbody>
            <tr>
              <th rowSpan="2">#</th>
              <th rowSpan="2">Gene Name</th>
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

            {Object.keys(rows)
              .map(key => {
                const group = rows[key];
                return (
                  <Fragment key={`${group.key}`}>
                    <tr>
                      <td colSpan="11" className="query-row">Query: {group.input}</td>
                    </tr>
                    {group.rows.map((row, i) => {
                      const { protein, gene, significances } = row;
                      const proteinPosition = (protein.start === protein.end)
                        ? protein.start
                        : `${protein.start}-${protein.end}`;
                      const geneLocation = `${gene.chromosome}:${gene.start}-${gene.end}`;
                      const rowKey = `${group.key}-${i}`;

                      significances.transcript
                        .forEach(t => {
                          t.hgvsg = gene.hgvsg;
                          t.hgvsp = gene.hgvsp;
                          t.canonical = protein.canonical;
                          t.codons = gene.codons;
                          t.aminoAcids = protein.variant;
                          t.start = protein.start;
                          t.end = protein.end;
                        });

                      return (
                        <Fragment>
                          <tr key={rowKey}>
                            <td>{++counter}</td>
                            <td>{gene.symbol}</td>
                            <td>{protein.accession}</td>
                            <td>{protein.length}</td>
                            <td>{proteinPosition || '-'}</td>
                            <td>
                              <span title={protein.variant}>{protein.threeLetterCodes || '-'}</span>
                            </td>
                            <td>{gene.ensgId}</td>
                            <td>{gene.enstId}</td>
                            <td>{geneLocation}</td>
                            <td>{gene.allele}</td>
                            <td>
                              {('undefined' !== typeof significances.positional)
                                ? <Button onClick={() => this.toggleSignificanceRow(rowKey, 'positional')} className="button--round button--positional">P</Button>
                                : null }

                              {('undefined' !== typeof significances.clinical)
                                ? <Button onClick={() => this.toggleSignificanceRow(rowKey, 'clinical')} className="button--round button--clinical">C</Button>
                                : null }

                              {('undefined' !== typeof significances.transcript)
                                ? <Button onClick={() => this.toggleSignificanceRow(rowKey, 'transcript')} className="button--round button--transcript">T</Button>
                                : null }

                              {('undefined' !== typeof significances.structural)
                                ? <Button onClick={() => this.toggleSignificanceRow(rowKey, 'structural')} className="button--round button--structural">S</Button>
                                : null }
                            </td>
                          </tr>
                          {(`${rowKey}:positional` === expandedRow)
                            ? <ExpandedPositionalSignificance data={significances.positional} />
                            : null }

                          {(`${rowKey}:clinical` === expandedRow)
                            ? <ExpandedClinicalSignificance data={significances.clinical} />
                            : null }

                          {(`${rowKey}:transcript` === expandedRow)
                            ? <ExpandedTranscriptSignificance data={significances.transcript} />
                            : null }

                          {(`${rowKey}:structural` === expandedRow)
                            ? <ExpandedStructuralSignificance data={significances.structural} />
                            : null }
                        </Fragment>
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
}

export default ImpactSearchResults;
