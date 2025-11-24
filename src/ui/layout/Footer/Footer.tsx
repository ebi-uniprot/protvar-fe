import React from 'react';
import { Link } from 'react-router-dom';
import { CookieConsent } from "react-cookie-consent";
import { CONTACT } from '../../../constants/BrowserPaths';
import SignUp from "../SignUp";
import CitationCarousel from './CitationCarousel';
import EMBLEBILogo from '../../../images/embl-ebi-logo.svg';
import openTargetsLogo from '../../../images/open-targets-logo.png';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer id="footer-target">
      {/* Citation and Twitter content section */}
      <div className="footer-content-section">
        <div className="citation-container">
          <h5>Cite ProtVar</h5>
          <p className="citation-text">
            James D Stephenson, Prabhat Totoo, David F Burke, Jürgen Jänes, Pedro Beltrao, Maria J Martin,
            ProtVar: mapping and contextualizing human missense variation, <i>Nucleic Acids Research</i>, 2024;&nbsp;
            <a className="ref-link ext-link" href="https://doi.org/10.1093/nar/gkae413"
               target="_blank" rel="noreferrer">https://doi.org/10.1093/nar/gkae413</a>
          </p>

          {/* Citation Carousel */}
          <CitationCarousel />

          <div className="footer-links">
            <p>
              Please{' '}
              <Link to={CONTACT} title="Contact us" className="ref-link">
                contact us
              </Link>{' '}
              with queries or suggestions.
            </p>
            <p>
              Licensed under{' '}
              <a className="ref-link" href="https://creativecommons.org/licenses/by/4.0/"
                 target="_blank" rel="noreferrer">Creative Commons Attribution 4.0</a>.
            </p>
          </div>
        </div>

        <div className="twitter-container">
          <h5>Latest Updates</h5>
          <div className="twitter-content">
            <a className="twitter-timeline"
               data-width="350"
               data-height="280"
               data-theme="light"
               data-chrome="noheader nofooter noborders transparent"
               href="https://twitter.com/EBIProtVar?ref_src=twsrc%5Etfw">
              Tweets by EBIProtVar
            </a>
          </div>
        </div>
      </div>

      {/* Partners and social section */}
      <div className="pv-footer row">
        <div className="partners-section">
          <div className="partner-logos">
            <a href="https://www.embl.de/" target="_blank" rel="noreferrer">
              <img
                src={EMBLEBILogo}
                loading="lazy"
                alt="EMBL-EBI"
                className="collaborator-img"
              />
            </a>
            <a href="https://www.opentargets.org/" target="_blank" rel="noreferrer">
              <img
                src={openTargetsLogo}
                loading="lazy"
                alt="Open Targets"
                className="collaborator-img"
              />
            </a>
          </div>
        </div>

        <div className="social-signup-section">
          <a
            className="twitter-follow-button"
            data-size="large"
            data-show-screen-name="false"
            href="https://twitter.com/EBIProtVar"
          >
            Follow @EBIProtVar
          </a>
          <SignUp />
        </div>
      </div>

      <div id="global-footer" className="global-footer row">
        {/* Below expanded footer content is commented for now. Restore it back if there are any concerns */}
        {/* <nav id="global-nav-expanded" className="global-nav-expanded row" /> */}
        <section id="ebi-footer-meta" className="ebi-footer-meta" />
      </div>

      <CookieConsent
        location="bottom"
        buttonText="I agree, dismiss this banner"
        cookieName="dismiss-banner"
      >
        <div className="cookie-notice">
          This website uses cookies including Google Analytics. By using the site you are agreeing to this as
          outlined in our{' '}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.ebi.ac.uk/data-protection/privacy-notice/embl-ebi-public-website"
          >
            Privacy Notice
          </a>{' '}
          and{' '}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.ebi.ac.uk/about/terms-of-use"
          >
            Terms of Use
          </a>.<br />
          We do not use any of these services to track you individually or collect personal data.
        </div>
      </CookieConsent>
    </footer>
  );
};

export default Footer;