import React from 'react';
import PropTypes from 'prop-types';

import PopulationFrequencyBlock from './PopulationFrequencyBlock';
import ConsequencePredictionBlock from './ConsequencePredictionBlock';
import VariantIDsBlock from './VariantIDsBlock';

const ExpandedGenomicSignificance = (props) => {
  const { data, detailsLink } = props;

  return (
    <tr>
      <td colSpan="16">
        <span className="expanded-section-title">Genome Level Impact</span>
        {detailsLink}

        <div
          className="significances-groups"
          key={`genomic-significances-group-wrapper`}
        >
          <PopulationFrequencyBlock data={data.populationFrequencies} />

          <ConsequencePredictionBlock data={data.consequencePrediction} />

          <VariantIDsBlock data={data.variationDetails.ids} />
        </div>
      </td>
    </tr>
  );
};

ExpandedGenomicSignificance.propTypes = {
  detailsLink: PropTypes.element.isRequired,
  data: PropTypes.shape({
    populationFrequencies: PropTypes.shape({}),
    consequencePrediction: PropTypes.shape({}),
    variationDetails: PropTypes.shape({
      ids: PropTypes.shape({
        clinVarIDs: PropTypes.arrayOf(PropTypes.shape({})),
        cosmicId: PropTypes.string,
        dbSNPId: PropTypes.string,
        rsId: PropTypes.string,
      }),
    }),
  }),
};

ExpandedGenomicSignificance.defaultProps = {
  data: {},
};

export default ExpandedGenomicSignificance;
