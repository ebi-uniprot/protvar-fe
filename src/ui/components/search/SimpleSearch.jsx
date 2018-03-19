
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

  handleSubmit(e) {
    this.props.onSubmit(this.state.searchTerm);
    e.preventDefault();
    e.stopPropagation();
  }

  render() {

    const { buttonLabel } = this.props;

    return(
      <form className="input-group simple-search">
        <input
          type="search"
          className="input-group-field"
          placeholder="Search..."
          value={this.state.searchTerm}
          onChange={this.handleInputChange.bind(this)}
          onSubmit={this.handleSubmit.bind(this)}
        />
        <div className="input-group-button">
          <Button type="submit" onClick={this.handleSubmit.bind(this)}>
            {buttonLabel}
          </Button>
        </div>
      </form>
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
