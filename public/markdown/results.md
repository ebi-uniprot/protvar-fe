# <a id="results"></a>Results

The **Results** page is the main landing for any query. Each row is a variant; columns group into **Genomic**, **Protein**, and **Annotations**.

![Result page](images/result.png)

## Header and toolbar

The header shows the query and variant count. A status line below reports the number of inputs and, for genomic input, the auto-detected [genome assembly](#further-info:genome-assembly) with its confidence breakdown.

The toolbar offers:

- **ProtVar colours** — toggle between ProtVar's standardised pathogenicity colours and each tool's original colours.
- **Legends** — popup mapping every colour band to its score range.
- **Share** — copy a permalink to the current view (filters and pagination preserved).
- **Download** — open the [Download Panel](#download-panel) to queue a CSV.

## Columns

Three top-level groups:

- **Genomic** — variant ID, [genomic position](#further-info:genomic-position), gene symbol, codon change with strand (e.g. *aAc/aCc (+)*), and the [CADD](#glossary:cadd) score.
- **Protein** — UniProt isoform pill (`can` for canonical, `iso` for an [alternative isoform](#glossary:isoforms) — expand to see other mappings), protein name, amino-acid change, consequence (*MISS* / *SYN* / *STOP*), popEVE and [AlphaMissense](#predictions).
- **Annotations** — three icons that expand a panel below the row: [Function](#function), [Population](#population) and [Structure](#structure).

## Pagination

Pagination and page-size controls below the table are reflected in the URL, so the page snapshot can be shared or revisited as-is.

## Saved to history

Submitted results are auto-saved; browse results need an explicit **Save** click in the toolbar. Either way, the entry appears in [Activity → History](#activity:activity-history) for later access.
