
import React from 'react';
import PropTypes from 'prop-types';

const Button = props => (
  <button
    className={`button ${props.className}`}
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
  className: PropTypes.string,
};

Button.defaultProps = {
  children: 'Button',
  type: 'button',
  onClick: () => undefined,
  className: '',
};

export default Button;
