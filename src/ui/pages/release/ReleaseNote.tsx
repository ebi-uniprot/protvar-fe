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
          <li>Variant ID lookups updated:
            <ul>
              <li>dbSNP updated to b156 (40M+ new IDs from b155)</li>
              <li>ClinVar updated to 2025-02 (1.2M+ new IDs from 2023-07)</li>
              <li>COSMIC updated to v99 (~200K new IDs from v98)</li>
            </ul>
          </li>
        </ul>
      </ReleaseNote>


      <ReleaseNote title={<>Update <small>June-October 2024</small></>} isDefaultOpen={false}>
        <ul>
          <li>UI Enhancements
            <ul>
              <li>General UI navigational and application flow improvements.</li>
              <li>Added new search history list page for easier tracking.</li>
              <li>First and last page navigation for quick access.</li>
              <li>Simplified direct URLs for variant access.</li>
              <li>Ability to browse variants using protein accession.</li>
              <li>Updated UI help content for better guidance.</li>
            </ul>
          </li>
          <li>Annotations Enhancements
            <ul>
              <li>AlphaFill added to the predicted structure table in the 3D annotation tab.</li>
              <li>Improved annotation linking for better sharing of search results and downloads.</li>
            </ul>
          </li>
          <li>API Improvements
            <ul>
              <li>API response model aligned with UI for consistency.</li>
              <li>Download and input ID formats standardised.</li>
            </ul>
          </li>
        </ul>
      </ReleaseNote>

      <ReleaseNote title={<>Update <small>June 2024</small></>} isDefaultOpen={false}>
        <ul>
          <li>Expanded input options for greater flexibility:
            <ul>
              <li>Now supports cDNA, HGVSp, and various gene/protein IDs.</li>
            </ul>
          </li>
          <li>AlphaMissense data integrated to improve missense variant contextualisation.</li>
          <li>Enhanced pathogenicity predictions:
            <ul>
              <li>Additional predictors included.</li>
              <li>Coordinated colour categorisation for better interpretation.</li>
              <li>New <code>predictions</code> API endpoint added for programmatic access.</li>
            </ul>
          </li>
        </ul>
      </ReleaseNote>


      <ReleaseNote title={<>Update <small>June 2023</small></>} isDefaultOpen={false}>
        <ul>
          <li>Expanded FoldX coverage: Increased from ~6M to 208M+ mutations (all 19 possible variants).</li>
          <li>New features:
            <ul>
            <li>Variant amino acid filter for functional annotation & stability prediction.</li>
              <li>Novel predictions included in download results.</li>
              <li>Direct links now support all search terms from the input box.</li>
            </ul>
          </li>
          <li>Bug fixes:
            <ul>
            <li>Fixed build detection for downloads.</li>
              <li>Resolved missing fields in downloads.</li>
              <li>Fixed large file upload failures; added 10MB file size limit.</li>
            </ul>
          </li>
        </ul>
      </ReleaseNote>

      <ReleaseNote title={<>ProtVar 1.0 launch <small>May 2023</small></>}>
        <ul>
          <li>Variant search via: VCF, HGVSg, gnomAD notation, protein accession & position, dbSNP ID.</li>
          <li>Genomic build conversion: GRCh37 ⇄ GRCh38 with auto-detection.</li>
          <li>Predictions & scores: CADD v1.6, EVE, stability, pockets, protein-protein interactions.</li>
          <li>Annotations: Functional, population, structural.</li>
          <li>Direct variant links: Via genomic coordinates or protein accession & position.</li>
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