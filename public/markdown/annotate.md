# <a id="annotate"></a>Annotate Variants

The **Annotate Variants** tab on the home page accepts a list of human [missense](#glossary:missense) variants and returns a results table with mappings, predictions and annotations. To explore every known variant for a protein or gene instead, see [Browse Variants](#browse).

![Annotate Variants tab](images/home.png)

## Input mode

- **Type / Paste** — enter variants directly, one per line. Below the box, **Try a well-known variant** opens the result for a famous variant, and **Or fill the box by format** fills it with examples of every [supported format](#input-formats) (genomic, HGVS, UniProt, variant IDs, position only, GRCh37).
- **Upload File** — upload a plain-text file (.txt, .tsv, .csv or .vcf, up to 10 MB) for larger jobs, one variant per line. Columns can be separated by spaces, tabs or commas; `#` lines are skipped, extra VCF columns are ignored, and rows are processed in input order.

## Genome assembly

Set **Assembly** to **GRCh38** or **GRCh37** if you know which one your genomic input uses. Leave it on **Auto** to let ProtVar [predict the assembly](#assembly-detection) by sampling the input. Assembly is only relevant for genomic input — protein and transcript identifiers are unaffected.

## Submit

**Submit** sends your input. A single variant opens its result directly. Several variants, or a file, are uploaded and open the [Results](#results) page for that upload, where you can [filter and sort](#browse:filtering-your-uploads) them and see which lines have [notes](#messages). **Clear** empties the form.

Uploads are saved in [Activity → History](#activity:activity-history), where you can rename, share or delete them; they are kept for 90 days. A single-variant lookup is not saved — use **Share** to keep its link.
