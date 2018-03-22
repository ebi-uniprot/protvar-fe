
import React, { Fragment } from 'react';

import DefaultPageLayout from '../layout/DefaultPageLayout';
import SimpleSearch from '../components/search/SimpleSearch';



// class __HomePageContent extends Component {

//   render() {

//     const { searchTerm, searchResults } = this.state;
//     const rows = (null !== searchResults && searchResults.proteins)
//       ? searchResults.proteins
//       : {};
//     const ebiSearch = document.querySelector('#ebi-standard-search-field');
//     const ebiSearchField = document.querySelector('#ebi-standard-search-field #query');

//     if (ebiSearchField) {
//       ebiSearchField.value = searchTerm;
//     }

//     if (null !== searchResults) {
//       ebiSearch.style.display = 'block';
//     }

//     return(
//       <Fragment>
//         { null === searchResults
//           ? <SimpleSearch onSubmit={this.props.handleSearch} />
//           : <SearchResults rows={rows} />
//         }
//       </Fragment>
//     )
//   }
// };

const HomePageContent = props => {
  return (
    <Fragment>
      <SimpleSearch onSubmit={props.handleSearch} />
    </Fragment>
  );
};

const HomePage = props => (
  <DefaultPageLayout
    title="Home Page"
    content={<HomePageContent {...props} />}
  />
);

export default HomePage;
