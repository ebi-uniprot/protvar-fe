import '../../styles/index.scss';
import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import {ABOUT, CONTACT, HELP, HOME, RELEASE} from '../../constants/BrowserPaths'
import { API_URL, LOCAL_BANNER } from '../../constants/const'

import DefaultPageContent from './DefaultPageContent'

import EMBLEBILogo from '../../images/embl-ebi-logo.svg'
import openTargetsLogo from '../../images/open-targets-logo.png'
import SignUp from "./SignUp";
import {CookieConsent} from "react-cookie-consent";
import {SideDrawer} from "../components/drawer/SideDrawer";
import {StatsGrid} from "../pages/release/Statistics";

interface DefaultPageLayoutProps {
  content: JSX.Element
}


const bannerText = <div><span className="small">ProtVar {process.env.REACT_APP_PV} ({process.env.REACT_APP_UNIPROT}) Released!
  See the <Link to={RELEASE} title="ProtVar Release" id="protvarRelease">Release</Link> page for highlights.</span>
  <StatsGrid />
</div>

function DefaultPageLayout(props: DefaultPageLayoutProps) {
  const [showBanner, setShowBanner] = useState(bannerText != null);
  // to re-enable banner, uncomment state above, and the lines within
  // the handleDismiss function
  //const showBanner = false
  
  useEffect(() => {
    const win: any = window
    if (win.ebiFrameworkInvokeScripts) {
      win.ebiFrameworkInvokeScripts()
    }

    const bannerDismissed = sessionStorage.getItem(LOCAL_BANNER);
    if (bannerDismissed) {
      setShowBanner(false);
    }
  }, [])

  const { content } = props;

  const handleDismiss = () => {
    sessionStorage.setItem(LOCAL_BANNER, 'true');
    setShowBanner(false);
  }

  return (
    <>
      <div id="skip-to">
        <a href="#content">Skip to main content</a>
      </div>

      {/* Below is the EBI master header content. Restore it if there are any concerns */}
      {/* <header id="masthead-black-bar" className="clearfix masthead-black-bar">
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
    </header> */}

      <div className="rel-dropdown">
        <button className="rel-dropbtn">ProtVar {process.env.REACT_APP_PV} <small>{process.env.REACT_APP_UNIPROT}</small>
        </button>
        <ul className="rel-dropdown-content">
          <li>UI {process.env.REACT_APP_UI}</li>
          <li>API {process.env.REACT_APP_API}</li>
          <li style={{borderBottom: '1px solid lightgray'}}>Data release {process.env.REACT_APP_DATA}</li>
          <ul>
          <li>UniProt {process.env.REACT_APP_UNIPROT}</li>
          <li>Ensembl {process.env.REACT_APP_ENSEMBL}</li>
          <li>CADD {process.env.REACT_APP_CADD}</li>
          <li>dbSNP {process.env.REACT_APP_DBSNP}</li>
          <li>COSMIC {process.env.REACT_APP_COSMIC}</li>
          <li>ClinVar {process.env.REACT_APP_CLINVAR}</li>
          <li>gnomAD {process.env.REACT_APP_GNOMAD}</li>
          </ul>
        </ul>
      </div>

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
                    <td className="topnav-logo">
                      <div className="logo-container">
                        <Link
                          className="local-title"
                          to={HOME}
                          title="ProtVar homepage"
                        >
                          <img
                            src="ProtVar_logo.png"
                            alt="ProtVar logo"
                            width="140px"
                          />
                        </Link>
                        <Link
                          className="sub-title"
                          to={HOME}
                          title="ProtVar homepage"
                        >
                          Contextualising human missense variation
                        </Link>
                      </div>
                    </td>

                    <td className="topnav-right local-sub-title">
                      <Link to={CONTACT} title="ProtVar Contact">
                        Contact
                      </Link>
                    </td>
                    <td className="topnav-right local-sub-title">
                      <a href={API_URL} title="ProtVar API" target="_self">
                        API
                      </a>
                    </td>
                    <td className="topnav-right local-sub-title">
                      <Link
                        to={ABOUT}
                        title="ProtVar About"
                        id="protvarAbout"
                      >
                        About
                      </Link>
                    </td>
                    <td className="topnav-right local-sub-title">
                      <Link
                        to={RELEASE}
                        title="ProtVar Release"
                        id="protvarRelease"
                      >Release</Link>
                    </td>
                    <td className="topnav-right local-sub-title">
                      <Link
                        // Replace with the right link
                        to={HELP}
                        title="ProtVar Help"
                        id="protvarHelp"
                      >
                        Help <i className="bi bi-info-circle help-btn"></i>
                      </Link>
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
              {showBanner && (
                <div className="banner">
                  <button
                    className="dismiss-button"
                    onClick={handleDismiss}
                  >
                    X
                  </button>

                  <div className="banner-content">
                    {bannerText}
                  </div>
                </div>
              )}

              <div className="default-page-layout">
                <SideDrawer />
                <DefaultPageContent>
                  {content}
                </DefaultPageContent>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer id="footer-target">
        <div className="custom-pv-footer row">
        <a href="https://www.embl.de/" target="_blank" rel="noreferrer">
          <img
            src={EMBLEBILogo}
            loading="lazy"
            alt=""
            width="130"
            height="50"
            className='collaborator-img'
          />
          </a>
          <a href="https://www.opentargets.org/" target="_blank" rel="noreferrer">
          <img
            src={openTargetsLogo}
            loading="lazy"
            alt=""
            width="130"
            height="50"
            className='collaborator-img'
          />
          </a>
          <a className="twitter-follow-button" data-size="large" data-show-screen-name="false"
             href="https://twitter.com/EBIProtVar">
            Follow @EBIProtVar</a>
          <SignUp />
        </div>
        <div id="global-footer" className="global-footer">
          {/* Below expanded footer content is commented for now. Restore it back if there are any concerns */}
          {/* <nav id="global-nav-expanded" className="global-nav-expanded row" /> */}
          <section id="ebi-footer-meta" className="ebi-footer-meta row" />
        </div>
        <CookieConsent
          location="bottom"
          buttonText="I agree, dismiss this banner"
          cookieName="dismiss-banner"
        >
          <div className="white-color">
            This website uses cookies including Google Analytics. By using the site you are agreeing to this as
            outlined in our <a target="_blank" rel="noreferrer"
                               href="https://www.ebi.ac.uk/data-protection/privacy-notice/embl-ebi-public-website">Privacy
            Notice</a> and <a target="_blank" rel="noreferrer"
                              href="https://www.ebi.ac.uk/about/terms-of-use">Terms of Use</a>.<br/>
            We do not use any of these services to track you individually or collect personal data.
          </div>

        </CookieConsent>
      </footer>
    </>
  )
}

export default DefaultPageLayout
