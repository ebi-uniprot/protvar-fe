
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '../../elements/form/Button';

class SimpleSearch extends Component {
  state = {
    searchTerm: 'P05067,P21802,A8K571,Q5STB3,Q6FI00,Q53Y97,A0A160JCQ6'
  }

  handleInputChange(e) {
    this.setState({
      searchTerm: e.target.value
    });
  }

  handleSubmit(e) {

    e.preventDefault();
    e.stopPropagation();

    console.log("SimpleSearch:", this.state.searchTerm);
    debugger;
    this.props.onSubmit(this.state.searchTerm);
  }

  render() {

    const { searchTerm } = this.state;
    const { buttonLabel } = this.props;

    return(
      <form
        className="input-group simple-search"
        onSubmit={this.handleSubmit.bind(this)}
        >
        <input
          type="search"
          className="input-group-field"
          placeholder="Search..."
          value={searchTerm}
          onChange={this.handleInputChange.bind(this)}
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
