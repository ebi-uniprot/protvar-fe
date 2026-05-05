# <a id="further-info"></a>Further Information

Additional reference material that doesn't belong on a feature page. For term definitions, see the [Glossary](#glossary).

## <a id="further-info:contact"></a>Contact

Questions, bug reports, or feature requests? Use the [contact form](/ProtVar/contact) and the ProtVar team will get back to you.

## <a id="further-info:rest-api"></a>REST API

A REST API is available for programmatic access — useful for pipeline integration or scripted lookups. Click **API Docs** in the top navigation for the full Swagger UI. Every annotation available in the UI download is also available via the API.

## <a id="further-info:mapping"></a>How ProtVar maps variants

ProtVar normalises every input format to the same internal representation: a position on the GRCh38 reference assembly mapped to a UniProt canonical isoform and amino-acid position. Annotations are then retrieved against that canonical mapping.

### <a id="further-info:genomic-position"></a>Genomic position

A genomic position is the chromosome and 1-based coordinate of a variant on a specific reference assembly. Result rows show the codon containing the variant (with the changed position in upper case), the reference and alternative nucleotides, and the [CADD](#glossary:cadd) score.

### <a id="further-info:genome-assembly"></a>Genome assembly (GRCh37 / GRCh38)

ProtVar's annotations are built against GRCh38, but GRCh37 input is supported. GRCh37 coordinates are lifted to GRCh38 using pre-mapped equivalency tables derived from [CrossMap](https://crossmap.sourceforge.net/).

If you know the assembly, specify it on submission. Otherwise ProtVar auto-detects by comparing the nucleotides at each input coordinate against both reference assemblies — this is unreliable for very small sets (fewer than ~10 variants), so explicit selection is recommended for short queries.

### Genomic coordinates → protein positions

ProtVar maps genomic coordinates to protein positions by walking Ensembl exon boundaries onto transcripts, matching translated transcripts to UniProt canonical isoforms, and computing the protein position. The canonical isoform is shown by default because UniProt annotations use its numbering.

### Protein position → genomic coordinates

If a UniProt accession and amino-acid position are submitted, ProtVar first maps to the GRCh38 genomic location, then retrieves annotations from there. The codon sequence and the reference and variant amino acids determine which codon position(s) must change. Where multiple genomic changes can produce the same amino-acid variant, all are returned on separate rows.

## <a id="further-info:citations"></a>Citing ProtVar and its data sources

If you use ProtVar in your work, please cite:

> James D Stephenson, Prabhat Totoo, David F Burke, Jürgen Jänes, Pedro Beltrao, Maria J Martin. ProtVar: mapping and contextualizing human missense variation. *Nucleic Acids Research*, 2024. [doi:10.1093/nar/gkae413](https://doi.org/10.1093/nar/gkae413)

Several annotations are sourced from external tools and resources — please cite them too where applicable:

- **CADD** — [Kircher *et al.*, *Nature Genetics*, 2014](https://www.nature.com/articles/ng.2892)
- **EVE** — [Frazer *et al.*, *Nature*, 2021](https://www.nature.com/articles/s41586-021-04043-8) (now superseded in ProtVar by popEVE)
- **AlphaFold2 protein–protein interface predictions** — [Burke *et al.*, *Nature Structural & Molecular Biology*, 2023](https://www.nature.com/articles/s41594-022-00910-8)
- **FoldX (ΔΔG)** — see the [FoldX website](https://foldxsuite.crg.eu/) for citation guidance
- **Mol\* viewer** — see the [Mol\* website](https://molstar.org/) for citation guidance
