import React from 'react';

const Modal = ({ handleClose, show, children }) => {
	const showHideClassName = show ? 'modal2 d-block' : 'modal2 d-none';

	return (
		<div className={showHideClassName}>
			<div className="modal-container2">{children}</div>
		</div>
	);
};

export default Modal;
