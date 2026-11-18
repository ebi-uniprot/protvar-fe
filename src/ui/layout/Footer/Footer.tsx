import FooterStatus from './FooterStatus';
import React from 'react';
import { CookieConsent } from "react-cookie-consent";
import EMBLEBILogo from '../../../images/embl-ebi-logo.svg';
import openTargetsLogo from '../../../images/open-targets-logo.png';
import uniprotLogo from '../../../images/uniprot-logo.svg';
import ensemblLogo from '../../../images/ensembl-logo.png';
import vepGif from '../../../images/vep.jpeg';
import pdbeLogo from '../../../images/pdbe-logo.png';
import decipherLogo from '../../../images/decipher.png';
import {
  CC_BY_URL,
  DECIPHER_URL,
  EBI_PRIVACY_URL,
  EBI_TERMS_URL,
  EBI_URL,
  EMBL_URL,
  ENSEMBL_HOME_URL,
  ENSEMBL_VEP_URL,
  OPEN_TARGETS_URL,
  PDBE_URL,
  UNIPROT_HOME_URL
} from "../../../constants/ExternalUrls";

const Footer: React.FC = () => {
  return (
    <footer id="footer-target">
      {/* Partners section */}
      <div className="pv-footer">
        <div className="partners-section">
          <p className="partners-heading">In collaboration with our partners</p>
          <div className="partner-logos">
            <a href={UNIPROT_HOME_URL} target="_blank" rel="noreferrer" title="UniProt">
              <img src={uniprotLogo} loading="lazy" alt="UniProt" className="collaborator-img" />
            </a>
            <a href={OPEN_TARGETS_URL} target="_blank" rel="noreferrer" title="Open Targets">
              <img src={openTargetsLogo} loading="lazy" alt="Open Targets" className="collaborator-img" />
            </a>
            <a href={DECIPHER_URL} target="_blank" rel="noreferrer" title="DECIPHER">
              <img src={decipherLogo} loading="lazy" alt="DECIPHER" className="collaborator-img" />
            </a>
            <a href={ENSEMBL_HOME_URL} target="_blank" rel="noreferrer" title="Ensembl">
              <img src={ensemblLogo} loading="lazy" alt="Ensembl" className="collaborator-img" />
            </a>
            <a href={ENSEMBL_VEP_URL} target="_blank" rel="noreferrer" title="Ensembl VEP">
              <img src={vepGif} loading="lazy" alt="Ensembl VEP" className="collaborator-img" />
            </a>
            <a href={PDBE_URL} target="_blank" rel="noreferrer" title="PDBe">
              <img src={pdbeLogo} loading="lazy" alt="PDBe" className="collaborator-img" />
            </a>
          </div>
        </div>
      </div>

      <FooterStatus />

      {/* EBI institutional footer */}
      <div className="ebi-footer">
        <div className="ebi-footer-inner">
          <a href={EBI_URL} target="_blank" rel="noreferrer" className="ebi-footer-logo">
            <img src={EMBLEBILogo} alt="EMBL-EBI" height="30" />
          </a>
          <p className="ebi-footer-tagline">
            EMBL-EBI, Wellcome Genome Campus, Hinxton, Cambridgeshire, CB10 1SD, UK.
          </p>
          <p className="ebi-footer-copyright">
            Copyright © EMBL {new Date().getFullYear()}
            <span className="ebi-footer-sep">·</span>
            EMBL-EBI is part of the{' '}
            <a href={EMBL_URL} target="_blank" rel="noreferrer">European Molecular Biology Laboratory</a>
            <span className="ebi-footer-sep">·</span>
            <a href={EBI_TERMS_URL} target="_blank" rel="noreferrer">Terms of use</a>
            <span className="ebi-footer-sep">·</span>
            Licensed under{' '}
            <a href={CC_BY_URL} target="_blank" rel="noreferrer">CC BY 4.0</a>
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
            href={EBI_PRIVACY_URL}
          >
            Privacy Notice
          </a>{' '}
          and{' '}
          <a
            target="_blank"
            rel="noreferrer"
            href={EBI_TERMS_URL}
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