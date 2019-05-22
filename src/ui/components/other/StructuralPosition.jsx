import React from 'react';
import PropTypes from 'prop-types';

const StructuralPosition = (props) => {
  const {
    proteinLength,
    structureStart,
    structureEnd,
    position,
  } = props;

  const pixelLength = 200;
  const positionMarker = (position / proteinLength) * pixelLength;
  const structureLeft = (structureStart / proteinLength) * pixelLength;
  const structureRight = (structureEnd / proteinLength) * pixelLength;
  const structureWidth = structureRight - structureLeft;

  return (
    <div className="structural-position">
      <div
        className="protein-sequence-line"
        style={{ width: `${pixelLength}px`}}
      />
      <div
        className="structure-coverage"
        style={{ left: `${structureLeft}px`, width: `${structureWidth}px`}}
      />
      <div
        className="variant-marker"
        style={{ left: `${positionMarker}px` }}
      />
    </div>
  );
};

StructuralPosition.propTypes = {
  proteinLength: PropTypes.number,
  structureStart: PropTypes.number,
  structureEnd: PropTypes.number,
  position: PropTypes.number,
};

StructuralPosition.defaultProps = {

};

export default StructuralPosition;
