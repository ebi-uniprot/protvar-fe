import React from 'react';
import PropTypes from 'prop-types';

import { v1 as uuidv1 } from 'uuid';

const SignificanceDataLine = (props) => {
  const {
    label,
    alternativeLabelStyle,
  } = props;

  let { value } = props;

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

  if (Array.isArray(value)) {
    value = value.map(i => <span key={uuidv1()}>{i}</span>);
  }

  return (
    <div key={uuidv1()}>
      {labelEl}
      <span key={uuidv1()}>{value}</span>
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
    PropTypes.number,
  ]),
  alternativeLabelStyle: PropTypes.bool,
};

SignificanceDataLine.defaultProps = {
  alternativeLabelStyle: false,
  value: null,
};

export default SignificanceDataLine;
