import React from 'react';
import PropTypes from 'prop-types';

import { removeSnakeAndKebabCases } from '../../other/helpers';

const ExpandedTranscriptSignificance = (props) => {
  const { data } = props;
  return (
    <tr>
      <td colSpan="11">
        <span className="expanded-section-title">Transcript Significances</span>
        {(data[0].colocatedVariantsCount > 0) &&
          <span className="expanded-section-subtitle">
            {data[0].colocatedVariantsCount} Co-located Variant(s)
            {(data[0].diseaseColocatedVariantsCount > 0) &&
              <span>&nbsp;({data[0].diseaseColocatedVariantsCount} disease associated)</span>
            }
          </span>
        }
        {props.detailsLink}

        { data.map(ts => (
          <div className="significances-groups">
            <div className="column">
              <b>Genomic Summary</b>
              <div className="significance-data-block">
                <div>
                  <span>HGVSg: </span> {ts.hgvsg}
                </div>
                <div>
                  <span>Most Severe Consequence: </span>
                  <span className="capital-text">
                    {removeSnakeAndKebabCases(ts.mostSevereConsequence)}
                  </span>
                </div>

                <span className="publications-label">Population Frequency: NA</span>
              </div>

              {/* <div className="significance-data-block">
                  <b>Population Frequency</b>
                  <div>Data Not Available</div>
                </div> */}
            </div>

            <div className="column">
              <b>Transcript Evidences</b>
              <div className="significance-data-block">
                <div>
                  <span>Consequences: </span>
                  <span className="capital-text">
                    {ts.consequenceTerms
                        .map(ct => removeSnakeAndKebabCases(ct))
                        .join(', ')}
                  </span>
                </div>
                <div>
                  <span>Impact: </span> <span className="capital-text">{removeSnakeAndKebabCases(ts.impact)}</span>
                </div>
                <div>
                  <span>{(ts.canonical) ? 'SELECT' : 'Isoform'} Transcript</span>
                </div>
                <div>
                  {/* <span>Biotype:</span>  */}
                  <span className="capital-text">{removeSnakeAndKebabCases(ts.biotype)}</span>
                </div>
                <div>
                  {/* <span>Codons:</span>  */}{ts.codons}
                </div>
              </div>

            </div>

            <div className="column">
              <b>Translation Evidences</b>
              {(ts.aminoAcids)
                    ? <div><span>Amino Acid Change: </span> {ts.aminoAcids}</div>
                    : null}

              {(ts.hgvsp)
                    ? <div><span>HGVSp: </span> {ts.hgvsp}</div>
                    : null}

              {(ts.start)
                    ? (
                      <div className="positional-feature-position2">
                        <span>Start: {ts.start}</span>
                        {(ts.start !== ts.end)
                            ? <span>End: {ts.end}</span>
                            : null}
                      </div>
                    ) : null}
            </div>

            <div className="column">
              <b>Consequence Predections</b>

              <div className="significance-data-block">
                {(ts.caddPhred)
                    ? (
                      <div>
                        <span>CADD Phred: </span>
                        <span className="capital-text">{ts.caddPhred}</span>
                      </div>
                    ) : null}

                {(ts.caddRaw)
                    ? (
                      <div>
                        <span>CADD Raw: </span>
                        <span className="capital-text">{ts.caddRaw}</span>
                      </div>
                    ) : null}

                {(ts.siftPrediction)
                    ? (
                      <div>
                        <span>SIFT: </span>
                        <span className="capital-text">{removeSnakeAndKebabCases(ts.siftPrediction)}, {ts.siftScore}</span>
                      </div>
                    ) : null}

                {(ts.polyphenPrediction)
                    ? (
                      <div>
                        <span>Polyphen: </span>
                        <span className="capital-text">{removeSnakeAndKebabCases(ts.polyphenPrediction)}, {ts.polyphenScore}</span>
                      </div>
                    ) : null}

                <span className="publications-label">Other Predections: NA</span>
              </div>

              {/* <div className="significance-data-block">
                  <b>Other Predections</b>
                  <div>Data Not Available</div>
                </div> */}
            </div>
          </div>
          ))}
      </td>
    </tr>
  );
};

ExpandedTranscriptSignificance.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    aminoAcids: PropTypes.string,
    appris: PropTypes.string,
    biotype: PropTypes.string,
    blosum62: PropTypes.number,
    caddPhred: PropTypes.number,
    caddRaw: PropTypes.number,
    canonical: PropTypes.bool,
    codons: PropTypes.string,
    consequenceTerms: PropTypes.arrayOf(PropTypes.string),
    end: PropTypes.number,
    fathmmPrediction: PropTypes.string,
    fathmmScore: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    hgvsg: PropTypes.string,
    hgvsp: PropTypes.string,
    impact: PropTypes.string,
    lrtPrediction: PropTypes.string,
    lrtScore: PropTypes.number,
    mostSevereConsequence: PropTypes.string,
    mutPredScore: PropTypes.number,
    mutationTasterPrediction: PropTypes.string,
    mutationTasterScore: PropTypes.string,
    polyphenPrediction: PropTypes.string,
    polyphenScore: PropTypes.number,
    proveanPrediction: PropTypes.string,
    proveanScore: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    siftPrediction: PropTypes.string,
    siftScore: PropTypes.number,
    start: PropTypes.number,
    tsl: PropTypes.number,
    colocatedVariantsCount: PropTypes.number,
    diseaseColocatedVariantsCount: PropTypes.number,
  })),
  detailsLink: PropTypes.element.isRequired,
};

ExpandedTranscriptSignificance.defaultProps = {
  data: {},
};

export default ExpandedTranscriptSignificance;
