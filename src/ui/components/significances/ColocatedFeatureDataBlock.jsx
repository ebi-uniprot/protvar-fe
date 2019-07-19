import React from 'react';
import PropTypes from 'prop-types';

import SignificanceDataLine from './SignificanceDataLine';

const ColocatedFeatureDataBlock = (props) => {
  return (
    <div
      className="significance-data-line-group"
      key={`domain-sites-${props.data.begin}-${props.data.end}`}
    >
      <SignificanceDataLine
        label="Type"
        value={props.data.type}
      />

      <SignificanceDataLine
        label="Description"
        value={props.data.description}
        alternativeLabelStyle={true}
      />

      <SignificanceDataLine
        label="aa position"
        value={`${props.data.begin}-${props.data.end}`}
        alternativeLabelStyle={true}
      />
    </div>
  );
}

ColocatedFeatureDataBlock.propTypes = {};

export default ColocatedFeatureDataBlock;
