import React from 'react';
import PropTypes from 'prop-types';

import { v1 as uuidv1 } from 'uuid';

const SignificanceDataLine = (props) => {
  const {
    label,
    value,
    alternativeLabelStyle,
  } = props;

  if (!value) {
    return null;
  }

  const labelEl = (alternativeLabelStyle)
    ? (
      <span key={uuidv1()} className="alternative-label-style">
        {`${label}: `}
      </span>
    )
    : (
      <b key={uuidv1()}>
        {`${label}: `}
      </b>
    );

  const valueElement = (Array.isArray(value))
    ? value.map(i => <span key={uuidv1()}>{i}</span>)
    : value;

  return (
    <div key={uuidv1()}>
      {labelEl}
      <span key={uuidv1()}>{valueElement}</span>
    </div>
  );
};

SignificanceDataLine.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object),
    PropTypes.array,
  ]),
  alternativeLabelStyle: PropTypes.bool,
};

SignificanceDataLine.defaultProps = {
  alternativeLabelStyle: false,
  value: null,
};

export default SignificanceDataLine;
