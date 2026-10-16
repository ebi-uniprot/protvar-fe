# <a id="input-formats"></a>Supported Formats

ProtVar supports the following variant formats:

- **Genomic:** VCF, coordinates, HGVS genomic
- **Protein:** UniProt variants, HGVS protein
- **Transcript:** HGVS coding/cDNA
- **Variant IDs:** dbSNP, ClinVar, COSMIC

## Genomic

Genomic input should follow one of the specified formats.

- **VCF format:** `CHR POS ID REF ALT (...)` (e.g., 1 12345 . A G)  
  _The first five columns of the VCF input are mandatory. Any fields after this (specified as ...) are optional and ignored. The third column is the user-provided variant ID (or `.`), which is not interpreted by ProtVar. Columns can be separated by tabs or spaces, and lines starting with `#` (e.g. VCF headers) are ignored._

- **gnomAD format:** `CHR-POS-REF-ALT` (e.g., 1-12345-A-G)

- **Internal format:** `CHR POS (REF (ALT))` (e.g., X 23456 C T), `CHR:POS(:REF(:ALT))` (e.g., X:23456:C:T) or `CHR:POS REF>ALT` (e.g., chrX:23456 C>T)  
  _The alternative allele, or both the reference and alternative alleles, are optional. If both alleles are provided, space, greater-than (>) sign, or forward slash (/) delimiters in specifying the allele change are all valid. A missing allele can also be given as `na` or `.` (e.g., 12:56478854:na:na)._

**CHR:** Chromosome (1-22, X, Y, M, MT, mit, mtDNA, mitochondria, mitochondrion)  
**POS:** Position on the chromosome (integer); thousands separators are accepted (e.g., chr16:29,847,799 T>C)  
**REF:** Reference nucleotide (A, T, C, G)  
**ALT:** Alternative nucleotide (A, T, C, G)

## Protein

Protein input should follow one of the specified formats.

- `ACC (p.)REF`**`POS`**`ALT` (e.g., P22304 A205P)  
  _The_ `p.` _is optional._

- `ACC POS (REF (ALT))` (e.g., P22309 71 (Gly (Arg)))  
  _The alternative, or both the reference and alternative amino acid, are optional._

- `ACC POS REF/ALT` (e.g., P22304 205 A/P)

**ACC:** UniProt accession  
**POS:** Amino acid position (integer)  
**REF:** Reference amino acid (1- or 3-letter code)  
**ALT:** Alternative amino acid (1- or 3-letter code) or one of:
  - `*` or `Ter` — stop codon
  - `=` — no change / silent (same as the reference amino acid)
  - `?` — unknown variant amino acid (e.g. HGVS `p.Met1?`); treated as unspecified, so results are position- but not variant-specific

_The same `*`/`Ter`, `=` and `?` notations are also accepted in the alternative amino acid of HGVS protein (p.) input._

## HGVS

- The **Reference Sequence** part of the input should be a valid RefSeq identifier with the prefix NC, NM, or NP. Optionally, the HGNC gene symbol can be included within brackets.
- The **Variant Description** part of the input should be valid for the specific scheme.
- **Supported schemes:**
    - HGVS genomic (g.) format (e.g., NC_000001.10:g.12345A>G)  
      _A chromosome can be given instead of the NC accession (e.g., chr11:g.108321424A>G); the position is then read in the selected (or detected) assembly, as for other genomic input._
    - HGVS protein (p.) format (e.g., NP_000001.1:p.Ala123Val)
    - HGVS coding (c.) format (e.g., NM_000001.2:c.123A>G)  
      _The protein change can follow, separated by a space or `/` (e.g., NM_000316.3:c.1393G>A p.(Glu465Lys))._

- **Only substitutions are supported.** Deletions, duplications, insertions, delins, inversions and frameshifts (e.g., c.235del, p.Gln7fs) are not.
- **Unsupported schemes:** HGVS non-coding, mitochondrial, and RNA schemes (n., m., r.).
- **Unsupported positions:** intronic and UTR positions in c. input (e.g., c.128+1G>A, c.-128A>G, c.*128A>G).

## Variant ID

Variant ID input must be a single word with no spaces, beginning with a specific prefix.

- **Examples:** rs12345, RCV0123, COSM9876
- **Prefixes:** dbSNP (rs), ClinVar (RCV or VCV), COSMIC (COSV, COSM, or COSN)

## Entering or uploading inputs

- Enter one variant per line. Commas also separate inputs, so a CSV row is read as separate values; upload a plain-text file with one variant per line rather than a spreadsheet export.
- Quotes around a whole input are ignored (e.g., "P22304 A205P").
- Lines starting with `#` are ignored.

## Not supported

ProtVar annotates single-nucleotide variants and single amino acid changes. The following are not supported, and are reported with a specific message:

- Insertions, deletions and multi-nucleotide variants (e.g., 19:18169206:TC:T, 7 140753336 AC TT)
- A protein change without a UniProt accession (e.g., R32C), or with a gene symbol instead (e.g., SMAD4 R361H); use the accession, e.g., P22304 A205P
- HGVS c. input without a RefSeq transcript (e.g., c.1072G>A)
- An identifier on its own, such as a UniProt accession, Ensembl or RefSeq ID; to see all variants of a protein, use Search
