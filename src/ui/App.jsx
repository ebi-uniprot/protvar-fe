
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import axios from 'axios';

import { defaultParser } from '../input-parser';

import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import APIErrorPage from './pages/APIErrorPage';

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      searchTerm: null,
      searchResults: null,
    };
  }

  handleSearch = (input) => {
    const { history } = this.props;

    const apiURI = `${API_URL}/parser`;
    const data = defaultParser(input);

    axios
      .post(apiURI, { input: data })
      .then((response) => {
        const { errors, results } = response.data;
        console.log('>>> search response:', response.data);
        this.setState({
          searchTerm: input,
          searchResults: results,
          errors,
        });

        history.push('search');
      })
      .catch((e) => {
        console.log("Got an axios error:", e);
        history.push('api-error');
      });
  }

  handleDownload = () => {
    const { searchTerm } = this.state;

    const apiURI = `${API_URL}/download`;
    const data = defaultParser(searchTerm);
    console.log('handle download clicked');
    axios
      .post(apiURI, {
        input: data,
        responseType: 'blob',
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'pepvep-data.csv'); // or any other extension
        document.body.appendChild(link);
        link.click();
      })
      .catch((e) => {
        console.log("Got an axios error:", e);
      });
  }

  render() {
    const appProps = {
      ...this.state,
      handleSearch: this.handleSearch,
      handleDownload: this.handleDownload,
    };

    return (
      <Switch>
        <Route path={`${BASE_URL}/`} exact render={() => <HomePage {...appProps} />} />
        <Route path={`${BASE_URL}/search`} render={() => <SearchResultsPage {...appProps} />} />
        <Route path={`${BASE_URL}/api-error`} render={() => <APIErrorPage {...appProps} />} />
        <Route component={({ location }) => (
          <h3>
            404: Can&lsquo;t find
            {location.pathname}
          </h3>
        )}
        />
      </Switch>
    );
  }
}

App.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default withRouter(App);
