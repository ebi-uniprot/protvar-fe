import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import DefaultPageLayout from '../layout/DefaultPageLayout';
import TextAreaSearch from '../components/search/TextAreaSearch';

const HomePageContent = (props) => {
	const { handleSearch, loading, isFileSelected } = props;

	return (
		<Fragment>
			<TextAreaSearch onSubmit={handleSearch} isLoading={loading} isFileSelected={isFileSelected} />
		</Fragment>
	);
};

HomePageContent.propTypes = {
	handleSearch: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired
};

const HomePage = (props) => <DefaultPageLayout title="Home Page" content={<HomePageContent {...props} />} />;

export default HomePage;
