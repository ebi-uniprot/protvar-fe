import DefaultPageLayout from "../layout/DefaultPageLayout";
import React, {useEffect} from "react";
import {TITLE} from "../../constants/const";
import ReleaseNotes, {ReleaseBadge, ReleaseNote} from "./release/ReleaseNote";
import Statistics from "./release/Statistics";

function ReleasePageContent() {
  useEffect(() => {
    document.title = `Release | ${TITLE}`;
  }, []);

  return (
    <>
      <h5 className="page-header">Release</h5>

      {/* ── Statistics ── */}
      <Statistics />

      {/* ── v2 section ── */}
      <div className="release-v2">
        <h6 className="release-version-heading">
          <span className="release-badge release-badge-version">v2.0</span>
          ProtVar 2 <small>2025</small>
        </h6>

        <div className="release-categories">
          <div className="release-category">
            <ReleaseBadge type="ui" />
            <ul>
              <li>New sidebar navigation with collapsed/expanded states and recent history</li>
              <li>Redesigned home page with tabbed search modes: Annotate Variants, Browse by Identifier, Text Search</li>
              <li>Browse variants by protein, gene, Ensembl, RefSeq, or PDB identifier</li>
              <li>Improved result toolbar: colour toggle, share, legends, and download in one row</li>
              <li>Redesigned Legend modal with gradient bars and per-category score ranges</li>
              <li>ProtVar standardised / source colour toggle for all prediction scores</li>
              <li>Download Panel with independent functional, population, and structural annotation control</li>
              <li>Consolidated button system and consistent icon usage throughout</li>
            </ul>
          </div>

          <div className="release-category">
            <ReleaseBadge type="api" />
            <ul>
              <li>Consistent response models across all mapping endpoints</li>
              <li>Enhanced filter parameters: CADD, popEVE, stability, allele frequency, domain, PTM</li>
              <li>Improved HGVS p. and c. notation handling in batch and single-variant queries</li>
              <li>Sort and order parameters for browsed result sets</li>
            </ul>
          </div>

          <div className="release-category">
            <ReleaseBadge type="data" />
            <ul>
              <li>gnomAD allele frequencies: 52M+ coding variants (SNV and multi-SNV)</li>
              <li>CADD updated to v1.7</li>
              <li>dbSNP b156: 40M+ new IDs</li>
              <li>ClinVar updated to 2025-02: 1.2M+ new IDs</li>
              <li>COSMIC v99: ~200K new IDs</li>
              <li>Genomic-protein mapping re-run using UniProt 2025_01 &amp; Ensembl 113</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── v1 historical notes ── */}
      <div className="release-v1">
        <h6 className="release-version-heading">
          <span className="release-badge release-badge-v1">v1.x</span>
          Historical Release Notes <small>2023–2025</small>
        </h6>
        <ReleaseNotes />
      </div>
    </>
  );
}

function ReleasePage() {
  return <DefaultPageLayout content={<ReleasePageContent/>}/>
}

export default ReleasePage;
