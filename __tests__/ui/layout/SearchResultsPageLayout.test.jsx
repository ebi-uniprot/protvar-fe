
import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import SearchResultsPageLayout from '../../../src/ui/layout/SearchResultsPageLayout';

describe('SearchResultsPageLayout component', () => {
  test('should render', () => {
    let component = (
      <MemoryRouter>
        <SearchResultsPageLayout
          content={<h3>Works</h3>}
        />
      </MemoryRouter>
    );

    component = renderer
      .create(component)
      .toJSON();

    expect(component).toMatchSnapshot();
  });
});
