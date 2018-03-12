
import React from 'react';
import renderer from 'react-test-renderer';

import DefaultPageLayout from '../../../src/ui/layout/DefaultPageLayout';

describe('DefaultPageLayout component', () => {
  test('should render', () => {
    let component = (
      <DefaultPageLayout
        title="Works"
        content={<h3>Works</h3>}
      />);

    component = renderer
      .create(component)
      .toJSON();

    expect(component).toMatchSnapshot();
  });
});
