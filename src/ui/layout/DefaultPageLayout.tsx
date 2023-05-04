import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {ABOUT, CONTACT, DOWNLOAD, HOME} from '../../constants/BrowserPaths';
import {API_URL, LOCAL_DOWNLOADS} from "../../constants/const";

import DefaultPageContent from './DefaultPageContent';

interface DefaultPageLayoutProps {
  content: JSX.Element
}

function DefaultPageLayout(props: DefaultPageLayoutProps) {

  let localDownloads = JSON.parse(localStorage.getItem(LOCAL_DOWNLOADS) || "[]")
  let numDownloads = localDownloads.length

  useEffect(() => {
    const win: any = window
    if (win.ebiFrameworkInvokeScripts) {
      win.ebiFrameworkInvokeScripts();
    }
  }, []);

  const { content } = props;

  return <>
    <div id="skip-to">
      <a href="#content">Skip to main content</a>
    </div>

    <header id="masthead-black-bar" className="clearfix masthead-black-bar">
      <nav className="row">
        <ul id="global-nav" className="menu global-nav text-right">
          <li key="logo" className="home-mobile">
            <a href="//www.ebi.ac.uk">EMBL-EBI</a>
          </li>
          <li key="home" className="home">
            <a href="//www.ebi.ac.uk">EMBL-EBI</a>
          </li>
          <li key="services" className="services">
            <a href="//www.ebi.ac.uk/services">Services</a>
          </li>
          <li key="research" className="research">
            <a href="//www.ebi.ac.uk/research">Research</a>
          </li>
          <li key="training" className="training">
            <a href="//www.ebi.ac.uk/training">Training</a>
          </li>
          <li key="about" className="about">
            <a href="//www.ebi.ac.uk/about">About us</a>
          </li>
          <li
            id="embl-selector"
            className="float-right show-for-medium embl-selector embl-ebi active"
          >
            <button className="button float-right">&nbsp;</button>
          </li>
        </ul>
      </nav>
    </header>

    <div id="content" className="content">
      <div data-sticky-container>
        <div
          id="masthead"
          className="masthead"
          data-sticky
          data-sticky-on="large"
          data-top-anchor="main-content-area:top"
          data-btm-anchor="main-content-area:bottom"
        >
          <div className="masthead-inner row">
            <div className="navbar">
              <table>
                <tbody>
                  <tr className="navbar">
                    <td>
                      <Link
                        className="local-title"
                        to={HOME}
                        title="Back to ProtVar's homepage"
                      >
                        <img src="ProtVar_logo.png" alt="ProtVar logo" width="140px"/>
                      </Link>
                      <Link
                        className="local-sub-title"
                        to={HOME}
                        title="Back to ProtVar's homepage"
                      >
                        Contextualising human missense variation
                      </Link>
                    </td>

                    <td className="topnav-right local-sub-title">
                      <Link to="" onClick={() => window.open(API_URL + '/docs', '_blank')} title="ProtVar REST API" target="_blank"  rel='noreferrer'> API </Link>
                    </td>
                    <td className="topnav-right local-sub-title">
                      <Link to={DOWNLOAD} title="Contact us"> MY DOWNLOADS ({numDownloads}) </Link>
                    </td>
                    <td className="topnav-right local-sub-title">
                      <Link to={ABOUT} title="About ProtVar's" id="aboutProject"> ABOUT </Link>
                    </td>
                    <td className="topnav-right local-sub-title">
                      <Link to={CONTACT} title="Contact us"> CONTACT </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <section className="row" role="main">
        <div id="main-content-area" className="main-content-area row">
          <div className="small-12 columns">
            <div className="default-page-layout">
              <DefaultPageContent>{content}</DefaultPageContent>
            </div>
          </div>
        </div>
      </section>
    </div>

    <footer id="footer-target">
      <div id="global-footer" className="global-footer">
        <nav id="global-nav-expanded" className="global-nav-expanded row" />
        <section id="ebi-footer-meta" className="ebi-footer-meta row" />
      </div>
    </footer>
  </>
}

export default DefaultPageLayout;
