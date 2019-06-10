
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import EBIStandardSearch from '../components/search/EBIStandardSearch';
import DefaultPageContent from './DefaultPageContent';

const DefaultPageLayout = (props) => {
  const { content } = props;

  return (
    <Fragment>
      <div id="skip-to">
        <a href="#content">Skip to main content</a>
      </div>

      <header id="masthead-black-bar" className="clearfix masthead-black-bar">
        <nav className="row">
          <ul id="global-nav" className="menu">
            { /* <!-- set active class as appropriate --> */ }
            <li className="home-mobile"><a href="//www.ebi.ac.uk">EMBL-EBI</a></li>
            <li className="home active"><a href="//www.ebi.ac.uk">EMBL-EBI</a></li>
            <li className="services"><a href="//www.ebi.ac.uk/services">Services</a></li>
            <li className="research"><a href="//www.ebi.ac.uk/research">Research</a></li>
            <li className="training"><a href="//www.ebi.ac.uk/training">Training</a></li>
            <li className="about"><a href="//www.ebi.ac.uk/about">About us</a></li>
            <li className="search">
              <a href="#/" data-toggle="search-global-dropdown"><span className="show-for-small-only">Search</span></a>
              <div id="search-global-dropdown" className="dropdown-pane" data-dropdown data-options="closeOnClick:true;">
                { /* <!-- The dropdown menu will be programatically added by script.js --> */ }
              </div>
            </li>
            <li className="float-right show-for-medium embl-selector">
              <button className="button float-right" type="button" data-toggle="embl-dropdown">Hinxton</button>
              { /* <!-- The dropdown menu will be programatically added by script.js --> */ }
            </li>
          </ul>
        </nav>
      </header>

      { /* <!-- Suggested layout containers --> */ }
      <div id="content" className="content">
        <div data-sticky-container>
          <div id="masthead" className="masthead" data-sticky data-sticky-on="large" data-top-anchor="main-content-area:top" data-btm-anchor="main-content-area:bottom">
            <div className="masthead-inner row">
              { /* <!-- local-title --> */ }
              <div className="local-title columns medium-7" id="local-title">
                <a href={`${BASE_URL}/`} title="Back to PepVEP's homepage">PepVEP</a>
              </div>
              { /* <!-- /local-title --> */ }
              <EBIStandardSearch />
              { /* <!-- <nav>
              <ul
                id="local-nav"
                className="dropdown menu float-left"
                data-description="navigational"
              >
                <li><a href="../">Overview</a></li>
                <li><a data-open="modal-download">Download</a></li>
                <li>
                  <a href="#">Support <i className="icon icon-generic" data-icon="x"></i></a>
                </li>
              </ul>
            </nav> --> */ }
            </div>
          </div>
        </div>

        { /* <!-- Suggested layout containers --> */ }
        <section className="row" role="main">
          { /* <!-- Your menu structure should make a breadcrumb redundant,
            but if a breadcrump is needed uncomment the below --> */ }
          { /* <!-- <nav aria-label="You are here:" role="navigation">
          <ul className="breadcrumbs columns">
            <li><a href="../../">EBI Framework</a></li>
            <li><a href="../">Sample pages</a></li>
            <li>
              <span className="show-for-sr">Current: </span> No jQuery or Foundation JS
            </li>
          </ul>
        </nav> --> */ }

          <div id="main-content-area" className="main-content-area row">
            <div className="small-12 columns">
              <div className="default-page-layout">
                <DefaultPageContent>
                  {content}
                </DefaultPageContent>
              </div>
            </div>
          </div>

        </section>
        { /* <!-- Optional local footer (insert citation / project-specific copyright
        / etc here --> */ }
        { /* <!--
      <footer id="local-footer" className="local-footer" role="local-footer">
        <div className="row">
          <span className="reference">How to reference this page: ...</span>
        </div>
      </footer>
      --> */ }
        { /* <!-- End optional local footer --> */ }
      </div>
      { /* <!-- End suggested layout containers / #content --> */ }

      <footer>
        <div id="global-footer" className="global-footer">
          <nav id="global-nav-expanded" className="global-nav-expanded row">
            { /* <!-- Footer will be automatically inserted by footer.js --> */ }
          </nav>
          <section id="ebi-footer-meta" className="ebi-footer-meta row">
            { /* <!-- Footer meta will be automatically inserted by footer.js --> */ }
          </section>
        </div>
      </footer>
    </Fragment>
  );
};

DefaultPageLayout.propTypes = {
  content: PropTypes.element,
};

DefaultPageLayout.defaultProps = {
  content: () => <h3>Page Content</h3>,
};

export default DefaultPageLayout;
