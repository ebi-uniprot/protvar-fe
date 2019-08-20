import React from 'react';
import PropTypes from 'prop-types';

const ExpandedSignificancesWrapper = (props) => {
  const { component, data } = props;
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
};

ExpandedSignificancesWrapper.propTypes = {
  component: PropTypes.node.isRequired,
  data: PropTypes.shape({
    id: PropTypes.string,
    group: PropTypes.string,
  }).isRequired,
};

export default ExpandedSignificancesWrapper;
