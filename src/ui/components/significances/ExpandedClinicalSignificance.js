
import React from 'react';

const ExpandedClinicalSignificance = props => {
  const { data } = props;
  return (
    <tr>
      <td colSpan="11">
        <h4>Clinical Significances</h4>
        <span>{data.categories.join(', ')}</span>
        <br />
        Association:
        <ul>
          {data.association.map(a => {
            const links = a.evidences.map(({ source }) => {
              if ('pubmed' === source.name) {
                return <a href={`${source.url}`} target="_blank">{source.name}</a>;
              }

              if ('ClinVar' === source.name) {
                return <a href={`https://www.ncbi.nlm.nih.gov/clinvar/${source.id}/`} target="_target">{source.name}</a>;
              }
            });

            return <li>{a.name}. {links}</li>;
          })}
        </ul>
      </td>
    </tr>
  );
}

export default ExpandedClinicalSignificance;
