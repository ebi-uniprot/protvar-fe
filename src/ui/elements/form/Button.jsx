import React from 'react';
import PropTypes from 'prop-types';

const Button = (props) => {
	const { className, type, onClick, children } = props;

	return (
		<button data-icon="=" className={`button-new ${className}`} type={type} onClick={onClick}>
			{children}
		</button>
	);
};

Button.propTypes = {
	children: PropTypes.node,
	type: PropTypes.string,
	onClick: PropTypes.func,
	className: PropTypes.string
};

Button.defaultProps = {
	children: 'Button',
	type: 'button',
	onClick: () => {},
	className: ''
};

export default Button;
