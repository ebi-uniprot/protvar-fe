
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
      significances: PropTypes.shape({
        positional: PropTypes.shape({
          features: PropTypes.arrayOf(PropTypes.shape({
            begin: PropTypes.string,
            category: PropTypes.string,
            description: PropTypes.string,
            end: PropTypes.string,
            evidences: PropTypes.arrayOf(PropTypes.shape({})),
            type: PropTypes.string,
            typeDescription: PropTypes.string,
          })),
        }),
        structural: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.string,
          method: PropTypes.string,
          range: PropTypes.arrayOf(PropTypes.number),
        })),
        transcript: PropTypes.arrayOf(PropTypes.shape({
          aminoAcids: PropTypes.string,
          appris: PropTypes.string,
          biotype: PropTypes.string,
          blosum62: PropTypes.number,
          caddPhred: PropTypes.number,
          caddRaw: PropTypes.number,
          canonical: PropTypes.bool,
          codons: PropTypes.string,
          consequenceTerms: PropTypes.arrayOf(PropTypes.string),
          end: PropTypes.number,
          fathmmPrediction: PropTypes.string,
          fathmmScore: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
          hgvsg: PropTypes.string,
          hgvsp: PropTypes.string,
          impact: PropTypes.string,
          lrtPrediction: PropTypes.string,
          lrtScore: PropTypes.number,
          mostSevereConsequence: PropTypes.string,
          mutPredScore: PropTypes.number,
          mutationTasterPrediction: PropTypes.string,
          mutationTasterScore: PropTypes.string,
          polyphenPrediction: PropTypes.string,
          polyphenScore: PropTypes.number,
          proveanPrediction: PropTypes.string,
          proveanScore: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
          siftPrediction: PropTypes.string,
          siftScore: PropTypes.number,
          start: PropTypes.number,
          tsl: PropTypes.number,
        })),
        clinical: PropTypes.shape({
          association: PropTypes.arrayOf(PropTypes.shape({
            description: PropTypes.string,
            disease: PropTypes.bool,
            evidences: PropTypes.arrayOf(PropTypes.shape({
              code: PropTypes.string,
              source: PropTypes.shape({
                alternativeUrl: PropTypes.string,
                id: PropTypes.string,
                name: PropTypes.string,
                url: PropTypes.string,
              }),
              name: PropTypes.string,
              xrefs: PropTypes.arrayOf(PropTypes.shape({
                id: PropTypes.string,
                name: PropTypes.string,
                url: PropTypes.string,
              })),
            })),
          })),
          categories: PropTypes.arrayOf(PropTypes.string),
        }),
      }),
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
