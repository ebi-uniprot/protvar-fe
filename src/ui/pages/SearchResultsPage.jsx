import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import DefaultPageLayout from '../layout/DefaultPageLayout';
import ImpactSearchResults from '../components/search/ImpactSearchResults';
import Alert from '../components/other/Alert';

const SearchResultsPageContent = (props) => {
	const { searchResults, handleDownload, fetchNextPage, file, page, errors, loading } = props;

	return (
		<Fragment>
			{errors && errors.map((e) => <Alert {...e} key={window.btoa(e.message)} />)}

			<ImpactSearchResults
				rows={searchResults}
				handleDownload={handleDownload}
				fetchNextPage={fetchNextPage}
				file={file}
				page={page}
				loading={loading}
			/>
		</Fragment>
	);
};

SearchResultsPageContent.propTypes = {
	searchResults: PropTypes.objectOf(
		PropTypes.shape({
			input: PropTypes.string,
			key: PropTypes.string,
			rows: PropTypes.arrayOf(PropTypes.shape({}))
		})
	).isRequired,
	handleDownload: PropTypes.func.isRequired,
	errors: PropTypes.arrayOf(
		PropTypes.shape({
			title: PropTypes.string,
			message: PropTypes.string.isRequired
		})
	).isRequired
};

const SearchResultsPage = (props) => (
	<DefaultPageLayout title="Search" content={<SearchResultsPageContent {...props} />} />
);

export default SearchResultsPage;
