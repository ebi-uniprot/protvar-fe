import React from 'react';
import PropTypes from 'prop-types';

const SignificancesColumn = (props) => {
  const {
    header,
    children,
  } = props;

  return (
    <div className="significances-column">
      <b>{header}</b>

      <div className="significance-data-block">
        {children}
      </div>
    </div>
  );
};

SignificancesColumn.propTypes = {
  header: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default SignificancesColumn;
