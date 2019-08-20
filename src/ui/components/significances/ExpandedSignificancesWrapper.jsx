import React from 'react';
import PropTypes from 'prop-types';

const ExpandedSignificancesWrapper = (component, data) => {
  const {
    id,
    group,
  } = data;

  return (
    <div
      className="significances-groups"
      key={`${group}-significances-group-wrapper-${id}`}
    >
      {component}
    </div>
  );
}

ExpandedSignificancesWrapper.propTypes = {
  component: PropTypes.node,
  data: PropTypes.shape({
    id: PropTypes.string,
    group: PropTypes.string,
  }).isRequired,
};

export default ExpandedSignificancesWrapper;
