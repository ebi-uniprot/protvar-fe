
import React from 'react';
import renderer from 'react-test-renderer';

import DefaultPageContent from '../../../src/ui/layout/DefaultPageContent';

describe('DefaultPageContent component', () => {
  test('should render', () => {
    const component = renderer
      .create(<DefaultPageContent>Works</DefaultPageContent>)
      .toJSON();

    expect(component).toMatchSnapshot();
  });
});
