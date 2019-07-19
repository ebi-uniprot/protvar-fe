import React from 'react';
import PropTypes from 'prop-types';

const SignificanceDataBlock = (props) => {
  const { children } = props;

  return (
    <div className="significance-data-block">
      {children}
    </div>
  );
}

SignificanceDataBlock.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
};

export default SignificanceDataBlock;
