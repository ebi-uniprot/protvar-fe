# <a id="assembly-detection"></a>Genomic Assembly Detection

ProtVar's annotations are built on **GRCh38**. Genomic coordinates submitted on **GRCh37** (hg19) are converted to GRCh38 before mapping. The **Assembly** toggle on the Annotate Variants tab tells ProtVar which assembly your coordinates use:

- **GRCh38** / **GRCh37** — use this assembly for all genomic inputs. Recommended whenever you know it.
- **Auto** — ProtVar guesses the assembly from your input, as described below.

## Which inputs are checked

Only genomic coordinates whose assembly is not implied by the input itself: VCF, gnomAD and coordinate formats, and HGVS genomic input given with a chromosome (e.g. `chr1:g.12345A>G`). HGVS genomic input with a RefSeq accession (e.g. `NC_000001.10:g.12345A>G`) already states its assembly through the accession version, so it is not part of the check (GRCh37 accessions such as `NC_000001.10` are always converted). Protein, cDNA and variant-ID inputs don't depend on the assembly.

## How Auto works

1. **Sample.** If you submit fewer than 10 genomic variants, all are used; otherwise 100 are picked at random.
2. **Compare.** The reference nucleotide of each sampled variant is checked against both the GRCh38 and the GRCh37 reference at that position, giving a percentage match for each.
3. **Decide.**
   - more than 75% GRCh38 matches and fewer than 25% GRCh37 matches → **GRCh38**
   - more than 75% GRCh37 matches and fewer than 25% GRCh38 matches → **GRCh37**
   - anything else → inconclusive, and ProtVar **defaults to GRCh38**

The outcome is shown as a message on the result page, for example:

> Genomic variants assembly predicted to be GRCh37 (92.00% GRCh37, 4.00% GRCh38 matches)

> Unable to predict which genome assembly was inputted (40.00% GRCh38, 35.00% GRCh37 matches). Defaulting to GRCh38

## Limitations

- **Protein-coding positions only.** The comparison uses ProtVar's GRCh37↔GRCh38 equivalence table, which covers protein-coding positions. Non-coding variants count as non-matches for both assemblies, so input that is mostly non-coding (e.g. a whole-genome VCF) is often inconclusive and falls back to GRCh38. For the same reason, non-coding GRCh37 coordinates can't be converted and are reported with *Unable to map GRCh37 to GRCh38 coordinate*. These variants have no protein consequence, so no annotations are lost.
- **A reference allele is needed.** Inputs given without a reference nucleotide (e.g. `X 23456`) can't be compared, so they count as non-matches.
- **Small or random samples.** With only a few variants, a single mismatch moves the percentages a lot. For larger inputs the random sample means borderline cases can be decided differently on resubmission.

If the detected assembly looks wrong, resubmit with **GRCh38** or **GRCh37** selected explicitly. See also [Genome assembly](#further-info:genome-assembly).
