import React, { useState } from 'react';
import "./ReleaseNote.css"

// Define the ReleaseNoteProps type to specify the shape of the props.
type ReleaseNoteProps = {
  title: React.ReactNode;
  children: React.ReactNode;
  isDefaultOpen?: boolean;
};

const ReleaseNote: React.FC<ReleaseNoteProps> = ({ title, children, isDefaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(isDefaultOpen);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="release-note">
      <div className="release-note-header" onClick={toggleCollapse}>
        <h6>{title}</h6>
      </div>
      {isOpen && <div className="release-note-content">{children}</div>}
    </div>
  );
};

const ReleaseNotes: React.FC = () => {
  return (
    <div className="release-notes">
      <ReleaseNote title={<>ProtVar 1.4 <small>2025_02</small></>} isDefaultOpen={true}>
        <ul>
          <li>Genomic-protein mapping re-run using latest UniProt release (2025_01, Ensembl 113)</li>
          <li>GRCh37-GRCh38 coverage updated</li>
          <li>RefSeq-ProtVar mapping updated for HGVS p. and c. lookups</li>
          <li>CADD predictions updated to v1.7</li>
          <li>Stability prediction data fix and handling of multiple AlphaFold fragments</li>
          <li>dbSNP updated to b156 (40M+ new IDs from b155)</li>
          <li>COSMIC updated to v99 (~200K new IDs from v98)</li>
          <li>ClinVar updated to 2025-02 (1.2M+ new IDs from 2023-07)</li>
          <li>gnomAD allele frequency added (52M+ coding variants)</li>
        </ul>
        <i>review!</i>
      </ReleaseNote>

      <ReleaseNote title={<>Update <small>2023_06_21</small></>} isDefaultOpen={false}>
        <ul>
          <li><strong>Enhancements:</strong>
            <ul>
              <li><em>FoldX coverage was improved</em> to <strong>208M predicted values</strong> (from 5.9M), covering all 19 possible mutations.</li>
            </ul>
          </li>
          <li><strong>Bug Fixes:</strong>
            <ul>
              <li>Ensured the <strong>GRCh37 build</strong> was correctly applied in downloads.</li>
              <li>Added previously missing fields to downloads:
                <ul>
                  <li>Genomic_location</li>
                  <li>Cytogenetic_band</li>
                  <li>Other_identifiers_for_the_variant</li>
                  <li>Diseases_associated_with_variant</li>
                </ul>
              </li>
            </ul>
          </li>
          <li><strong>New Features:</strong>
            <ul>
              <li>Added an optional <code>variantAA</code> filter to the <code>/foldx/{'acc'}/{'pos'}</code> and <code>/function/{'acc'}/{'pos'}</code> endpoints.</li>
              <li>Introduced <strong>direct variant links</strong> using search terms.</li>
            </ul>
          </li>
        </ul>
      </ReleaseNote>

      <ReleaseNote title={<>Update <small>2023_05_30</small></>}>
        <ul>
          <li><strong>New Feature:</strong>
            <ul>
              <li>Novel predictions were added to downloaded result files.</li>
            </ul>
          </li>
          <li><strong>Bug Fixes:</strong>
            <ul>
              <li>Fixed an issue causing failures for some large file uploads.</li>
              <li>Introduced a <strong>10MB file size limit</strong> to manage server load.</li>
            </ul>
          </li>
        </ul>
      </ReleaseNote>

      <ReleaseNote title={<>ProtVar 1.0 <small>2023_05_22</small></>}>
        <ul>
          <li><strong>Launch Announcement:</strong>
            <ul>
              <li>ProtVar was launched on <strong>Wednesday, 24th May</strong> during an <strong>EMBL-EBI webinar</strong> at <strong>15:30 BST (UTC+1)</strong>.</li>
            </ul>
          </li>
          <li><strong>Webinar Topics:</strong>
            <ul>
              <li>The session covered how ProtVar helps users and recent updates.</li>
            </ul>
          </li>
          <li><strong>Registration:</strong>
            <ul>
              <li>Limited places were available, and attendees were required to register <a href="https://www.ebi.ac.uk/training/events/contextualise-and-interpret-human-missense-variation-protvar/" target="_blank"  rel="noreferrer">here</a>.</li>
            </ul>
          </li>
        </ul>
      </ReleaseNote>
    </div>
  );
};

export default ReleaseNotes;