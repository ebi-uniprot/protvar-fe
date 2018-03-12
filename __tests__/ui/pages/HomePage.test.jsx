
import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import HomePage from '../../../src/ui/pages/HomePage';

describe('HomePage component', () => {
  test('should render', () => {
    const component = renderer
      .create(<MemoryRouter><HomePage /></MemoryRouter>)
      .toJSON();

    expect(component).toMatchSnapshot();
  });
});
