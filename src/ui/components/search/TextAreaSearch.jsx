
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '../../elements/form/Button';

class TextAreaSearch extends Component {
  state = {
    searchTerm: '1 182712 182712 A/C 1'
  }

  handleInputChange(e) {
    this.setState({
      searchTerm: e.target.value
    });
  }

  handleSubmit(e) {

    e.preventDefault();
    e.stopPropagation();

console.log("TextAreaSearch:", this.state.searchTerm);
    this.props.onSubmit(this.state.searchTerm);
  }

  render() {

    const { searchTerm } = this.state;
    const { buttonLabel } = this.props;

    return(
      <form
        className="input-group text-area-search"
        onSubmit={this.handleSubmit.bind(this)}
        >
        <textarea
          value={searchTerm}
          onChange={this.handleInputChange.bind(this)}
        ></textarea>
        <div className="input-group-button">
          <Button type="submit" onClick={this.handleSubmit.bind(this)}>
            {buttonLabel}
          </Button>
        </div>
      </form>
    )
  }
}

TextAreaSearch.propTypes = {
  buttonLabel: PropTypes.string,
  onSubmit: PropTypes.func,
};

TextAreaSearch.defaultProps = {
  buttonLabel: 'Search',
  onSubmit: () => undefined,
};

export default TextAreaSearch;
