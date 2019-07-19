import React from 'react';
import PropTypes from 'prop-types';

import SignificancesColumn from './SignificancesColumn';
import SignificanceDataLine from './SignificanceDataLine';

const ConsequencePredictionBlock = (props) => {
  const {
    data,
  } = props;

  return (
    <SignificancesColumn
      header="Consequence Prediction"
    >
      <SignificanceDataLine
        label="SIFT"
        value={`${data.siftPrediction} (${data.siftScore})`}
      />

      <SignificanceDataLine
        label="Polyphen"
        value={`${data.polyphenPrediction} (${data.polyphenScore})`}
      />

      <SignificanceDataLine
        label="CADD"
        value={`${data.caddPhred}`}
      />
    </SignificancesColumn>
  );
}

ConsequencePredictionBlock.propTypes = {

};

export default ConsequencePredictionBlock;
