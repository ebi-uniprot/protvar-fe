
import React, { Component, Fragment } from 'react';

import DefaultPageLayout from '../layout/DefaultPageLayout';
import ImpactSearchResults from '../components/search/ImpactSearchResults';

const SearchResultsPageContent = props => {
console.log("results:", props);
  const { searchResults } = props;
  // return (
  //   <ImpactSearchResults
  //     rows={searchResults.proteins}
  //   />
  // );

  return (
    <ImpactSearchResults
      rows={searchResults}
    />
  );
};

const SearchResultsPage = props => (
  <DefaultPageLayout
    title="Search"
    content={<SearchResultsPageContent {...props} />}
  />
);

export default SearchResultsPage;
