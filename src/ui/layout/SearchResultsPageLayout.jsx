
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import DefaultPageContent from './DefaultPageContent';

const SearchResultsPageLayout = (props) => {
  const { content } = props;

  return (
    <div className="search-results-page-layout">
      <b>Search Results: </b>
      <Link to="/">Go back to Home page</Link>

      <DefaultPageContent>
        {content}
      </DefaultPageContent>
    </div>
  );
};

SearchResultsPageLayout.propTypes = {
  content: PropTypes.element,
};

SearchResultsPageLayout.defaultProps = {
  content: () => <h3>Page Content</h3>,
};

export default SearchResultsPageLayout;
