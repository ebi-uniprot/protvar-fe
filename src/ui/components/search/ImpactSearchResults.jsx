import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Button from '../../elements/form/Button';
import ExpandedFunctionalSignificance from '../significances/ExpandedFunctionalSignificance';
import ExpandedTranscriptSignificance from '../significances/ExpandedTranscriptSignificance';
import ExpandedClinicalSignificance from '../significances/ExpandedClinicalSignificance';
import ExpandedStructuralSignificance from '../significances/ExpandedStructuralSignificance';
import ExpandedGenomicSignificance from '../significances/ExpandedGenomicSignificance';
import ProteinReviewStatus from '../other/ProteinReviewStatus';
import SearchResultsLegends from '../other/SearchResultsLegends';

class ImpactSearchResults extends Component {
  state = {
    expandedRow: null,
    showAllIsoforms: false,
  }

  toggleAllIsoforms = () => {
    const { showAllIsoforms } = this.state;

    this.setState({
      showAllIsoforms: !showAllIsoforms,
    });
  }

  toggleSignificanceRow(rowId, significanceType) {
    const { expandedRow } = this.state;
    const rowIdAndType = `${rowId}:${significanceType}`;

    this.setState({
      expandedRow: (rowIdAndType !== expandedRow)
        ? rowIdAndType
        : null,
    });
  }

