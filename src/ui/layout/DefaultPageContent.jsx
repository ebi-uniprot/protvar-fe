
import React from 'react';
import PropTypes from 'prop-types';

const DefaultPageContent = props => (
  <div className="default-page-conent">
    {props.children}
  </div>
);

DefaultPageContent.propTypes = {
  children: PropTypes.node,
};

DefaultPageContent.defaultProps = {
  children: 'Default Page Content',
};

export default DefaultPageContent;
