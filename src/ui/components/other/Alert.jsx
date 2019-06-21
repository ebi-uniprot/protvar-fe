
import React from 'react';
import PropTypes from 'prop-types';

const Alert = (props) => {
  const { title, message } = props;

  return (
    <div className="alert">
      {title && <div className="alert__title">{title}</div>}
      <div className="alert__message">{message}</div>
    </div>
  );
}

Alert.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
};

Alert.defaultProps = {
  title: null,
};

export default Alert;
