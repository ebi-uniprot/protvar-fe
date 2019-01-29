
import React from 'react';

const ExpandedTranscriptSignificance = props => {
  const { data } = props;
  return (
    <tr>
      <td colSpan="11">
        <h4>Transcript Significances</h4>
        <br />
        { data.map(ts => {
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

export default ExpandedTranscriptSignificance;
