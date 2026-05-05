# <a id="annotate"></a>Annotate Variants

The **Annotate Variants** tab on the home page accepts a list of human [missense](#glossary:missense) variants and returns a results table with mappings, predictions and annotations. To explore every known variant for a protein or gene instead, see [Browse by Identifier](#browse).

![Annotate Variants tab](images/home.png)

## Input mode

- **Type / Paste** — enter variants directly, one per line. Use the **Try these examples** chips below the box to populate it with sample inputs in each [supported format](#input-formats) (VCF, HGVS, UniProt, dbSNP, ClinVar, COSMIC).
- **Upload File** — upload a plain-text file for larger jobs. Any common delimiter (space, tab, comma) works; header lines and extra columns are ignored, and rows are processed in input order.

## Genome assembly

Set **Assembly** to **GRCh38** or **GRCh37** if you know which one your genomic input uses. Leave it on **Auto** to let ProtVar [predict the assembly](#assembly-detection) by sampling the input. Assembly is only relevant for genomic input — protein and transcript identifiers are unaffected.

## Submit

**Submit** queues the input, then opens the [Results](#results) page once mapping completes. **Clear** empties the input box.

The submission is recorded in [Activity → History](#activity:activity-history); from there you can rename, share or delete the job, and re-run it later.
