#### <a id="genomic-assembly-detection"></a>Genomic Assembly Detection
The steps in the build determination procedure are as follows:

1. Count number of genomic variants
2. If (fewer than 10)
  - use all the variants
3. Else
  - Randomly select 10 from the whole VCF inputs

4. Check the input reference nucleotides against the GRCh38 reference nucleotides and GRCh37

5. If (38 score > 75% and 37 score <25%) __=GRCh38__
  > Genomic variants assembly predicted to be GRCh38 (x% GRCh38, y% GRCh37 matches)
6. If (37 score > 75% and 38 score <25%) __=GRCh37__
  > Genomic variants assembly predicted to be GRCh37 (x% GRCh37, y% GRCh38 matches)
7. Else __=unknown build__
  > Unable to predict which genome assembly was inputted (x% GRCh38, y% GRCh37 matches). Defaulting to GRCh38