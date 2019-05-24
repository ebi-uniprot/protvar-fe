import React from 'react';
import PropTypes from 'prop-types';

import { removeSnakeAndKebabCases } from '../../other/helpers';

const ExpandedClinicalSignificance = (props) => {
  const { data } = props;
console.log("CS DATA:", data);
  return (
    <tr>
      <td colSpan="11">
        <span className="expanded-section-title">Clinical Significances</span>
        {(data.colocatedVariantsCount > 0) &&
          <span className="expanded-section-subtitle">
            {data.colocatedVariantsCount} Co-located Variant(s)
            {(data.diseaseColocatedVariantsCount > 0) &&
              <span>&nbsp;({data.diseaseColocatedVariantsCount} disease associated)</span>
            }
          </span>
        }
        {props.detailsLink}

        <div className="significances-groups">
          <div className="column">
            <b>Disease Summary</b>

            <div>
              {(data.association.length > 0)
                ? <span className="publications-label">Associated to disease</span>
                : <span>No disease association</span>}
            </div>

            <br />
            <div className="capital-text">
              <b>
                {(data.categories.length > 0)
                  ? data.categories
                    .map(c => removeSnakeAndKebabCases(c))
                    .join(', ')
                  : null}
              </b>
            </div>

            <div className="associated-disease-list">
              {data.association.map((a, i) => {
                const links = a.evidences.map(({ source }) => {
                  if (source.name === 'pubmed') {
                    return <a href={`${source.url}`} target="_blank">{source.name}</a>;
                  }

                  if (source.name === 'ClinVar') {
                    return (
                      <a
                        href={`https://www.ncbi.nlm.nih.gov/clinvar/${source.id}/`}
                        target="_target"
                      >
                        {source.name}
                      </a>
                    );
                  }

                  return null;
                });

                return (
                  <div className="associated-disease">
                    {`Disease #${i + 1}`}: {a.name}.<br />
                    <span className="publications-label">{links.length} Evidence(s)</span>
                  </div>
                );
              })}
            </div>

          </div>
          <div className="column">
            <b>Drugs & Therapies</b>
            <div className="significance-data-block" />
          </div>
          <div className="column">
            <b>Tissue and Subcellular Specificity</b>
          </div>
        </div>
      </td>
    </tr>
  );
};

ExpandedClinicalSignificance.propTypes = {
  data: PropTypes.shape({
    association: PropTypes.arrayOf(PropTypes.shape({
      description: PropTypes.string,
      disease: PropTypes.bool,
      evidences: PropTypes.arrayOf(PropTypes.shape({
        code: PropTypes.string,
        source: PropTypes.shape({
          alternativeUrl: PropTypes.string,
          id: PropTypes.string,
          name: PropTypes.string,
          url: PropTypes.string,
        }),
        name: PropTypes.string,
        xrefs: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.string,
          name: PropTypes.string,
          url: PropTypes.string,
        })),
      })),
    })),
    categories: PropTypes.arrayOf(PropTypes.string),
    colocatedVariantsCount: PropTypes.number,
    diseaseColocatedVariantsCount: PropTypes.number,
  }),
  detailsLink: PropTypes.element.isRequired,
};

ExpandedClinicalSignificance.defaultProps = {
  data: {},
};

export default ExpandedClinicalSignificance;
