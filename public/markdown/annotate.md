# <a id="annotate"></a>Annotate Variants

The **Annotate Variants** tab on the home page accepts a list of human [missense](#glossary:missense) variants and returns a results table with mappings, predictions and annotations. To explore every known variant for a protein or gene instead, see [Browse Variants](#browse).

![Annotate Variants tab](images/home.png)

## Input mode

- **Type / Paste** — enter variants directly, one per line. Use the **Try these examples** chips below the box to populate it with sample inputs in each [supported format](#input-formats) (VCF, HGVS, UniProt, dbSNP, ClinVar, COSMIC).
- **Upload File** — upload a plain-text file (.txt, .tsv, .csv or .vcf, up to 10 MB) for larger jobs. Any common delimiter (space, tab, comma) works; header lines and extra columns are ignored, and rows are processed in input order.

## Genome assembly

Set **Assembly** to **GRCh38** or **GRCh37** if you know which one your genomic input uses. Leave it on **Auto** to let ProtVar [predict the assembly](#assembly-detection) by sampling the input. Assembly is only relevant for genomic input — protein and transcript identifiers are unaffected.

## Submit

**Submit** sends your input. A single variant opens its result directly. Several variants, or a file, are uploaded and open the [Results](#results) page for that upload, where you can [filter and sort](#browse:filtering-your-uploads) them and see which lines have [notes](#messages). **Clear** empties the form.

Uploads are saved in [Activity → History](#activity:activity-history), where you can rename, share or delete them; they are kept for 90 days. A single-variant lookup is not saved — use **Share** to keep its link.
