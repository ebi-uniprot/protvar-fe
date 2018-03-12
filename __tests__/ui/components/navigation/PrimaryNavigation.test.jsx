
import React from 'react';
import renderer from 'react-test-renderer';

import PrimaryNavigation from '../../../../src/ui/components/navigation/PrimaryNavigation';

describe('PrimaryNavigation component', () => {
  test('should render', () => {
    const component = renderer
      .create(<PrimaryNavigation />)
      .toJSON();

    expect(component).toMatchSnapshot();
  });
});
