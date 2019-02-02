
import React from 'react';

import { removeSnakeAndKebabCases } from '../../other/helpers';

const ExpandedTranscriptSignificance = props => {
  const { data } = props;
  return (
    <tr>
      <td colSpan="11">
        <h4>Transcript Significances</h4>

        { data.map(ts => {
          return (
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
                    ? (<div className="positional-feature-position2">
                        <span>Start: {ts.start}</span>
                        {(ts.start !== ts.end)
                          ? <span>End: {ts.end}</span>
                          : null}
                      </div>)
                    : null}
              </div>

              <div className="column">
                <b>Consequence Predections</b>

                <div className="significance-data-block">
                  {(ts.siftPrediction)
                    ? (<div>
                        <span>SIFT: </span>
                        <span className="capital-text">{removeSnakeAndKebabCases(ts.siftPrediction)}, {ts.siftScore}</span>
                      </div>)
                    : null}

                  {(ts.polyphenPrediction)
                    ? (<div>
                        <span>Polyphen: </span>
                        <span className="capital-text">{removeSnakeAndKebabCases(ts.polyphenPrediction)}, {ts.polyphenScore}</span>
                      </div>)
                    : null}

                  <span className="publications-label">Other Predections: NA</span>
                </div>

                {/* <div className="significance-data-block">
                  <b>Other Predections</b>
                  <div>Data Not Available</div>
                </div> */}
              </div>
            </div>
          );
        })}
      </td>
    </tr>
  );
}

export default ExpandedTranscriptSignificance;
