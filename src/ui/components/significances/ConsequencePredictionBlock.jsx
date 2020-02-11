import React from 'react';
import PropTypes from 'prop-types';

import SignificancesColumn from './SignificancesColumn';
import SignificanceDataLine from './SignificanceDataLine';

const ConsequencePredictionBlock = ({ data }) => {
  let siftValue = 'Not reported';
  let polyphenValue = 'Not reported';

  if (data.siftPrediction && data.siftScore) {
    siftValue = `${data.siftPrediction} (${data.siftScore})`;
  }

  if (data.polyphenPrediction && data.polyphenScore) {
    polyphenValue = `${data.polyphenPrediction} (${data.polyphenScore})`;
  }

  return (
    <SignificancesColumn
      header="Consequence Prediction"
    >
      <SignificanceDataLine
        label="SIFT"
        value={siftValue}
      />

      <SignificanceDataLine
        label="Polyphen"
        value={polyphenValue}
      />

      <SignificanceDataLine
        label="CADD"
        value={data.caddPhred || 'Not reported'}
      />
    </SignificancesColumn>
  );
};

ConsequencePredictionBlock.propTypes = {
  data: PropTypes.shape({
    siftPrediction: PropTypes.string,
    siftScore: PropTypes.number,
    polyphenPrediction: PropTypes.string,
    polyphenScore: PropTypes.number,
    caddPhred: PropTypes.number,
  }),
};

ConsequencePredictionBlock.defaultProps = {
  data: {},
};

export default ConsequencePredictionBlock;
