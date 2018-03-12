
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
    return (
      <div className="primary-navigation">
        { this.state.items.forEach(item => <Button>{item}</Button>) }
      </div>
    );
  }
}

export default PrimaryNavigation;
