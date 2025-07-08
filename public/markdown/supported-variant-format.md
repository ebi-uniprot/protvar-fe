#### <a id="supported-variant-format"></a>Supported Variant Format

ProtVar supports the following input formats:

##### Genomic

Genomic input should follow one of the specified formats.

- **VCF format:** `CHR POS ID REF ALT (...)` (e.g., 1 12345 . A G)  
  _The first five columns of the VCF input are mandatory. Any fields after this (specified as ...) are optional and ignored. The third column is the user-provided variant ID, which is not interpreted by ProtVar._

- **gnomAD format:** `CHR-POS-REF-ALT` (e.g., 1-12345-A-G)

- **Internal format:** `CHR POS (REF (ALT))` (e.g., X 23456 C T)  
  _The alternative allele, or both the reference and alternative alleles, are optional. If both alleles are provided, space, greater-than (>) sign, or forward slash (/) delimiters in specifying the allele change are all valid._

**CHR:** Chromosome (1-22, X, Y, M, MT, mit, mtDNA, mitochondria, mitochondrion)  
**POS:** Position on the chromosome (integer)  
**REF:** Reference nucleotide (A, T, C, G)  
**ALT:** Alternative nucleotide (A, T, C, G)

##### Protein

Protein input should follow one of the specified formats.

- `ACC (p.)REF`**`POS`**`ALT` (e.g., P22304 A205P)  
  _The_ `p.` _is optional._

- `ACC POS (REF (ALT))` (e.g., P22309 71 (Gly (Arg)))  
  _The alternative, or both the reference and alternative amino acid, are optional._

- `ACC POS REF/ALT` (e.g., P22304 205 A/P)

**ACC:** UniProt accession  
**POS:** Amino acid position (integer)  
**REF:** Reference amino acid (1- or 3-letter code)  
**ALT:** Alternative amino acid (1- or 3-letter code, TER, *, =)

##### HGVS

- The **Reference Sequence** part of the input should be a valid RefSeq identifier with the prefix NC, NM, or NP. Optionally, the HGNC gene symbol can be included within brackets.
- The **Variant Description** part of the input should be valid for the specific scheme.
- **Supported schemes:**
    - HGVS genomic (g.) format (e.g., NC_000001.10:g.12345A>G)
    - HGVS protein (p.) format (e.g., NP_000001.1:p.Ala123Val)
    - HGVS coding (c.) format (e.g., NM_000001.2:c.123A>G)

- **Unsupported schemes:** HGVS non-coding, mitochondrial, and RNA schemes (n., m., r.).

##### Variant ID

Variant ID input must be a single word with no spaces, beginning with a specific prefix.

- **Examples:** rs12345, RCV0123, COSM9876
- **Prefixes:** dbSNP (rs), ClinVar (RCV or VCV), COSMIC (COSV, COSM, or COSN)
