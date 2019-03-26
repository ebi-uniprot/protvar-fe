
import React from 'react';
import PropTypes from 'prop-types';

import DefaultPageLayout from '../layout/DefaultPageLayout';
import ImpactSearchResults from '../components/search/ImpactSearchResults';

const SearchResultsPageContent = (props) => {
  console.log('results:', props);
  const { searchResults, handleDownload } = props;
  return (
    <ImpactSearchResults
      rows={searchResults}
      handleDownload={handleDownload}
    />
  );
};

SearchResultsPageContent.propTypes = {
  searchResults: PropTypes.objectOf(PropTypes.shape({
    input: PropTypes.string,
    key: PropTypes.string,
    rows: PropTypes.arrayOf(PropTypes.shape({})),
  })).isRequired,
  handleDownload: PropTypes.func.isRequired,
};

const SearchResultsPage = props => (
  <DefaultPageLayout
    title="Search"
    content={<SearchResultsPageContent {...props} />}
  />
);

export default SearchResultsPage;
