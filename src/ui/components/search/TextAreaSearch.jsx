
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Button from '../../elements/form/Button';
import Paginator  from '../paginator';
import AboutSection from '../other/AboutSection';

import axios from 'axios';

class TextAreaSearch extends Component {
  state = {
    // searchTerm: '19 110747 . G GT . . .'
    // searchTerm: '1 182712 182712 A/C 1'
    // searchTerm: 'X 139561916 139561916 A/G . . .'
    // searchTerm: '1 230704270 230704270 G/A . . .'
    // searchTerm: '20 58909365 58909365 C/A . . .'

    searchTerm: `15 58679193 58679193 G/A . . .
20 58909365 58909365 C/A . . .
X 139561916 139561916 A/G . . .
1 230704270 230704270 G/A . . .`
// NC_000014.9:g.73198117C>G
// NC_000003.12:g.165830358T>C`

// MT  8533  rs386829039  G  A `

//     searchTerm: `1 182712 . A C . . .
// 3 319780 . GA G . . .
// 19 110747 . G GT . . .
// 1 160283 sv1 . <DUP> . . SVTYPE=DUP;END=471362 .
// 1 1385015 sv2 . <DEL> . . SVTYPE=DEL;END=1387562 .`
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

  pagination() {

    const {
      Pagination,
      Page,
      Item,
      Pager,
      Steps,
      Next,
      Previous,
      First,
      Last,
      PageSizes
    } = Paginator;

    const buttonTemplate = button => () =>
      <button className={`button ${button.classes}`} onClick={button.onClick}>{button.label}</button>;

    let totalItems = 67;

    async function fetchPage (page, size) {
      // totalItems += (page * 3);     // changing page size
      const itemsPerPage = (totalItems < page * size)
        ? totalItems % size     // last page
        : size;

      if (itemsPerPage < 1) {
        return null;
      }

      const items = Array(itemsPerPage)
        .fill(null)
        .map((x, i) => ({
          a: ((page - 1) * size) + i + 1,
          b: (() => page + i * 2)()
        }));

      const results = {
        total: totalItems,
        items
      }

      const promise = new Promise(resolve => {
        setTimeout(() => resolve(results), 1000);
      });

      return promise;
    }

    function beforeLoad() {
      // console.log("++ start loading...");
    }

    function afterLoad() {
      // console.log('-- stop loading...');
    }

    const loader = () => <b>Loading content...</b>;
    const empty = () => {
      return(
        <tr>
          <td colSpan="2">
            Nothing to show here...
          </td>
        </tr>
      );
    };

    return(
      <Fragment>
        <Pagination
          loader={loader}
          empty={empty}
          fetchPage={fetchPage}
          beforeLoad={beforeLoad}
          afterLoad={afterLoad}
          currentPage="3"
          itemsPerPage="10"
        >

        <table cellPadding="2" cellSpacing="2" border="1">
          <tbody>
            <tr>
              <th>Column A</th>
              <th>Column B</th>
            </tr>

            <Page>
              <Item template={item => {
                return (
                  <tr>
                    <td>A: {item.a}</td>
                    <td>B: {item.b}</td>
                  </tr>
                );
              }} />

              <tr>
                <td colSpan="2">
                  Other Page data...
                </td>
              </tr>
            </Page>

            </tbody>
          </table>

          <Pager template={buttonTemplate}>
            <First />
            <Previous />
            <Steps template={buttonTemplate} />
            <Next />
            <Last />
          </Pager>

          <div style={{padding: 4 + 'px', float: 'right'}}>
            Page Size: &nbsp;
            <PageSizes options="5,10,15" />
          </div>

        </Pagination>
      </Fragment>
    );
  }

  render() {

    const { searchTerm } = this.state;
    const { buttonLabel } = this.props;
    const pagination = this.pagination();

    return(
      <Fragment>
        <div className="text-area-search">
          <h3>Variations</h3>

          <div className="input-examples">
            <b>Examples</b>
            <br />
            <span>Protein:</span>
            <span className="variant-example">P19544:p. Cys355Arg</span>
            <span>Gene:</span>
            <span className="variant-example">3 165830358 165830358 T/C</span>
          </div>

          <form onSubmit={this.handleSubmit.bind(this)}>

            <textarea
              id="main-textarea-search-field"
              value={searchTerm}
              onChange={this.handleInputChange.bind(this)}
            ></textarea>

            <span className="assemly-ref-note">
              Reference Genome Assembly: GRCh38 (hg38)
            </span>

            <a herf="http://www.ensembl.org/Homo_sapiens/Tools/AssemblyConverter?db=core" target="_blank">
              Open Ensembl Assembly Remapping
            </a>

            <div id="search-button-group">
              <Button className="button--primary">
                File Upload
              </Button>

              <Button type="submit" onClick={this.handleSubmit.bind(this)}>
                {buttonLabel}
              </Button>
            </div>

          </form>
        </div>

        <AboutSection />
      </Fragment>
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
