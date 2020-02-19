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
      <li key={`${cv.id}-${cv.dbSNPId}`}>
        <a
          href={`https://www.ncbi.nlm.nih.gov/clinvar?term=${cv.dbSNPId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {cv.id}
        </a>
      </li>
    ));

  const dbSNPIdLink = data.dbSNPId
    ? (
      <a
        href={`https://www.ncbi.nlm.nih.gov/SNP/snp_ref.cgi?type=rs&rs=${data.dbSNPId}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {data.dbSNPId}
      </a>
    )
    : '-';

  return (
    <SignificancesColumn
      header="Variant IDs"
    >
      <SignificanceDataLine
        label="RsID"
        value={dbSNPIdLink}
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
      id: PropTypes.string.isRequired,
      dbSNPId: PropTypes.string.isRequired,
    })),
    dbSNPId: PropTypes.string,
    cosmicId: PropTypes.string,
  }),
};

VariantIDsBlock.defaultProps = {
  data: {
    clinVarIDs: [],
    dbSNPId: null,
    cosmicId: null,
  },
};

export default VariantIDsBlock;
