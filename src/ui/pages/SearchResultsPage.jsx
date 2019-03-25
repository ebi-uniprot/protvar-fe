
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
    rows: PropTypes.arrayOf(PropTypes.shape({
      gene: PropTypes.shape({
        allele: PropTypes.string,
        chromosome: PropTypes.string,
        codons: PropTypes.string,
        end: PropTypes.number,
        ensgId: PropTypes.string,
        enstId: PropTypes.string,
        hgvsg: PropTypes.string,
        hgvsp: PropTypes.string,
        source: PropTypes.string,
        start: PropTypes.number,
        symbol: PropTypes.string,
      }).isRequired,
      protein: PropTypes.shape({
        accession: PropTypes.string,
        canonical: PropTypes.bool,
        end: PropTypes.number,
        length: PropTypes.number,
        name: PropTypes.shape({
          full: PropTypes.string,
          short: PropTypes.string,
        }),
        start: PropTypes.number,
        threeLetterCodes: PropTypes.string,
        variant: PropTypes.string,
      }).isRequired,
      significances: PropTypes.shape({}),
    })),
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
