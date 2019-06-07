
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '../../elements/form/Button';

class EBIStandardSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: props.term,
    };
  }

  handleInputChange = (e) => {
    console.log(e.target.value);
    this.setState({
      searchTerm: e.target.value,
    });
  }

  handleSubmit = (e) => {
    const { searchTerm } = this.state;
    const { onSubmit } = this.props;

    onSubmit(searchTerm);

    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    const { searchTerm } = this.state;

    return (
      <div id="ebi-standard-search-field" className="column medium-5">
        <form
          id="ebi_search"
          onSubmit={this.handleSubmit}
        >
          <fieldset>
            <div className="input-group margin-bottom-none margin-top-large">
              <input
                id="query"
                className="input-group-field"
                title="EB-eye Search"
                tabIndex="0"
                type="text"
                name="query"
                size="35"
                maxLength="2048"
                placeholder="Search service"
                value={searchTerm}
                onChange={this.handleInputChange}
              />

              <div className="input-group-button">
                <Button
                  type="submit"
                  onClick={this.handleSubmit}
                  className="icon icon-functional"
                >
                  Search
                </Button>
              </div>
            </div>
          </fieldset>
          <p id="example" className="small">
            <span>Examples:&nbsp;</span>
            {/* eslint-disable-next-line */}
            <a href="/ebisearch/search.ebi?db=allebi&amp;requestFrom=ebi_index&amp;query=blast">blast</a>,
            {/* eslint-disable-next-line */}
            <a href="/ebisearch/search.ebi?db=allebi&amp;query=keratin&amp;requestFrom=ebi_index">keratin</a>,
            {/* eslint-disable-next-line */}
            <a href="/ebisearch/search.ebi?db=allebi&amp;query=bfl1&amp;requestFrom=ebi_index">bfl1</a>
            {/* eslint-disable-next-line */}
            <button className="float-right"><span className="icon icon-generic" data-icon="(" /> advanced search</button>
          </p>
        </form>
      </div>
    );
  }
}

EBIStandardSearch.propTypes = {
  term: PropTypes.string,
  onSubmit: PropTypes.func,
};

EBIStandardSearch.defaultProps = {
  term: '',
  onSubmit: () => undefined,
};

export default EBIStandardSearch;
