#### <a id="genomic-assembly-detection"></a>Genomic Assembly Detection
The steps in the build determination procedure are as follows:

- Count number of genomic variants:
- If (fewer than 10)
  - use all the variants
- Else
  - Randomly select 10 from the whole vcf inputs

- Check the input reference nucleotides against the GRCh38 reference nucleotides and GRCh37.

- If (38 score > 75% and 37 score <25%)
  - = GRCh38
  - > Genomic variants assembly predicted to be GRCh38 (x% GRCh38, y% GRCh37 matches)
- If (37 score > 75% and 38 score <25%)
  - = GRCh37
  - > Genomic variants assembly predicted to be GRCh37 (x% GRCh37, y% GRCh38 matches)
- Else
  - = unknown build
  - > Unable to predict which genome assembly was inputted (x% GRCh38, y% GRCh37 matches). Defaulting to GRCh38