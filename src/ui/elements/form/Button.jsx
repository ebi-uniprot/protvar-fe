
import React from 'react';
import PropTypes from 'prop-types';

const Button = props => (
  <button
    onClick={props.onClick}
  >
    { props.children }
  </button>
);

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  children: 'Button',
  onClick: () => undefined,
};

export default Button;
