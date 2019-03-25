
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import DefaultPageLayout from '../layout/DefaultPageLayout';
import TextAreaSearch from '../components/search/TextAreaSearch';

const HomePageContent = (props) => {
  const { handleSearch } = props;

  return (
    <Fragment>
      <TextAreaSearch onSubmit={handleSearch} />
    </Fragment>
  );
};

HomePageContent.propTypes = {
  handleSearch: PropTypes.func.isRequired,
};

const HomePage = props => (
  <DefaultPageLayout
    title="Home Page"
    content={<HomePageContent {...props} />}
  />
);

export default HomePage;
