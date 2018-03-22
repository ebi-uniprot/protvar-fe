
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import axios from 'axios';

import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import SamplePage from './pages/SamplePage';

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      searchTerm: null,
      searchResults: null,
    };
  }

  handleSearch (term) {
    const accession = term;
    const apiURI = `http://localhost:3687/protein/${accession}`;

    axios.get(apiURI)
      .then(response => {
        this.setState({
          searchTerm: term,
          searchResults: response.data
        });

        this.props.history.push('search');
      });
  }

  render() {
    const { searchTerm } = this.state;

    const appProps = {
      ...this.state,
      handleSearch: this.handleSearch.bind(this),
    };

    return (
      <Switch>
        <Route path="/" exact render={props => <HomePage {...appProps} />} />
        <Route path="/search" render={props => <SearchResultsPage {...appProps} />} />
        <Route path="/sample-page" component={SamplePage} />
      </Switch>
    );
  }
};

export default withRouter(App);
