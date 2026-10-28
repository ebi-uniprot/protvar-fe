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
      {/* ── v2.1 ── */}
      <ReleaseNote isDefaultOpen title={<><span className="release-badge release-badge-version">v2.1</span> UniProt 2026_02 data &amp; AlphaGenome Variant Impact <small>2026</small></>}>
        <div className="release-categories">
          <div className="release-category">
            <ReleaseBadge type="ui" />
            <ul>
              <li>AlphaGenome Variant Impact (AVI) score — in the predictions panel, as an optional result column coloured by genome-wide rank (top 10% / 1% / 0.3% / 0.1%), sortable, and as quick filters (top 10%, 1%, 0.1%)</li>
              <li>Filter and sort your own uploaded variants (Annotate) with the same filters as browse; a large upload shows a short "preparing" step the first time it's filtered</li>
              <li>Filters in a side panel next to the results, which you can collapse; a filtered upload shows how many of its inputs match</li>
              <li>Isoform labels mark reviewed isoforms (iso) and unreviewed entries (unr)</li>
              <li>Result table — choose columns; Genomic, Genomic + protein and Protein views; aligned score columns, tidier mobile cards</li>
              <li>Semantic search — two new models, Qwen3 (now the default) and EmbeddingGemma; help explains how the models were compared</li>
              <li>Release page Statistics tab with live figures for the current data release</li>
              <li>Version menu shows the data release as the UniProt release, with all source versions</li>
              <li>Help — download format matches the CSV columns; VCF input notes</li>
            </ul>
          </div>

          <div className="release-category">
            <ReleaseBadge type="api" />
            <ul>
              <li>AVI score in mapping responses and downloads (new CSV column); sort=avi; aviMin filter</li>
              <li>Semantic search: qwen3 (default) and gemma models</li>
              <li>GET /stats — the current release's statistics (replaces /stats/latest and /stats/&#123;type&#125;/&#123;key&#125;)</li>
              <li>A non-canonical isoform given as input returns its own mapping first (with a note); genes are never dropped from a result; stable result order</li>
            </ul>
          </div>

          <div className="release-category">
            <ReleaseBadge type="data" />
            <ul>
              <li>Genomic–protein mapping rebuilt on UniProt 2026_02 &amp; Ensembl 115 — 266.6M mapped positions (+57%); every Ensembl transcript encoding the exact protein sequence is linked (158K transcripts, +43%); 93.1% of reviewed human proteins mapped</li>
              <li><strong>New dataset:</strong> AlphaGenome Variant Impact (AVI) scores for all 107.9M possible coding SNVs</li>
              <li>CADD v1.7 recomputed on the new coding regions (107.9M variants)</li>
              <li>dbSNP b156 → b157 (26.9M coding SNVs, +49%)</li>
              <li>popEVE 2025.03 → 2025.07 (single-nucleotide-reachable changes)</li>
              <li>Function, population &amp; structure annotations from UniProt 2026_02 (+6.6% features; 76K PDB structures, +9%); semantic-search texts and embeddings rebuilt</li>
            </ul>
          </div>
        </div>

        <p className="release-data-note">
          Data 2026_02 — core mapping on UniProt 2026_02 and Ensembl 115; ClinVar 2025-02, COSMIC v103 and
          gnomAD v4.1.0 unchanged. RefSeq links are 15% lower: Ensembl 115 dropped UniProt cross-references
          for ~9K RefSeq proteins; we will restore them from our own mapping in the next update.
        </p>
      </ReleaseNote>

      {/* ── v2.0 ── */}
      <ReleaseNote isDefaultOpen title={<><span className="release-badge release-badge-version">v2.0</span> ProtVar 2.0 <small>2026</small></>}>
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
          Data 2025_01 — adds popEVE, Missense3D and semantic search, and updates gnomAD allele
          frequencies (AC/AN); core genomic–protein mapping on UniProt 2025_01.
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
