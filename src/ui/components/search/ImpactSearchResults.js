import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Button from '../../elements/form/Button';

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

    return (
      <div className="search-results">
        <table border="1" className="unstriped">
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
                      <td colSpan="11">Query: {group.input}</td>
                    </tr>
                    {group.rows.map((row, i) => {
                      const { protein, gene, significances } = row;
                      const proteinPosition = (protein.start === protein.end)
                        ? protein.start
                        : `${protein.start}-${protein.end}`;
                      const geneLocation = `${gene.chromosome}:${gene.start}-${gene.end}`;
                      const rowKey = `${group.key}-${i}`;
                      
                      const ExpandedPositionalSignificance = props => {
                        const { data } = props;
                        return (
                          <tr>
                            <td colSpan="11">
                              <h4>Positional Significances</h4>
                              <br />
                              { data.features.map(feature => {
                                return (
                                  <div>
                                    <b>Type:</b> <span>{feature.type}</span>
                                    <br />
                                    <b>Category:</b> <span>{feature.category}</span>
                                    <br />
                                    <b>Begin/End:</b> <span>{feature.begin} / {feature.end}</span>
                                    <br />
                                    <p><b>Description:</b> {feature.description}</p>
                                    {(0 < feature.evidences.length)
                                      ? (<div>
                                          <b>Evidences:</b>
                                            <ul>
                                              {feature.evidences.map(e => <li>ID: {e.sourceId} [{e.sourceName}]</li>)}
                                            </ul>
                                          </div>)
                                      : null}
                                    <hr />
                                  </div>
                                );
                              })}
                            </td>
                          </tr>
                        );
                      }

                      const ExpandedTranscriptSignificance = props => {
                        const { data } = props;
                        console.log("TS Props:", data);
                        return (
                          <tr>
                            <td colSpan="11">
                              <h4>Transcript Significances</h4>
                              <br />
                              { data.map(ts => {
                                console.log("TS:", ts);
                                return (
                                  <div>
                                    <b>Impact:</b> <span>{ts.impact}</span>
                                    <br />
                                    <b>Codons:</b> <span>{ts.codons}</span>
                                    <br />
                                    <b>Polyphen Prediction / Score:</b>
                                      &nbsp;<span>{ts.polyphenPrediction} / {ts.polyphenScore}</span>
                                    <br />
                                    <b>Sift Prediction / Score:</b>
                                      &nbsp;<span>{ts.siftPrediction} / {ts.siftScore}</span>
                                    <br />
                                    <b>Consequence Terms:</b>
                                      <ul>
                                        {ts.consequenceTerms.map(t => <li>{t}</li>)}
                                      </ul>
                                    <hr />
                                  </div>
                                );
                              })}
                            </td>
                          </tr>
                        );
                      }

                      return (
                        <Fragment>
                          <tr key={rowKey}>
                            <td>{++counter}</td>
                            <td>{gene.name}</td>
                            <td>{protein.accession}</td>
                            <td></td>
                            <td>{proteinPosition || '-'}</td>
                            <td>{protein.variant || '-'}</td>
                            <td>{gene.ensgId.substring(4)}</td>
                            <td>{gene.enstId.substring(4)}</td>
                            <td>{geneLocation}</td>
                            <td>{gene.allele}</td>
                            <td>
                              {('undefined' !== typeof significances.positional)
                                ? <Button onClick={() => this.toggleSignificanceRow(rowKey, 'positional')}>P</Button>
                                : null }

                              {('undefined' !== typeof significances.transcript)
                                ? <Button onClick={() => this.toggleSignificanceRow(rowKey, 'transcript')}>T</Button>
                                : null }
                            </td>
                          </tr>
                          {(`${rowKey}:positional` === expandedRow)
                            ? <ExpandedPositionalSignificance data={significances.positional} />
                            : null }

                          {(`${rowKey}:transcript` === expandedRow)
                            ? <ExpandedTranscriptSignificance data={significances.transcript} />
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
