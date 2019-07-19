import React from 'react';
import PropTypes from 'prop-types';

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
    ? <span className="alternative-label-style">{label}: </span>
    : <b>{label}: </b>;

  return (
    <div>
      {labelEl}
      <span>{value}</span>
    </div>
  );
}

SignificanceDataLine.propTypes = {

};

export default SignificanceDataLine;
