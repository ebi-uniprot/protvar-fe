import React from 'react';
import PropTypes from 'prop-types';

import SignificancesColumn from './SignificancesColumn';
import SignificanceDataLine from './SignificanceDataLine';

const VariantIDsBlock = (props) => {
  const {
    data,
  } = props;

  const clinVarLinks = (data.clinVarIDs) && data.clinVarIDs
    .map(cv => (
      <li key={`${cv.id}-${cv.dbSNIPId}`}>
        <a
          href={`https://www.ncbi.nlm.nih.gov/clinvar?term=${cv.dbSNIPId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {cv.id}
        </a>
      </li>
    ));

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
        value={(clinVarLinks) ? <ul>{clinVarLinks}</ul> : '-'}
      />

      <SignificanceDataLine
        label="COSMIC"
        value={(data.cosmicId) ? data.cosmicId : '-'}
      />
    </SignificancesColumn>
  );
};

VariantIDsBlock.propTypes = {
  data: PropTypes.shape({
    clinVarIDs: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      dbSNIPId: PropTypes.string,
    })),
    // clinVarIDs: PropTypes.arrayOf(PropTypes.string),
    dbSNIPId: PropTypes.string,
    cosmicId: PropTypes.string,
  }),
};

VariantIDsBlock.defaultProps = {
  data: {
    clinVarIDs: [],
    dbSNIPId: null,
    cosmicId: null,
  },
};

export default VariantIDsBlock;
