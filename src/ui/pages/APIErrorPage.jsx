
import React, { Fragment } from 'react';

import DefaultPageLayout from '../layout/DefaultPageLayout';

const APIErrorContent = () => (
  <Fragment>
    <h3>Something went wrong...</h3>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
      nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
      fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
      culpa qui officia deserunt mollit anim id est laborum.
    </p>
  </Fragment>
);

const APIErrorPage = () => (
  <DefaultPageLayout
    content={<APIErrorContent />}
  />
);

export default APIErrorPage;
