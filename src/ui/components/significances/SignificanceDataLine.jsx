import React from 'react';
import PropTypes from 'prop-types';

import { v1 as uuidv1 } from 'uuid';

const SignificanceDataLine = (props) => {
	const { label, alternativeLabelStyle } = props;

	const { value, link } = props;
	const refLink = link + value;

	if (!value) {
		return null;
	}

	const labelEl = alternativeLabelStyle ? (
		<span key={uuidv1()} className="alternative-label-style">
			{`${label}: `}
		</span>
	) : (
		<b key={uuidv1()}>{`${label}: `}</b>
	);

	return (
		<div key={uuidv1()}>
			{labelEl}
			{Array.isArray(value) ? (
				<ul>
					{value.map((i) => (
						<li key={uuidv1()}>
							<a href={link + i} target="_blank">
								{i}
							</a>
						</li>
					))}
				</ul>
			) : (
				<span key={uuidv1()}>
					<a href={refLink} target="_blank">
						{value}
					</a>
				</span>
			)}
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
		PropTypes.number
	]),
	alternativeLabelStyle: PropTypes.bool
};

SignificanceDataLine.defaultProps = {
	alternativeLabelStyle: false,
	value: null
};

export default SignificanceDataLine;
