import React from 'react';
import PropTypes from 'prop-types';

import SignificancesColumn from './SignificancesColumn';
import SignificanceDataLine from './SignificanceDataLine';

const VariantIDsBlock = (props) => {
  const {
    data,
  } = props;

  return (
    <SignificancesColumn
      header="Variant IDs"
    >
      <SignificanceDataLine
        label="RsID"
        value={(data.dbSNIPId) ? data.dbSNIPId : '-'}
      />

      <SignificanceDataLine
        label="ClinVar"
        value={(data.clinVarId) ? data.clinVarId : '-'}
      />

      <SignificanceDataLine
        label="COSMIC"
        value={(data.cosmicId) ? data.cosmicId : '-'}
      />
    </SignificancesColumn>
  );
}

VariantIDsBlock.propTypes = {

};

export default VariantIDsBlock;
