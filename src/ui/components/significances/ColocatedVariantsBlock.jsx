import React from 'react';
import PropTypes from 'prop-types';

import SignificancesColumn from './SignificancesColumn';
import SingleColocatedVariantDetails from './SingleColocatedVariantDetails';

const ColocatedVariantsBlock = ({ data }) => (
  <SignificancesColumn
    header="Colocated Variants"
  >
    {data.colocatedVariants
      .map((cv) => {
        const key = [
          cv.sourceType,
          cv.featureId,
          cv.wildType,
          cv.alternativeSequence,
          cv.begin,
          cv.end,
        ].join('-');

        return (
          <SingleColocatedVariantDetails
            key={key}
            colocated={cv}
            meta={data.variationDetails}
          />
        );
      })
    }
  </SignificancesColumn>
);

ColocatedVariantsBlock.propTypes = {
  data: PropTypes.shape({
    colocatedVariants: PropTypes.arrayOf(PropTypes.shape({})),
    variationDetails: PropTypes.shape({}),
  }),
};

ColocatedVariantsBlock.defaultProps = {
  data: {},
};

export default ColocatedVariantsBlock;
