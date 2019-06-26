
import React, { Component } from 'react';

import Button from '../../elements/form/Button';

class PrimaryNavigation extends Component {
  state = {
    items: [
      'Home',
      'Downloads',
      'Contact',
    ],
  };

  render() {
    const { items } = this.state;

    return (
      <div className="primary-navigation">
        { items.forEach(item => <Button>{item}</Button>) }
      </div>
    );
  }
}

export default PrimaryNavigation;
