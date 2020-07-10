
import React from 'react';
import PropTypes from 'prop-types';

import ColocatedDomainsAndSitesBlock from './ColocatedDomainsAndSitesBlock';
import ColocatedVariantsBlock from './ColocatedVariantsBlock';
import ColocatedPTMsBlock from './ColocatedPTMsBlock';
import ColocatedMoleculeProcessing from './ColocatedMoleculeProcessing';

const ExpandedFunctionalSignificance = (props) => {
  const { data, detailsLink } = props;

  return (
    <tr>
      <td colSpan="16">
        <span className="expanded-section-title">Functional Protein Level Impact</span>
        {detailsLink}

        <div className="significances-groups">

          <ColocatedDomainsAndSitesBlock data={data.features} />

          <ColocatedVariantsBlock data={data} />

          <ColocatedPTMsBlock data={data.features} />

          <ColocatedMoleculeProcessing data={data.features} />

        </div>
      </td>
    </tr>
  );
};

ExpandedFunctionalSignificance.propTypes = {
  data: PropTypes.shape({
    features: PropTypes.arrayOf(PropTypes.shape({
      begin: PropTypes.number,
      category: PropTypes.string,
      description: PropTypes.string,
      end: PropTypes.number,
      evidences: PropTypes.arrayOf(PropTypes.shape({})),
      type: PropTypes.string,
      typeDescription: PropTypes.string,
    })),
  }),
  detailsLink: PropTypes.element.isRequired,
};

ExpandedFunctionalSignificance.defaultProps = {
  data: {},
};

export default ExpandedFunctionalSignificance;
