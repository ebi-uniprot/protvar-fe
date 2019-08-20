import React from 'react';
import PropTypes from 'prop-types';

import SignificancesColumn from './SignificancesColumn';
import SignificanceDataLine from './SignificanceDataLine';

const TranslationInfoBlock = (props) => {
  const {
    data,
  } = props;

  const changePosition = (data.start === data.end)
    ? data.start
    : data.end;

  const aaChangeAndPositoin = (data.aminoAcids)
    ? data.aminoAcids.replace('/', changePosition)
    : '-';

  return (
    <SignificancesColumn
      header="Translation Info"
    >
      <SignificanceDataLine
        label="aa change and position"
        value={aaChangeAndPositoin}
      />

      <SignificanceDataLine
        label="HGSVp"
        value={data.hgvsp}
      />
    </SignificancesColumn>
  );
};

TranslationInfoBlock.propTypes = {
  data: PropTypes.shape({
    start: PropTypes.number,
    end: PropTypes.number,
    aminoAcids: PropTypes.string,
    hgvsp: PropTypes.string,
  }),
};

TranslationInfoBlock.defaultProps = {
  data: {},
};

export default TranslationInfoBlock;
