
import React from 'react';

import { removeSnakeAndKebabCases } from '../../other/helpers';

const ExpandedClinicalSignificance = props => {
  const { data } = props;
  return (
    <tr>
      <td colSpan="11">
        <h4>Clinical Significances</h4>

        <div className="significances-groups">
          <div className="column">
            <b>Disease Summary</b>

            <div>
              {(0 < data.association.length)
                ? <span className="publications-label">Associated to disease</span>
                : <span>No disease association</span>}
            </div>

            <br />
            <div className="capital-text">
              <b>
                {(0 < data.categories.length)
                  ? data.categories
                    // .map(c => removeSnakeAndKebabCases(c))
                    .join(', ')
                  : null}
              </b>
            </div>

            <div className="associated-disease-list">
              {data.association.map((a, i) => {
                const links = a.evidences.map(({ source }) => {
                  if ('pubmed' === source.name) {
                    return <a href={`${source.url}`} target="_blank">{source.name}</a>;
                  }

                  if ('ClinVar' === source.name) {
                    return <a href={`https://www.ncbi.nlm.nih.gov/clinvar/${source.id}/`} target="_target">{source.name}</a>;
                  }
                });

                {/* return <div className="associated-disease">{`Disease #${i + 1}`}: {a.name}.<br />{links}</div>; */}
                return (<div className="associated-disease">
                    {`Disease #${i + 1}`}: {a.name}.<br />
                    <span className="publications-label">{links.length} Evidence(s)</span>
                  </div>);
              })}
            </div>

          </div>
          <div className="column">
            <b>Drugs & Therapies</b>
            <div className="significance-data-block">

            </div>
          </div>
          <div className="column">
            <b>Tissue and Subcellular Specificity</b>
          </div>
        </div>
      </td>
    </tr>
  );
}

export default ExpandedClinicalSignificance;
