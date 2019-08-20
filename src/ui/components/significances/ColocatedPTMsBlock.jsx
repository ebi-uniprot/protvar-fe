import React from 'react';
import PropTypes from 'prop-types';

import SignificancesColumn from './SignificancesColumn';
import ColocatedFeatureDataBlock from './ColocatedFeatureDataBlock';

const ColocatedPTMsBlock = (props) => {
  const {
    data,
  } = props;

  return (
    <SignificancesColumn
      header="Colocated PTMs"
    >
      {data
        .filter(feature => feature.category === 'PTM')
        .map(f => <ColocatedFeatureDataBlock data={f} />)
      }
    </SignificancesColumn>
  );
}

ColocatedPTMsBlock.propTypes = {

};

export default ColocatedPTMsBlock;
