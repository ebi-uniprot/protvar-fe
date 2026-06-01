import DefaultPageLayout from "../layout/DefaultPageLayout";
import React, {useEffect} from "react";
import {TITLE} from "../../constants/const";
import {useSearchParams} from "react-router-dom";
import ReleaseNotes, {ReleaseBadge, ReleaseNote} from "./release/ReleaseNote";
import Statistics from "./release/Statistics";

type ReleaseTab = 'notes' | 'stats';

function ReleasePageContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab: ReleaseTab = searchParams.get('tab') === 'stats' ? 'stats' : 'notes';

  const setTab = (tab: ReleaseTab) => {
    const next = new URLSearchParams(searchParams);
    if (tab === 'notes') next.delete('tab');
    else next.set('tab', tab);
    setSearchParams(next, {replace: true});
  };

  useEffect(() => {
    document.title = `Release | ${TITLE}`;
  }, []);

  return (
    <div className="container">
      <h5 className="page-header">Release</h5>

      <p className="release-intro">
        ProtVar's UI, API and data are versioned independently and may be released on separate
        schedules; the current version of each is shown in the version menu.
      </p>

      <div className="release-tabs">
        <button
          className={`release-tab${activeTab === 'notes' ? ' active' : ''}`}
          onClick={() => setTab('notes')}
        >
          <i className="bi bi-card-list" /> Release Notes
        </button>
        <button
          className={`release-tab${activeTab === 'stats' ? ' active' : ''}`}
          onClick={() => setTab('stats')}
        >
          <i className="bi bi-bar-chart" /> Statistics
        </button>
      </div>

      {activeTab === 'stats' && <Statistics />}

      {activeTab === 'notes' && <div className="release-notes">
      {/* ── v2.0 ── */}
      <ReleaseNote isDefaultOpen title={<><span className="release-badge release-badge-version">v2.0</span> ProtVar 2 <small>2026</small></>}>
        <div className="release-categories">
          <div className="release-category">
            <ReleaseBadge type="ui" />
            <ul>
              <li>Collapsible sidebar with recent search history</li>
              <li>Tabbed home page: Annotate Variants, Browse by Identifier, Semantic Search</li>
              <li>Browse by identifier (protein, gene, Ensembl, RefSeq, PDB), position range, or filters alone</li>
              <li>Advanced filtering — CADD, AlphaMissense, EVE/popEVE, stability, pockets, interfaces, binding/active/transmembrane, PTM, domains, disease association</li>
              <li>Score Radar chart; ProtVar-standardised / source colour toggle across all scores</li>
              <li>Redesigned Function, Population &amp; Structure tabs — Mol* sequence panel, AlphaFold confidence, unified legends</li>
              <li>Shareable result &amp; prediction links; short URLs (/g/, /p/, /search)</li>
              <li>Redesigned result grid — capped totals, faster pagination</li>
              <li>Download Panel — independent functional / population / structural control, clearer status</li>
              <li>Activity &amp; Status pages (history, downloads, live service status)</li>
              <li>Refreshed help, incl. ProtVar Links &amp; MCP</li>
            </ul>
          </div>

          <div className="release-category">
            <ReleaseBadge type="api" />
            <ul>
              <li>Consistent response models, aligned with the UniProt data model</li>
              <li>Unified request model — single variant (q), saved results (resultId), multi-identifier browse (ids[]) with auto type resolution</li>
              <li>Browse by position range or by filters alone</li>
              <li>Advanced filter params — CADD, AlphaMissense, EVE/popEVE, binding/active/transmembrane, PTM, domains, disease association (AND-combined)</li>
              <li>Improved HGVS p./c. handling in batch &amp; single queries</li>
              <li>Sort/order params and capped totals</li>
              <li>Semantic-search endpoint with selectable models (BioBERT default, BioLORD, BGE, MiniLM, MPNet)</li>
              <li>gnomAD AC/AN added; new /accessions endpoint (all / mapped / unmapped)</li>
              <li>Robust large downloads — queued named jobs, 100K-row cap, 30-day retention</li>
              <li>MCP server for programmatic / agent access</li>
            </ul>
          </div>

          <div className="release-category">
            <ReleaseBadge type="data" />
            <ul>
              <li><strong>New datasets:</strong> popEVE (2025.03), Missense3D (2026.02)</li>
              <li>gnomAD allele frequencies updated — allele count (AC) and number (AN) added</li>
              <li>COSMIC v99 → v103</li>
              <li>Semantic-search text embeddings for function &amp; population annotations</li>
            </ul>
          </div>

        </div>

        <p className="release-data-note">
          Data release 2.1 — adds popEVE, Missense3D and semantic search, and updates gnomAD allele
          frequencies (AC/AN); core genomic–protein mapping remains UniProt 2025_01, with a remap to
          UniProt 2026_01 under way.
        </p>
      </ReleaseNote>

      {/* ── v1.4 ── */}
      <ReleaseNote isDefaultOpen title={<><span className="release-badge release-badge-version">v1.4</span> Remapping &amp; data update <small>2025</small></>}>
        <div className="release-category">
          <ReleaseBadge type="data" />
          <ul>
            <li>Genomic–protein mapping re-run on UniProt 2025_01 &amp; Ensembl 113; GRCh37 ⇄ GRCh38 coverage updated</li>
            <li>RefSeq mapping improved for HGVS p. &amp; c. lookups</li>
            <li>CADD v1.6 → v1.7; stability fix &amp; multi-fragment AlphaFold handling</li>
            <li>gnomAD allele frequencies added (52M+ coding variants)</li>
            <li>dbSNP b155 → b156 (40M+ new IDs); ClinVar 2023-07 → 2025-02 (1.2M+); COSMIC v98 → v99 (~200K)</li>
          </ul>
        </div>
      </ReleaseNote>

      {/* ── v1.0 launch + historical updates ── */}
      <ReleaseNotes />
      </div>}
    </div>
  );
}

function ReleasePage() {
  return <DefaultPageLayout content={<ReleasePageContent/>}/>
}

export default ReleasePage;
