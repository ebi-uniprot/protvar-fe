
import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import HomePage from '../../../src/ui/pages/HomePage';

describe('HomePage component', () => {
  test('should render', () => {
    const props = {
      handleSearch: () => null,
      handleDownload: () => null,
    };

    const component = renderer
      .create(<MemoryRouter><HomePage {...props} /></MemoryRouter>)
      .toJSON();

    expect(component).toMatchSnapshot();
  });
});
