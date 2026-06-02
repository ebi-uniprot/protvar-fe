# <a id="function"></a>Function

The **Functional Information** panel describes the variant in three nested contexts: the exact residue, the surrounding region, and the protein as a whole.

## Variant residue and region

![Variant residue position, region, and predictions](images/fun_ann1.png)

**Variant Residue Position** — annotations specifically about the changed amino acid.

- **UniProt annotations** — curated features at the variant position (e.g. *Active site*, *Mutagenesis*, *Modified residue*).
- 3D thumbnails of the reference and variant amino acids, to highlight the chemical change.
- **Predictions** — Conservation, AlphaMissense, CADD, ESM-1b, popEVE, FoldX [stability change](#glossary:predicted-free-energy-change) and Missense3D, each with a score and a categorical label. See [Predictions](#predictions) for what each tool measures and how to read its score.

**Region Containing Variant Position** — annotations about the [region](#glossary:region) the variant falls within.

- **UniProt annotations** — broader features such as *Chain*, *Domain*, or *Region of interest*, with the residue range.
- **Structure predictions** — counts of [predicted pockets](#glossary:protein-pockets) and [protein–protein interfaces](#glossary:protein-protein-interfaces) that contain the variant. Expand to see details, or open them in 3D from the [Structure](#structure) panel.

## Protein information

![Protein information from UniProt and Ensembl identifiers](images/fun_ann2.png)

The **Protein Information from UniProt** section gives [general protein context](#glossary:general-protein-information) — useful for judging what an alteration at the residue might mean for the organism.

- **General function** — UniProt's free-text description of what the protein does, with PubMed citations.
- **Basic information** — recommended name, gene name, UniProtKB entry, protein-existence evidence, sequence length, and dates the entry / sequence were last updated.
- **Detailed information** — collapsible counts for Complex, Subcellular location, PTMs, Family and Interactions.

**Ensembl Gene and Transcript Information** lists [Ensembl identifiers](#glossary:ensembl-identifiers) for the canonical isoform: the gene (ENSG), translated sequence (ENSP) and transcript (ENST).
