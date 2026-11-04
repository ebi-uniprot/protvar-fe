# <a id="input-formats"></a>Supported Formats

Enter **one variant per line**, in any of the formats below; formats can be mixed in one list. The **Or fill the box by format** chips on the Annotate tab fill the box with the examples shown here.

| Type | Formats | Example |
|---|---|---|
| Genomic | VCF, gnomAD, chromosome + position | 17 7675088 C T |
| HGVS | genomic (g.), coding (c.), protein (p.) | NM_000546.6:c.524G>A |
| Protein | UniProt accession + change | P15056 V600E |
| Variant ID | dbSNP, ClinVar, COSMIC, UniProt | rs334 |

## Genomic

| Format | Example |
|---|---|
| VCF: `CHR POS ID REF ALT (...)` | 7&nbsp;&nbsp;140753336&nbsp;&nbsp;rs113488022&nbsp;&nbsp;A&nbsp;&nbsp;T |
| gnomAD: `CHR-POS-REF-ALT` | 12-25245350-C-T |
| `CHR POS REF ALT` | 17 7675088 C T |
| `CHR:POS:REF:ALT` | 7:55191822:T:G |
| `CHR:POS REF>ALT` | chr11:5227002 T>A |
| `CHR POS REF/ALT` | 19 44908684 T/C |
| Mitochondrial | MT 3460 G A |

**CHR:** 1–22, X, Y, or for mitochondrial DNA M, MT, mit, mtDNA, mitochondria or mitochondrion; a `chr` prefix is optional.  
**POS:** position on the chromosome; thousands separators are accepted (e.g., 17 7,675,088 C T).  
**REF / ALT:** reference and alternative nucleotide (A, C, G or T).

- **VCF:** the first five columns are required; any further columns (QUAL, FILTER, INFO, ...) are ignored. The ID column (or `.`) is not interpreted by ProtVar. Columns can be separated by tabs or spaces, and `#` lines (VCF headers) are skipped.
- **Several alternative alleles** in a VCF line (e.g., 7 140753336 . A T,G) give one variant per allele.
- **Assembly:** positions are GRCh38 unless you select GRCh37, or leave **Auto** to [detect it](#assembly-detection). GRCh37 positions are converted to GRCh38 (e.g., 17 7578406 C T).

## HGVS

| Scheme | Example |
|---|---|
| Genomic (g.) | NC_000007.14:g.140753336A>T |
| Genomic, with a chromosome | chr11:g.5227002T>A |
| Coding (c.) | NM_000518.5:c.20A>T |
| Coding, with the gene | NM_004333.6(BRAF):c.1799T>A |
| Coding, with the protein change | NM_000546.6:c.524G>A p.(Arg175His) |
| Protein (p.) | NP_000509.1:p.Glu7Val |

- The reference sequence is a RefSeq accession: NC_ for g., NM_ for c., NP_ for p. The HGNC gene symbol can follow in brackets.
- With a chromosome instead of an NC_ accession, the position is read in the selected (or detected) assembly, as for other genomic input.
- A c. change can be followed by its protein change, separated by a space or `/`.
- **Only substitutions** are supported: not deletions, duplications, insertions, delins, inversions or frameshifts (e.g., c.235del, p.Gln7fs).
- **Not supported:** the non-coding, mitochondrial and RNA schemes (n., m., r.), and intronic or UTR positions in c. input (e.g., c.128+1G>A, c.-128A>G, c.*128A>G).

## Protein

| Format | Example |
|---|---|
| `ACC REF POS ALT` (1-letter) | P15056 V600E |
| with `p.` | P01116 p.G12D |
| 3-letter | P02649 Cys130Arg |
| any case | p00533 leu858arg |
| `ACC POS REF/ALT` | P38398 61 C/G |
| `ACC POS REF ALT` | Q30201 282 Cys Tyr |
| Stop | P04637 R213* |
| Silent | P40692 G181= |

**ACC:** UniProt accession.  
**POS:** amino acid position in the UniProt sequence.  
**REF / ALT:** amino acid, 1- or 3-letter code. ALT can also be `*` or `Ter` (stop), `=` (silent: same as REF) or `?` (unknown, as in HGVS `p.Met1?`). The same notations work in HGVS p. input.

## Variant ID

| Source | Prefix | Example |
|---|---|---|
| dbSNP | rs | rs334 |
| ClinVar | VCV, RCV (a version such as .133 is optional) | VCV000000642.133, RCV000007540 |
| COSMIC | COSV, COSM, COSN | COSV56056643, COSM521, COSN190667 |
| UniProt | VAR_ + 6 digits | VAR_004109 |

- An ID is a single word; upper or lower case.
- **UniProt variant IDs** (VAR_) are the curated human missense variants in UniProtKB/Swiss-Prot ([humsavar](https://www.uniprot.org/help/humsavar)). ProtVar uses the humsavar file of the same UniProt release as its data, and maps the ID's amino-acid change to its genomic variants.

## Position only

Leave out the alternative allele or amino acid (or both alleles) to get every possible change at a position.

| Input | Gives |
|---|---|
| 17 7675088 | every SNV at the position |
| 7 140753336 A | every change from A |
| 11:5227002:na:na | every SNV (`na` or `.` for a missing allele) |
| P01116 12 | every amino acid change at residue 12 |
| P15056 600 Val | every change from Val |
| P04637 M1? | every change at the start codon |

## Entering or uploading inputs

- **One variant per line.** A line break is the only separator: commas and `|` can be part of a variant (thousands separators, several VCF alleles, VCF INFO columns), so they don't separate variants.
- A **CSV row** is read as one variant, its commas as column separators (e.g., 17,7675088,C,T or "P15056","V600E").
- Quotes around a whole input are ignored (e.g., "P22304 A205P").
- Lines starting with `#` are skipped. Other lines that aren't a variant (such as a spreadsheet header) are listed with a [note](#messages).

## Not supported

ProtVar annotates single-nucleotide variants and single amino acid changes. The following are reported with a specific message:

- Insertions, deletions and multi-nucleotide variants (e.g., 19:18169206:TC:T, 7 140753336 AC TT)
- A protein change without a UniProt accession (e.g., R32C), or with a gene symbol instead (e.g., SMAD4 R361H); use the accession, e.g., P22304 A205P
- HGVS c. input without a RefSeq transcript (e.g., c.1072G>A)
- An identifier on its own, such as a UniProt accession, Ensembl or RefSeq ID; to see all variants of a protein, use [Browse Variants](#browse)
