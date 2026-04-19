import React from 'react'
import { DOWNLOAD_STATUS_INFO } from '../../../../types/DownloadRecord'

export const ActivityHelp = () => (
  <div className="help-content">
    <h1 id="activity">Activity</h1>

    <p>
      The Activity page is your personal record of searches and downloads within ProtVar.
      It has two tabs: <strong>History</strong> and <strong>Downloads</strong>.
      Switch to <strong>Grouped</strong> view to see downloads grouped under their originating result.
    </p>

    <h2 id="activity-history">History</h2>
    <p>
      History records two kinds of entries:
    </p>
    <ul>
      <li>
        <strong>Submitted</strong> — variant inputs uploaded as a file or pasted as text.
        These are saved automatically when you submit. Submitted entries expire after 90 days
        of inactivity and are then removed automatically.
      </li>
      <li>
        <strong>Browse</strong> — results explored by biological identifier (UniProt, Gene, PDB,
        Ensembl, RefSeq). These are <em>not</em> saved automatically — use the{' '}
        <i className="bi bi-bookmark" /> <strong>Save</strong> button in the result page toolbar
        to add them to your history. Saved browse entries are kept until you delete them.
      </li>
    </ul>
    <p>
      Direct variant queries (via a shared link like <code>/search?q=…</code>) are not recorded,
      as they are single-input lookups designed for quick sharing rather than ongoing analysis.
    </p>
    <p>
      Use <i className="bi bi-pencil" /> to rename, <i className="bi bi-share" /> to share,
      and <i className="bi bi-trash" /> to delete entries.
    </p>

    <h2 id="activity-downloads">Downloads</h2>
    <p>
      Downloads can be requested from any result page using the{' '}
      <i className="bi bi-download" /> <strong>Download</strong> button in the toolbar.
      The same options apply regardless of input type.
    </p>

    <p><strong>Download ID format</strong></p>
    <p>
      Each download is assigned a unique ID based on the full request — input source,
      annotations, pagination, assembly, and active filters.
      The same request always produces the same ID, so existing files are served directly
      without regeneration.
    </p>
    <p>Format: <code>PREFIX[-fun][-pop][-str][-PAGE-PAGESIZE][-ASSEMBLY][-filterHash]</code></p>
    <p><strong>PREFIX</strong> by input type:</p>
    <ul>
      <li><strong>Single variant query</strong> — short hash of the query string</li>
      <li><strong>Uploaded result</strong> — first 8 characters of the result ID</li>
      <li><strong>Identifier browse</strong> (UniProt, Gene, PDB, Ensembl, RefSeq) — the identifier value,
        multiple joined with <code>_</code> (e.g. <code>P22304_6ioz</code>)</li>
      <li><strong>Filter-only browse</strong> — <code>all</code></li>
    </ul>
    <p><strong>Annotation flags:</strong> <code>-fun</code> functional · <code>-pop</code> population · <code>-str</code> structural</p>
    <p><strong>Pagination</strong> (current page only): <code>-PAGE-PAGESIZE</code> e.g. <code>-1-50</code></p>
    <p><strong>Assembly</strong> (when set explicitly): e.g. <code>-GRCh38</code></p>
    <p><strong>Filter hash</strong>: 6-character hash appended when advanced filters are active</p>

    <p><strong>Examples</strong></p>
    <ul>
      <li><code>P22304-fun-pop</code></li>
      <li><code>abc12345-str-GRCh38</code></li>
      <li><code>BRCA2-fun-pop-str-1-100-ab12cd</code></li>
    </ul>

    <p><strong>Download status</strong></p>
    <ul>
      <li><span className={DOWNLOAD_STATUS_INFO.ready.icon} /> <em>{DOWNLOAD_STATUS_INFO.ready.text}:</em> File is prepared and available for download.</li>
      <li><span className={DOWNLOAD_STATUS_INFO.processing.icon} /> <em>{DOWNLOAD_STATUS_INFO.processing.text}:</em> File is being generated — check back shortly.</li>
      <li><span className={DOWNLOAD_STATUS_INFO.pending.icon} /> <em>{DOWNLOAD_STATUS_INFO.pending.text}:</em> Job is queued, generation will begin soon.</li>
    </ul>

    <p>
      Use <i className="bi bi-pencil" /> to rename, <i className="bi bi-download" /> to download,
      and <i className="bi bi-trash" /> to delete entries.
    </p>
  </div>
)
