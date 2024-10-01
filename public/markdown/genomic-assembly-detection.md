#### <a id="genomic-assembly-detection"></a>Genomic Assembly Detection
The steps in the build determination procedure are as follows:

- Extract all of the genomic coordinates from the input
- Randomly select 10 inputs

- If fewer than 10 genomic inputs are submitted, assume the inputs are GRCh38.
> Auto-detect not possible on fewer than 10 inputs. Variants assumed to be based on the GRCh38 assembly

- Else: Check the GRCh38 reference nucleotides against the input reference nucleotides

    - If higher than 75% match then mark as GRCh38
    > Auto detect assumes that your variants are based on the GRCh38 assembly (9/10 nts matched the reference sequence). If your variants are from GRCh37 then please select the appropriate radio button on the submission page.

    - Else: match then check the reference nucleotides against GRCh37

        - If over 75% match then convert all to GRCh38 and:
        > Auto detect assumes that your variants are based on the GRCh37 assembly (9/10 nts matched the reference sequence). If your variants are from GRCh38 then please select the appropriate radio button on the submission page.
        - Else: Give no mapping found errors for each and the info at the top of the page
        > Auto detect has been unable to detect which build the variants are based on (1/10 match GRCh38, 3/10 match GRCh37). Please check your variant input format. Mixed GRCh37/38 VCFs not permitted. Please separate them if you have mixed inputs.
