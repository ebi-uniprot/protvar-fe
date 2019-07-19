import React from 'react';
import PropTypes from 'prop-types';

import SignificancesColumn from './SignificancesColumn';
import ColocatedFeatureDataBlock from './ColocatedFeatureDataBlock';

const ColocatedMoleculeProcessing = (props) => {
  const {
    data,
  } = props;

  return (
    <SignificancesColumn
      header="Colocated Molecule Processing"
    >
      {data
        .filter(feature => feature.category === 'MOLECULE_PROCESSING')
        .map(f => <ColocatedFeatureDataBlock data={f} />)
      }
    </SignificancesColumn>
  );
}

ColocatedMoleculeProcessing.propTypes = {

};

export default ColocatedMoleculeProcessing;
