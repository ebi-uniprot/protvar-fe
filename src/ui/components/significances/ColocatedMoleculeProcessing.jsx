import React from 'react';
import PropTypes from 'prop-types';

import { v1 as uuidv1 } from 'uuid';

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
        .map(f => <ColocatedFeatureDataBlock key={uuidv1()} data={f} />)
      }
    </SignificancesColumn>
  );
};

ColocatedMoleculeProcessing.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})),
};

ColocatedMoleculeProcessing.defaultProps = {
  data: [],
};


export default ColocatedMoleculeProcessing;
