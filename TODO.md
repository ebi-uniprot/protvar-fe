# protvar-fe — TODO

- [ ] **Split semantic search into per-corpus API calls** (#29)
  Function paints before the heavier population. BE: add
  `corpus=function|population` param (back-compatible). FE: split
  `SemanticSearchPage` into two parallel per-corpus fetches with separate
  loading/page/hasMore + per-section "Load more". Scope: BE ~15 lines,
  FE ~60–100 lines.

- [ ] **Stats subsystem redesign (new stats table)**
  Replace the append-only `stats` table with a new table (keep old for
  comparison). New schema: `release, group, dataset, metric, value,
  source_version, source_table, computed_at` + UNIQUE(release, group,
  dataset, metric) for upsert. Fixes: versions come from the data
  (`source_version`) not FE env/hardcoded dates; no false "updated today"
  (`computed_at` is audit only); one shared taxonomy (sequences_mapping /
  variant_id / population / variant_effect / structural) used by importer +
  FE; CADD grouped with variant-effect predictors. Importer
  (`protvar-import`/`protvar-common`, on a clean branch — repos unreviewed):
  StatsRunner/StatsAggregator/ReleaseConfig add popEVE + Missense3D, point
  cosmic→v103 and allelefreq→gnomad_allele_freq, upsert + source_version.
  FE: rebuild `StatsTable` into the 5 groups with granular metrics as
  sub-rows, and delete `StatsDisplayGroup` (the raw dump becomes redundant).

- [ ] **Animated / rotating 3D amino-acid models (fun tab)**
  Replace the static aa PNGs with a model rotating around an axis for a 3D feel.
  Can't be derived from the current single-view PNGs (no depth) — needs
  re-rendering from the 3D structures (PyMOL / RDKit / 3Dmol.js) into per-frame
  animation. Format options: GIF (simple, limited colour/size), APNG or
  animated WebP (better quality + alpha), short MP4/WebM, or an interactive
  3Dmol.js / Mol* viewer (true draggable 3D). Recommend WebP/APNG or an
  interactive viewer over GIF.
