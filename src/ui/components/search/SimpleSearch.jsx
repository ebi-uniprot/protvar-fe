
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '../../elements/form/Button';

class SimpleSearch extends Component {
  state = {
    searchTerm: ''
  }

  handleInputChange(e) {
    this.setState({
      searchTerm: e.target.value
    });
  }

  handleSubmit() {
    this.props.onSubmit(this.state.searchTerm);
  }

  render() {

    const { buttonLabel } = this.props;

    return(
      <div className="simple-search">
        <input
          type="text"
          placeholder="Search..."
          value={this.state.searchTerm}
          onChange={this.handleInputChange.bind(this)}
        />

        <Button onClick={this.handleSubmit.bind(this)} >
          {buttonLabel}
        </Button>
      </div>
    )
  }
}

SimpleSearch.propTypes = {
  buttonLabel: PropTypes.string,
  onSubmit: PropTypes.func,
};

SimpleSearch.defaultProps = {
  buttonLabel: 'Search',
  onSubmit: () => undefined,
};

export default SimpleSearch;
