# <a id="results"></a>Results

The **Results** page is the main landing for any query. Each row is a variant; columns group into **Genomic**, **Protein**, and **Annotations**.

![Result page](images/result.png)

## Header and toolbar

The title shows what you are looking at (Results, UniProt, Gene, … › name) and a count of variants. For an upload, a summary shows how many lines it has, how many mapped, how many could not be mapped and how many have [notes](#messages); click a count to show those lines. With filters on, it shows how many of the lines match. Messages about your input, such as the detected [genome assembly](#assembly-detection), appear below.

Above the table:

- **Pagination** (left; repeated below the table) — page and page size (25, 50 or 100), kept in the URL.
- **View** — how the results look; changes apply at once and are remembered in this browser:
  - **Layout** — *Rows* (one continuous table), *Cards* (one card per input line) or *Compact* (cards with tighter spacing).
  - **Columns** — start from a preset, *Genomic*, *Genomic + protein* (default) or *Protein*, then add or remove columns (e.g. add **AVI**); *Custom* shows when your choice matches no preset. Position, gene, isoform, amino-acid change and annotations are always shown. Downloads always include all columns.
  - **Colours** — *ProtVar colours* (standardised pathogenicity colours) or each tool's original colours.
- **Share** — copy a link to the current view (filters, sort and page included).
- **Save** — browse results only; adds the page to [History](#activity:activity-history).
- **Legends** — colour bands and score ranges.
- **Download** — open the [Download Panel](#download-panel).

Filters and sorting are described under [Browse Variants](#browse); they also work on your uploads. A single-variant lookup has no filters.

## Columns

- **Genomic** — variant ID, [genomic position](#further-info:genomic-position) (*37→38* marks a converted GRCh37 input), gene, mRNA codon with strand (e.g. *aAc/aCc (+)*), [CADD](#glossary:cadd) and, optionally, AVI.
- **Protein** — isoform pill and accession, protein name, amino-acid change, consequence (*miss* / *syn* / *stop*), popEVE and [AlphaMissense](#predictions).
  - `can` — UniProt canonical isoform; `iso` — another [isoform](#glossary:isoforms) of a reviewed entry; `unr` — unreviewed (TrEMBL) entry.
  - Canonical mappings are listed first; the chevron shows the other isoforms the variant maps to.
  - When ProtVar has no readable codon at a position, the amino-acid change shows as *?* (note PV-113).
- **Annotations** — [Function](#function), [Population](#population) and [Structure](#structure) panels, on canonical-isoform rows.

Scores are shown as compact coloured pills; *NA* means no score is available.

## Notes on rows

A small coloured corner on a row means ProtVar has a note about that input line — for example, that the reference you gave differs from UniProt's, or that every change at a position is shown because no alternative was given. Hover the corner to read it, or click to open it under the row. Lines that could not be mapped are shown as a message row instead. See [Messages and notes](#messages) for every code.

## Saved to history

Uploads (several variants, or a file) are saved automatically. A single variant typed on the home page is not; use **Share** to keep its link. Browse results need an explicit **Save**. Saved entries appear in [Activity → History](#activity:activity-history).
