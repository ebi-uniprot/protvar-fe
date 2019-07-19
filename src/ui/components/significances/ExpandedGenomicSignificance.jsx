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
          key={`genomic-significances-group-wrapper-${1}`}
        >
          <PopulationFrequencyBlock data={data.populationFrequencies} />

          <ConsequencePredictionBlock data={data.consequencePrediction} />

          <VariantIDsBlock data={data} />
        </div>
      </td>
    </tr>
  );
};

ExpandedGenomicSignificance.propTypes = {};

ExpandedGenomicSignificance.defaultProps = {};

export default ExpandedGenomicSignificance;
