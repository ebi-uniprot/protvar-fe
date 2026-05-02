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
        These are saved automatically when you submit. Submitted entries expire 90 days
        after submission and are then removed automatically.
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

    <p><strong>Job name</strong></p>
    <p>
      Each submission has an optional <em>job name</em>. If you leave it blank, a default is
      suggested based on what you're downloading — e.g. <code>BRCA1</code> for a gene browse,
      <code>P22304, 6ioz</code> for a multi-identifier browse, the variant string for a single
      query, or labels like <code>Pocket browse</code> / <code>Known variants</code> for filter-only
      downloads. You can override this with anything more meaningful for your records.
    </p>
    <p>
      The download itself is identified internally by a server-allocated job ID (UUID).
      The job ID isn't shown by default — the job name and the page snapshot in the row are what
      you'll recognise it by.
    </p>

    <p><strong>Size limit</strong></p>
    <p>
      Full downloads (all pages) are capped at 100,000 rows. Larger requests are rejected at
      submit time with a message asking you to refine your filters. For bulk pre-computed
      datasets, use the FTP site link at the top of the Downloads tab.
    </p>

    <p><strong>Retention</strong></p>
    <p>
      Generated files and their status are kept for 30 days. After that, the entry shows as{' '}
      <em>Expired</em> and you can clear it with <i className="bi bi-trash" />.
    </p>

    <p><strong>Download status</strong></p>
    <ul>
      <li><span className={DOWNLOAD_STATUS_INFO.queued.icon} /> <em>{DOWNLOAD_STATUS_INFO.queued.text}:</em> Job submitted, awaiting a worker.</li>
      <li><span className={DOWNLOAD_STATUS_INFO.processing.icon} /> <em>{DOWNLOAD_STATUS_INFO.processing.text}:</em> File is being generated — check back shortly.</li>
      <li><span className={DOWNLOAD_STATUS_INFO.ready.icon} /> <em>{DOWNLOAD_STATUS_INFO.ready.text}:</em> File is prepared and available for download.</li>
      <li><span className={DOWNLOAD_STATUS_INFO.failed.icon} /> <em>{DOWNLOAD_STATUS_INFO.failed.text}:</em> Generation didn't complete; the row shows a brief reason.</li>
      <li><span className={DOWNLOAD_STATUS_INFO.expired.icon} /> <em>{DOWNLOAD_STATUS_INFO.expired.text}:</em> Past the 30-day retention window — file no longer available.</li>
    </ul>

    <p>
      Use <i className="bi bi-pencil" /> to rename, <i className="bi bi-download" /> to download,
      and <i className="bi bi-trash" /> to delete entries.
    </p>
  </div>
)
