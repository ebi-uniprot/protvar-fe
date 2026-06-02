import React, {useState} from 'react';

type ReleaseNoteProps = {
  title: React.ReactNode;
  children: React.ReactNode;
  isDefaultOpen?: boolean;
};

export const ReleaseNote: React.FC<ReleaseNoteProps> = ({title, children, isDefaultOpen = false}) => {
  const [isOpen, setIsOpen] = useState(isDefaultOpen);

  return (
    <div className="release-note">
      <div className="release-note-header" onClick={() => setIsOpen(!isOpen)}>
        <span>{title}</span>
        <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'} release-note-chevron`} />
      </div>
      {isOpen && <div className="release-note-content">{children}</div>}
    </div>
  );
};

export interface ReleaseBadgeProps {
  type: 'ui' | 'api' | 'data';
  label?: string;
}

export const ReleaseBadge: React.FC<ReleaseBadgeProps> = ({ type, label }) => (
  <span className={`release-badge release-badge-${type}`}>{label ?? type.toUpperCase()}</span>
);

const ReleaseNotes: React.FC = () => {
  return (
      <ReleaseNote
        isDefaultOpen
        title={<><span className="release-badge release-badge-version">v1.0</span> Launch &amp; updates <small>2023–2024</small></>}
      >
        <ul>
          <li><strong>June–October 2024</strong>
            <ul>
              <li>Search-history page, first/last pagination, simplified direct URLs, and browse by protein accession</li>
              <li>Refreshed navigation, application flow and help content</li>
              <li>AlphaFill in the predicted-structure table; richer sharing of results &amp; downloads</li>
              <li>API response model aligned with the UI; standardised download &amp; input IDs</li>
            </ul>
          </li>
          <li><strong>June 2024</strong>
            <ul>
              <li>Expanded input: cDNA (HGVS c.) and HGVSp (HGVS p.) notation</li>
              <li>AlphaMissense integrated for missense contextualisation</li>
              <li>More pathogenicity predictors with coordinated colour categories; new predictions API endpoint</li>
            </ul>
          </li>
          <li><strong>June 2023</strong>
            <ul>
              <li>FoldX coverage expanded ~6M → 208M+ mutations (all 19 substitutions)</li>
              <li>Variant amino-acid filter for functional annotation &amp; stability</li>
              <li>Novel predictions in downloads; direct-link URLs for any supported input format (not just coordinates or accession)</li>
              <li>Fixes: build detection, missing download fields, large-file uploads (10&nbsp;MB limit)</li>
            </ul>
          </li>
          <li><strong>May 2023 · ProtVar 1.0 launch</strong>
            <ul>
              <li>Genomic–protein mapping built on UniProt 2022_05</li>
              <li>Variant search via VCF, HGVSg, gnomAD, protein accession + position, dbSNP ID</li>
              <li>GRCh37 ⇄ GRCh38 build conversion with auto-detection</li>
              <li>CADD v1.6, EVE, stability, pockets, protein–protein interactions</li>
              <li>Functional, population and structural annotations</li>
              <li>Direct variant links via genomic coordinates or accession + position</li>
            </ul>
          </li>
        </ul>
        <p className="release-data-note">
          Genomic–protein mapping was also re-run on UniProt 2023_03 and 2023_05 during 2023 (not separately versioned at the time).
        </p>
      </ReleaseNote>
  );
};

export default ReleaseNotes;
