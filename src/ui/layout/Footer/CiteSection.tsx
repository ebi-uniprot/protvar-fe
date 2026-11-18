import React from 'react';
import Subscribe from "../Subscribe";
import Citation from './Citation';
import { ExtLink } from "../../components/common/Link";
import { PROTVAR_PAPER_URL, PROTVAR_TWITTER_URL } from "../../../constants/ExternalUrls";

// At the foot of the main column (not the footer): on short pages it fills the space beside the sidebar,
// which is as tall as the window; on long pages it follows the content.
// Cite ProtVar, research using it, latest updates.
const CiteSection: React.FC = () => (
    <div className="footer-content-section">
      <div className="citation-container">
        <h5>Cite ProtVar</h5>
        <p className="citation-text">
          James D Stephenson, Prabhat Totoo, David F Burke, Jürgen Jänes, Pedro Beltrao, Maria J Martin,
          ProtVar: mapping and contextualizing human missense variation, <i>Nucleic Acids Research</i>, 2024;&nbsp;
          <ExtLink url={PROTVAR_PAPER_URL} text={PROTVAR_PAPER_URL} />
        </p>

        {/* Citation Carousel */}
        <Citation />
      </div>

      <div className="twitter-container">
        <h5>Latest Updates</h5>
        <div className="twitter-content">
          <a className="twitter-timeline"
             data-width="350"
             data-height="280"
             data-theme="light"
             data-chrome="noheader nofooter noborders transparent"
             href={PROTVAR_TWITTER_URL + "?ref_src=twsrc%5Etfw"}>
            Tweets by EBIProtVar
          </a>
          <div className="twitter-fallback">
            <i className="pv-icon" aria-hidden="true">
              {/* X logo: Lucide has no brand icons */}
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
              </svg>
            </i>
            {' '}Follow{' '}
            <a href={PROTVAR_TWITTER_URL} target="_blank" rel="noreferrer">@EBIProtVar</a>
            {' '}for the latest updates.
          </div>
        </div>
        <div className="social-signup-section">
          <a
            className="twitter-follow-button"
            data-size="large"
            data-show-screen-name="false"
            href={PROTVAR_TWITTER_URL}
          >
            Follow @EBIProtVar
          </a>
          <Subscribe />
        </div>
      </div>
    </div>
);

export default CiteSection;
