
import React, { Fragment } from 'react';

import SearchResultsPageLayout from '../layout/SearchResultsPageLayout';

const SamplePageContent = () => (
  <Fragment>
    <h3>Lorem ipsum dolor sit amet</h3>
    <p>
      Vivamus et sem ut nulla faucibus lobortis. Praesent in enim ultrices, pharetra
      nulla quis, pellentesque enim. Nunc vel accumsan sapien. Proin finibus vehicula
      tortor, ut scelerisque ligula egestas sed. In in vehicula lorem. Ut vel vestibulum
      nulla, non mattis purus. Praesent sit amet vestibulum orci, quis porttitor felis.
    </p>
  </Fragment>
);

const SamplePage = () => (
  <SearchResultsPageLayout
    content={<SamplePageContent />}
  />
);

export default SamplePage;
