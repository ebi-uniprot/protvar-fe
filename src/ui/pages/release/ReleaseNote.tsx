import React, {useState} from 'react';
import "./ReleaseNote.css"

// Define the ReleaseNoteProps type to specify the shape of the props.
type ReleaseNoteProps = {
  title: React.ReactNode;
  children: React.ReactNode;
  isDefaultOpen?: boolean;
};

const ReleaseNote: React.FC<ReleaseNoteProps> = ({title, children, isDefaultOpen = false}) => {
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
          <li>Genomic-protein mapping re-run using UniProt 2025_01 & Ensembl 113</li>
          <li>GRCh37-GRCh38 coverage updated</li>
          <li>RefSeq-ProtVar mapping improved for HGVS p. & c. lookups</li>
          <li>Updated predictions & annotations:
            <ul>
              <li>CADD updated to v1.7</li>
              <li>Stability prediction fix & better handling of multiple AlphaFold fragments</li>
              <li>gnomAD allele frequencies added (52M+ coding variants)</li>
            </ul>
          </li>
          <li>Variant IDs lookups:
            <ul>
              <li>dbSNP updated to b156 (40M+ new IDs from b155)</li>
              <li>ClinVar updated to 2025-02 (1.2M+ new IDs from 2023-07)</li>
              <li>COSMIC updated to v99 (~200K new IDs from v98)</li>
            </ul>
          </li>
        </ul>
      </ReleaseNote>

      <ReleaseNote title={<>...</>} isDefaultOpen={false}>
        ...review!
      </ReleaseNote>

      <ReleaseNote title={<>Minor update and bug fixes <small>May-June 2023</small></>} isDefaultOpen={false}>
        <ul>
          <li>Expanded FoldX coverage: Increased from ~6M to 208M+ mutations (all 19 possible variants)</li>
          <li>New features:
            <ul>
              <li>Variant amino acid filter for functional annotation & stability prediction</li>
              <li>Novel predictions included in download results</li>
              <li>Direct links now support all search terms from the input box</li>
            </ul></li>
          <li>Bug Fixes:
            <ul>
              <li>Fixed build detection for downloads</li>
              <li>Resolved missing fields in downloads</li>
              <li>Fixed large file upload failures; added 10MB file size limit</li>
            </ul></li>
        </ul>
      </ReleaseNote>

      <ReleaseNote title={<>ProtVar 1.0 <small>May 2023</small></>}>
        <ul>
          <li>ProtVar 1.0 launch</li>
          <li>Variant search via: VCF, HGVSg, gnomAD notation, protein accession & position, dbSNP ID</li>
          <li>Genomic build conversion: GRCh37 ⇄ GRCh38 with auto-detection</li>
          <li>Predictions & scores: CADD v1.6, EVE, stability, pockets, protein-protein interactions</li>
          <li>Annotations: Functional, population, structural</li>
          <li>Direct variant links: Via genomic coordinates or protein accession & position</li>
          <li>Recorded webinar: <a
            href="https://www.ebi.ac.uk/training/events/contextualise-and-interpret-human-missense-variation-protvar/"
            target="_blank" rel="noreferrer">Contextualising
            human missense variation with ProtVar</a>
          </li>
        </ul>
      </ReleaseNote>
    </div>
  );
};

export default ReleaseNotes;