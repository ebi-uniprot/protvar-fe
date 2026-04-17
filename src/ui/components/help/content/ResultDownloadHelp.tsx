import React from "react";
import {statusMap} from "../../../pages/download/DownloadPage";

export const ResultDownloadHelp = () => {
  return <div className="help-content">
    <h1 id="result-download">Result Download</h1>

    <p>
      Downloads can be requested from any result page using the <i className="bi bi-download"></i> <strong>Download</strong> button
      in the toolbar. The same options apply regardless of how the results were obtained.
    </p>

    <p><strong>Download ID Format</strong></p>
    <p>Each download is assigned a unique ID based on the full request — what data is being downloaded,
      which annotations are included, and which page or filter is active. The same request always produces
      the same ID, so if a file already exists it is served directly without regeneration.</p>

    <p>The format is:</p>
    <p><code>PREFIX[-fun][-pop][-str][-PAGE-PAGESIZE][-ASSEMBLY][-filterHash]</code></p>

    <p><strong>PREFIX</strong> depends on the type of result:</p>
    <ul>
      <li><strong>Single variant query</strong> — a short hash derived from the query string
        (e.g. <code>3a7f…</code>). The query text is hashed to keep the filename short.</li>
      <li><strong>Uploaded result</strong> — the first 8 characters of the result ID
        (e.g. <code>abc12345</code>), matching the ID shown on the result page.</li>
      <li><strong>Identifier browse</strong> (UniProt, Gene, PDB, Ensembl, RefSeq) — the identifier value
        (e.g. <code>P22304</code>, <code>BRCA2</code>).
        Multiple identifiers are joined with an underscore
        (e.g. <code>P22304_6ioz</code>).</li>
      <li><strong>Filter-only browse</strong> (no identifier) — <code>all</code>.</li>
    </ul>

    <p><strong>Annotation flags</strong> (appended when selected):</p>
    <ul>
      <li><code>-fun</code> — functional annotations included</li>
      <li><code>-pop</code> — population observation data included</li>
      <li><code>-str</code> — structural data included</li>
    </ul>

    <p><strong>Pagination</strong> — appended when downloading the current page rather than all results:</p>
    <ul>
      <li><code>-PAGE-PAGESIZE</code> — e.g. <code>-1-50</code> for page 1 with 50 results per page</li>
    </ul>

    <p><strong>Assembly</strong> — appended when explicitly set (omitted when AUTO):</p>
    <ul>
      <li>e.g. <code>-GRCh38</code> or <code>-GRCh37</code></li>
    </ul>

    <p><strong>Filter hash</strong> — a 6-character hash appended when any advanced filters are active
      (score thresholds, pathogenicity classes, allele frequency, structural constraints, etc.).
      Changing any filter produces a different hash and therefore a new file.</p>

    <p><strong>Examples</strong></p>
    <ul>
      <li><code>P22304-fun-pop</code> — full UniProt browse, functional + population annotations, no pagination</li>
      <li><code>P22304-fun-pop-1-50</code> — same, page 1, 50 results per page</li>
      <li><code>abc12345-str-GRCh38</code> — uploaded result, structural annotations, GRCh38 assembly</li>
      <li><code>BRCA2-fun-pop-str-1-100-ab12cd</code> — gene browse with all annotations, page 1/100, active filters</li>
    </ul>

    <p><strong>Download Management</strong></p>
    <p>Use <em>edit</em> <i className="bi bi-pencil"></i>, <em>download</em> <i
      className="bi bi-download"></i> and <em>delete</em> <i className="bi bi-trash"></i> to manage downloads.</p>

    <p><strong>Download Status</strong></p>
    <ul>
      <li><span className={statusMap[1].icon}></span> <em>{statusMap[1].text}:</em> The download is prepared and
        available for retrieval.
      </li>
      <li><span className={statusMap[0].icon}></span> <em>{statusMap[0].text}:</em> The download is currently
        being prepared and will be available soon.
      </li>
      <li><span className={statusMap[-1].icon}></span> <em>{statusMap[-1].text}:</em> The download cannot be
        prepared due to an error or missing data.
      </li>
    </ul>
  </div>
}
