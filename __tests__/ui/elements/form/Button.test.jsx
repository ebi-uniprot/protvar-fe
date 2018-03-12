
import React from 'react';
import renderer from 'react-test-renderer';

import Button from '../../../../src/ui/elements/form/Button';

describe('Button component', () => {
  test('should render with a label', () => {
    const component = renderer
      .create(<Button>Works</Button>)
      .toJSON();

    expect(component).toMatchSnapshot();
  });
});
