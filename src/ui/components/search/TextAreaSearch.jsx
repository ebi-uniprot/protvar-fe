
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Button from '../../elements/form/Button';
import AboutSection from '../other/AboutSection';

class TextAreaSearch extends Component {
  state = {
    searchTerm: [
      '14 89993420 89993420 A/G . . .',
      '20 58909365 58909365 C/A . . .',
      '3 165830358 165830358 T/C . . .',
      '21 43072000 43072000 T/C . . .',
      '21 43060540 43060540 C/T . . .',
    ].join('\n'),
  }

  handleInputChange = (e) => {
    this.setState({
      searchTerm: e.target.value,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('TextAreaSearch:', this.state.searchTerm);
    this.props.onSubmit(this.state.searchTerm);
  }

  render() {
    const { searchTerm } = this.state;
    const { buttonLabel } = this.props;

    return (
      <Fragment>
        <div className="text-area-search">
          <h3>Variant Input</h3>

          <div className="input-examples">
            <b>Examples</b>
            <br />
            <span>Protein:</span>
            <span className="variant-example">P19544:p. Cys355Arg</span>
            <span>Gene:</span>
            <span className="variant-example">3 165830358 165830358 T/C</span>
          </div>

          <form onSubmit={this.handleSubmit}>

            <textarea
              id="main-textarea-search-field"
              value={searchTerm}
              onChange={this.handleInputChange}
            />

            <span className="assemly-ref-note">
              Reference Genome Assembly: GRCh38 (hg38)
            </span>

            <a
              href="http://www.ensembl.org/Homo_sapiens/Tools/AssemblyConverter?db=core"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Ensembl Assembly Remapping
            </a>

            <div id="search-button-group">
              <Button className="button--primary">
                File Upload
              </Button>

              <Button type="submit" onClick={this.handleSubmit}>
                {buttonLabel}
              </Button>
            </div>

          </form>
        </div>

        <AboutSection />
      </Fragment>
    );
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
