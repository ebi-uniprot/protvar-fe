import React from 'react';
import { ButtonModal } from 'franklin-sites';

const Modal = () => {
	// const showHideClassName = show ? 'modal d-block' : 'modal d-none';

	return (
		<ButtonModal buttonText="Show pathway" className="button" title="title">
			<span>Button model content</span>
		</ButtonModal>
	);
};

export default Modal;
