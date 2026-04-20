import React from 'react';
import { Link } from 'react-router-dom';
import { CookieConsent } from "react-cookie-consent";
import { CONTACT } from '../../../constants/BrowserPaths';
import Subscribe from "../Subscribe";
import Citation from './Citation';
import EMBLEBILogo from '../../../images/embl-ebi-logo.svg';
import openTargetsLogo from '../../../images/open-targets-logo.png';
import uniprotLogo from '../../../images/uniprot-logo.svg';
import ensemblLogo from '../../../images/ensembl-logo.png';
import vepGif from '../../../images/vep.gif';
import pdbeLogo from '../../../images/pdbe-logo.png';
import decipherLogo from '../../../images/decipher.png';
import {ExtLink} from "../../components/common/Link";

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
            <ExtLink url="https://doi.org/10.1093/nar/gkae413" text="https://doi.org/10.1093/nar/gkae413" />
          </p>

          {/* Citation Carousel */}
          <Citation />

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
          <div className="social-signup-section">
            <a
              className="twitter-follow-button"
              data-size="large"
              data-show-screen-name="false"
              href="https://twitter.com/EBIProtVar"
            >
              Follow @EBIProtVar
            </a>
            <Subscribe />
          </div>
        </div>
      </div>

      {/* Partners section */}
      <div className="pv-footer">
        <div className="partners-section">
          <p className="partners-heading">In collaboration with our partners</p>
          <div className="partner-logos">
            <a href="https://www.uniprot.org/" target="_blank" rel="noreferrer" title="UniProt">
              <img src={uniprotLogo} loading="lazy" alt="UniProt" className="collaborator-img" />
            </a>
            <a href="https://www.opentargets.org/" target="_blank" rel="noreferrer" title="Open Targets">
              <img src={openTargetsLogo} loading="lazy" alt="Open Targets" className="collaborator-img" />
            </a>
            <a href="https://www.deciphergenomics.org/" target="_blank" rel="noreferrer" title="DECIPHER">
              <img src={decipherLogo} loading="lazy" alt="DECIPHER" className="collaborator-img" />
            </a>
            <a href="https://www.ensembl.org/" target="_blank" rel="noreferrer" title="Ensembl">
              <img src={ensemblLogo} loading="lazy" alt="Ensembl" className="collaborator-img" />
            </a>
            <a href="https://www.ensembl.org/info/docs/tools/vep/" target="_blank" rel="noreferrer" title="Ensembl VEP">
              <img src={vepGif} loading="lazy" alt="Ensembl VEP" className="collaborator-img" />
            </a>
            <a href="https://www.ebi.ac.uk/pdbe/" target="_blank" rel="noreferrer" title="PDBe">
              <img src={pdbeLogo} loading="lazy" alt="PDBe" className="collaborator-img" />
            </a>
          </div>
        </div>
      </div>

      {/* EBI institutional footer */}
      <div className="ebi-footer">
        <div className="ebi-footer-inner">
          <a href="https://www.ebi.ac.uk/" target="_blank" rel="noreferrer" className="ebi-footer-logo">
            <img src={EMBLEBILogo} alt="EMBL-EBI" height="30" />
          </a>
          <p className="ebi-footer-tagline">
            EMBL-EBI, Wellcome Genome Campus, Hinxton, Cambridgeshire, CB10 1SD, UK.
          </p>
          <p className="ebi-footer-copyright">
            Copyright © EMBL {new Date().getFullYear()}
            <span className="ebi-footer-sep">·</span>
            EMBL-EBI is part of the{' '}
            <a href="https://www.embl.org/" target="_blank" rel="noreferrer">European Molecular Biology Laboratory</a>
            <span className="ebi-footer-sep">·</span>
            <a href="https://www.ebi.ac.uk/about/terms-of-use" target="_blank" rel="noreferrer">Terms of use</a>
          </p>
        </div>
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