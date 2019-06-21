
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import DefaultPageLayout from '../layout/DefaultPageLayout';

const APIErrorContent = () => (
  <Fragment>
    <h3>Something went wrong...</h3>
    <p>
      Vivamus et sem ut nulla faucibus lobortis. Praesent in enim ultrices, pharetra
      nulla quis, pellentesque enim. Nunc vel accumsan sapien. Proin finibus vehicula
      tortor, ut scelerisque ligula egestas sed. In in vehicula lorem. Ut vel vestibulum
      nulla, non mattis purus. Praesent sit amet vestibulum orci, quis porttitor felis.
    </p>
  </Fragment>
);

const APIErrorPage = () => (
  <DefaultPageLayout
    content={<APIErrorContent />}
  />
);

export default APIErrorPage;
