
import React from 'react';
import PropTypes from 'prop-types';

import DefaultPageContent from './DefaultPageContent';

const DefaultPageLayout = props => (
  <div className="default-page-layout">

    You are viewing <b>{props.title}</b>
    <br />

    <DefaultPageContent>
      {props.content}
    </DefaultPageContent>
  </div>
);

DefaultPageLayout.propTypes = {
  title: PropTypes.string,
  content: PropTypes.element,
};

DefaultPageLayout.defaultProps = {
  title: 'Page Title',
  content: () => <h3>Page Content</h3>,
};

export default DefaultPageLayout;
