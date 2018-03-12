
import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import SamplePage from '../../../src/ui/pages/SamplePage';

describe('SamplePage component', () => {
  test('should render', () => {
    const component = renderer
      .create(<MemoryRouter><SamplePage /></MemoryRouter>)
      .toJSON();

    expect(component).toMatchSnapshot();
  });
});
