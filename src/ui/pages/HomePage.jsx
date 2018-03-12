
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import DefaultPageLayout from '../layout/DefaultPageLayout';

const HomePageContent = () => (
  <Fragment>
    <h3>Welcome!</h3>
    <Link to="/sample-page">Go to Sample Page</Link>
  </Fragment>
);

const HomePage = () => (
  <DefaultPageLayout
    title="Home Page"
    content={<HomePageContent />}
  />
);

export default HomePage;
