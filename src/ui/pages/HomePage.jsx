
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import DefaultPageLayout from '../layout/DefaultPageLayout';
import SimpleSearch from '../components/search/SimpleSearch';

const SearchResults = props => (
  <div className="search-results">
    <table>
      <tbody>
        <tr>
          <th>Protein accession</th>
          <th>Protein name</th>
          <th>Gene name</th>
          <th>Transcript Id</th>
          <th>Start position</th>
          <th>End position</th>
          <th>Impact</th>
        </tr>

        {Object.keys(props.rows)
          .map(key => {
            const row = props.rows[key];

            return (
              <tr key={row.accession}>
                <td>{row.accession}</td>
                <td>{row.name}</td>
                <td>{row.geneName}</td>
                <td>{row.transcriptId}</td>
                <td>{row.position.start}</td>
                <td>{row.position.end}</td>
                <td></td>
              </tr>
            );
        })}
      </tbody>
    </table>
    {props.results}
  </div>
);

class HomePageContent extends Component {
  state = {
    searchResults: null
  }

  onSearchSubmit(term) {

    const accession = term;
    const apiURI = `http://localhost:3687/protein/${accession}`;

    axios.get(apiURI)
      .then(response => {
        this.setState({
          searchResults: response.data
        });
      });
  }

  render() {
    const { searchResults } = this.state;
    const rows = (null !== searchResults && searchResults.proteins)
      ? searchResults.proteins
      : {};

    return(
      <Fragment>
        <SimpleSearch
          onSubmit={this.onSearchSubmit.bind(this)}
        />

        { null !== searchResults
          ? <SearchResults rows={rows} />
          : ''
        }
      </Fragment>
    )
  }
};

const HomePage = () => (
  <DefaultPageLayout
    title="Home Page"
    content={<HomePageContent />}
  />
);

export default HomePage;
