import React from 'react';
import PropTypes from 'prop-types';

import SignificancesColumn from './SignificancesColumn';
import SignificanceDataLine from './SignificanceDataLine';
import SingleColocatedVariantDetails from './SingleColocatedVariantDetails';
import {
  variationIDsPropTypes,
  variationIDsDefaultProps,
  variationPropTypes,
  variationDefaultProps,
} from '../../other/sharedProps';

const VariantDetailsBlock = ({
  data,
  variation,
  gene,
}) => {
  if (!data.variationDetails || !data.variationDetails.ids) {
    return null;
  }

  const {
    clinVarIDs,
    dbSNIPId,
    cosmicId,
  } = data.variationDetails.ids;

  const clinVarLinks = clinVarIDs && clinVarIDs
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

  const dbSNIPIdLink = dbSNIPId
    ? (
      <a
        href={`https://www.ncbi.nlm.nih.gov/SNP/snp_ref.cgi?type=rs&rs=${dbSNIPId}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {dbSNIPId}
      </a>
    )
    : 'Not reported';

  return (
    <SignificancesColumn
      header="Variant Details"
    >
      {gene && (
        <SignificanceDataLine
          label="ENSG"
          value={gene.ensgId}
        />
      )}

      <SingleColocatedVariantDetails
        colocated={variation.variationDetails}
        meta={data.variationDetails}
        excludeIds
      />

      <SignificanceDataLine
        label="RsID"
        value={dbSNIPIdLink}
      />

      <SignificanceDataLine
        label="ClinVar"
        value={(clinVarLinks && clinVarLinks.lenght > 0) ? <ul>{clinVarLinks}</ul> : 'Not reported'}
      />

      <SignificanceDataLine
        label="COSMIC"
        value={cosmicId || 'Not reported'}
      />
    </SignificancesColumn>
  );
};

VariantDetailsBlock.propTypes = {
  data: PropTypes.shape({
    variationDetails: variationIDsPropTypes,
  }),
  variation: variationPropTypes,
  gene: PropTypes.shape({
    ensgId: PropTypes.string,
  }),
};

VariantDetailsBlock.defaultProps = {
  data: {
    variationDetails: variationIDsDefaultProps,
  },
  variation: variationDefaultProps,
  gene: {},
};

export default VariantDetailsBlock;