  render() {
    const { rows, handleDownload } = this.props;
    const {
      expandedRow,
      showAllIsoforms,
    } = this.state;

    let counter = 0;

    const totalCounts = Object.values(rows)
      .reduce((total, current) => total + current.rows.length, 0);

    return (
      <div className="search-results">
        <SearchResultsLegends />

        <div className="results-and-counter">
          <span className="results-counter">
            {totalCounts}
            {' '}
            Results Found
          </span>
          <Button onClick={handleDownload}>Download</Button>
          <Button onClick={this.toggleAllIsoforms}>
            {(showAllIsoforms) ? 'Hide' : 'Show'}
            {' '}
Isoforms
          </Button>
        </div>

        <table border="0" className="unstriped" cellPadding="0" cellSpacing="0">
          <tbody>
            <tr>
              <th colSpan="3" rowSpan="2">Gene Name</th>
              <th colSpan="4">Protein</th>
              <th colSpan="4">Genomic</th>
              <th colSpan="5">Impact</th>
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
              <th>T</th>
              <th>S</th>
              <th>F</th>
              <th>C</th>
              <th>G</th>
            </tr>

            {Object.keys(rows)
              .map((key) => {
                const group = rows[key];
                return (
                  <Fragment key={`${group.key}`}>
                    <tr>
                      <td colSpan="8" className="query-row">
                        Query:
                        {group.input}
                      </td>
                      <td colSpan="4" className="query-row">
                        HGVSg:
                        {' '}
                        {group.rows[0] && group.rows[0].gene.hgvsg}
                      </td>
                      <td colSpan="4" className="query-row">
                        {group.rows[0] && group.rows[0].variation.dbSNIPId}
                      </td>
                    </tr>
                    {group.rows.map((row, i) => {
                      const {
                        protein,
                        gene,
                        significances,
                        variation,
                      } = row;

                      if (!showAllIsoforms && !protein.canonical) {
                        return null;
                      }

                      const proteinPosition = (protein.start === protein.end)
                        ? protein.start
                        : `${protein.start}-${protein.end}`;

                      const geneLocation = (gene.start === gene.end)
                        ? `${gene.chromosome}:g.${gene.start}`
                        : `${gene.chromosome}:${gene.start}-${gene.end}`;

                      const rowKey = `${group.key}-${i}`;

                      let detailsPageLink = null;

                      if (protein.start && protein.variant) {
                        const varSTRes = protein.variant
                          .split('/')
                          .join(protein.start.toString());

                        const detailsPageURL = `https://www.ebi.ac.uk/thornton-srv/databases/cgi-bin/DisaStr/GetPage.pl?uniprot_acc=${protein.accession.toUpperCase()}&template=resreport.html&res=${varSTRes}`;
                        detailsPageLink = (
                          <a
                            className="details-page-link"
                            href={detailsPageURL}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Details
                          </a>
                        );
                      }

                      significances.transcript
                        .forEach((t) => {
                          t.hgvsg = gene.hgvsg;
                          t.hgvsp = gene.hgvsp;
                          t.canonical = protein.canonical;
                          t.codons = gene.codons;
                          t.aminoAcids = protein.variant;
                          t.enspId = protein.ensp;
                          t.enstId = gene.enstId;
                          t.ensgId = gene.ensgId;
                          t.start = protein.start;
                          t.end = protein.end;
                          t.cosmicId = variation.cosmicId;
                          t.dbSNIPId = variation.dbSNIPId;
                          t.clinVarId = variation.clinVarId;
                          t.uniProtVariationId = variation.uniProtVariationId;
                          t.colocatedVariantsCount = variation.proteinColocatedVariantsCount;
                          t.diseaseColocatedVariantsCount = variation
                            .diseasAssociatedProteinColocatedVariantsCount;
                        });

                      if (typeof significances.structural !== 'undefined') {
                        significances.structural.position = protein.start;
                      }

                      if (typeof significances.clinical !== 'undefined') {
                        significances.clinical.colocatedVariantsCount = variation
                          .proteinColocatedVariantsCount;

                        significances.clinical.diseaseColocatedVariantsCount = variation
                          .diseasAssociatedProteinColocatedVariantsCount;
                      }

                      const caddColour = (significances.transcript[0].caddPhred <= 30)
                        ? 'green'
                        : 'red';

                      counter += 1;

                      let { accession } = protein;

                      if (protein.canonical) {
                        accession = protein.canonicalAccession;
                      } else if (protein.isoform) {
                        accession = protein.isoform;
                      }

                      const noSignificance = <span className="no-significances">-</span>;

                      const transcriptSignificancesButton = (
                        <Button
                          onClick={() => this.toggleSignificanceRow(rowKey, 'transcript')}
                          className="button--significances button--transcript"
                        >
T
                        </Button>
                      );

                      const functionalSignificancesButton = (
                        <Button
                          onClick={() => this.toggleSignificanceRow(rowKey, 'functional')}
                          className="button--significances button--positional"
                        >
F
                        </Button>
                      );

                      const clinicalSignificancesButton = (
                        <Button
                          onClick={() => this.toggleSignificanceRow(rowKey, 'clinical')}
                          className="button--significances button--clinical"
                        >
C
                        </Button>
                      );

                      const structuralSignificancesButton = (
                        <Button
                          onClick={() => this.toggleSignificanceRow(rowKey, 'structural')}
                          className="button--significances button--structural"
                        >
S
                        </Button>
                      );

                      const genomicSignificancesButton = (
                        <Button
                          onClick={() => this.toggleSignificanceRow(rowKey, 'genomic')}
                          className="button--significances button--genomic"
                        >
G
                        </Button>
                      );

                      return (
                        <Fragment key={`${rowKey}-${counter}`}>

                          <tr key={rowKey}>
                            <td className="row-counter">
                              {(protein.canonical && !showAllIsoforms) ? '+' : null}
                              {(protein.canonical && showAllIsoforms) ? '-' : null}
                            </td>
                            <td>
                              {(significances.transcript && significances.transcript[0].caddPhred)
                                ? (
                                  <span
                                    className={`label warning cadd-score cadd-score--${caddColour}`}
                                    title={`Likely ${(significances.transcript[0].caddPhred < 30) ? 'Benign' : 'Deleterious'}`}
                                  >
                                    {significances.transcript[0].caddPhred}
                                  </span>
                                ) : '-'
                              }
                            </td>
                            <td>{gene.symbol}</td>
                            <td>
                              {(protein.length && proteinPosition)
                                ? (
                                  <Fragment>
                                    <ProteinReviewStatus type={protein.type} />
                                    {accession}
                                  </Fragment>
                                ) : '-'
                              }
                            </td>
                            <td>{protein.length || '-'}</td>
                            <td>{proteinPosition || '-'}</td>
                            <td>
                              <span title={protein.variant || '-'}>{protein.threeLetterCodes || '-'}</span>
                            </td>
                            <td>{gene.ensgId}</td>
                            <td>{gene.enstId}</td>
                            <td>{geneLocation}</td>
                            <td>{gene.allele}</td>
                            <td className="fit">
                              {significances.transcript
                                ? transcriptSignificancesButton
                                : noSignificance
                              }
                            </td>
                            <td className="fit">
                              {significances.structural
                                ? structuralSignificancesButton
                                : noSignificance
                              }
                            </td>
                            <td className="fit">
                              {significances.functional
                                ? functionalSignificancesButton
                                : noSignificance
                              }
                            </td>
                            <td className="fit">
                              {significances.clinical
                                ? clinicalSignificancesButton
                                : noSignificance
                              }
                            </td>
                            <td className="fit">
                              {significances.genomic
                                ? genomicSignificancesButton
                                : noSignificance
                              }
                            </td>
                          </tr>

                          {(`${rowKey}:functional` === expandedRow)
                            ? (
                              <ExpandedFunctionalSignificance
                                data={significances.functional}
                                detailsLink={detailsPageLink}
                              />
                            ) : null }

                          {(`${rowKey}:clinical` === expandedRow)
                            ? (
                              <ExpandedClinicalSignificance
                                data={significances.clinical}
                                detailsLink={detailsPageLink}
                              />
                            ) : null }

                          {(`${rowKey}:transcript` === expandedRow)
                            ? (
                              <ExpandedTranscriptSignificance
                                data={significances.transcript}
                                detailsLink={detailsPageLink}
                              />
                            ) : null }

                          {(`${rowKey}:structural` === expandedRow)
                            ? (
                              <ExpandedStructuralSignificance
                                data={significances.structural}
                                detailsLink={detailsPageLink}
                              />
                            ) : null }

                          {(`${rowKey}:genomic` === expandedRow)
                            ? (
                              <ExpandedGenomicSignificance
                                data={significances.genomic}
                                detailsLink={detailsPageLink}
                              />
                            ) : null }
                        </Fragment>
                      );
                    })}
                  </Fragment>
                );
              })}
          </tbody>
        </table>
      </div>
    );
  }
}

ImpactSearchResults.propTypes = {
  rows: PropTypes.objectOf(PropTypes.shape({
    gene: PropTypes.shape({
      allele: PropTypes.string,
      chromosome: PropTypes.string,
      codons: PropTypes.string,
      end: PropTypes.number,
      ensgId: PropTypes.string,
      enstId: PropTypes.string,
      hgvsg: PropTypes.string,
      hgvsp: PropTypes.string,
      source: PropTypes.string,
      start: PropTypes.number,
      symbol: PropTypes.string,
    }),
    protein: PropTypes.shape({
      accession: PropTypes.string,
      isoform: PropTypes.string,
      canonical: PropTypes.bool,
      canonicalAccession: PropTypes.string,
      end: PropTypes.number,
      length: PropTypes.number,
      name: PropTypes.shape({
        full: PropTypes.string,
        short: PropTypes.string,
      }),
      start: PropTypes.number,
      threeLetterCodes: PropTypes.string,
      variant: PropTypes.string,
      enspId: PropTypes.string,
    }),
    significances: PropTypes.shape({}),
  })),
  handleDownload: PropTypes.func.isRequired,
};

ImpactSearchResults.defaultProps = {
  rows: {},
};

export default ImpactSearchResults;
