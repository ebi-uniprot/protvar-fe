
import React from 'react';
import PropTypes from 'prop-types';

const Button = props => (
  <button
    className="button"
    type={props.type}
    onClick={props.onClick}
  >
    { props.children }
  </button>
);

Button.propTypes = {
  children: PropTypes.node,
  type: PropTypes.string,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  children: 'Button',
  type: 'button',
  onClick: () => undefined,
};

export default Button;
