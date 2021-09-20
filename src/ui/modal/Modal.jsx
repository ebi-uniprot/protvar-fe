import React from 'react';

const Modal = ({ handleClose, show, children }) => {
	const showHideClassName = show ? 'modal d-block' : 'modal d-none';

	return (
		<div className={showHideClassName}>
			<div className="modal-container">{children}</div>
		</div>
	);
};

export default Modal;
