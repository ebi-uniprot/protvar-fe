# <a id="glossary"></a>Glossary

Definitions of terms and tools used across ProtVar. Most terms are also linked from the relevant feature pages.

---

<a id="glossary:3d-structure-viewer"></a>**3D Structure Viewer.** ProtVar embeds a lightweight build of the [Mol*](https://molstar.org/) viewer to render structures quickly. Used throughout the [Structure](#structure) panel.

<a id="glossary:cadd"></a>**CADD.** A score that ranks "the deleteriousness of single nucleotide variants as well as insertion/deletions variants in the human genome" — see the [CADD website](https://cadd.gs.washington.edu/). Free for non-commercial use; commercial use requires a licence. Citation: [Kircher *et al.*, *Nature Genetics*, 2014](https://www.nature.com/articles/ng.2892).

<a id="glossary:co-located-variants"></a>**Co-located Variants.** Variants reported at the same amino acid position as the queried variant. The point mutation may be at any of the three nucleotide positions of the codon — not necessarily the same genomic position as the user's input.

<a id="glossary:ensembl-identifiers"></a>**Ensembl identifiers.** ENSG (gene), ENSP (translated sequence) and ENST (transcript) identifiers. The identifiers in the Function Annotation section correspond to the UniProt canonical isoform. See [Ensembl stable IDs](http://www.ensembl.org/info/genome/stable_ids/index.html).

<a id="glossary:eve"></a>**EVE.** "A model for the prediction of clinical significance of human variants based on sequences of diverse organisms across evolution." Now superseded in ProtVar by [popEVE](#predictions); EVE entries remain linkable for context. Citation: [Frazer *et al.*, *Nature*, 2021](https://www.nature.com/articles/s41586-021-04043-8) · [EVE website](https://evemodel.org/).

<a id="glossary:general-protein-information"></a>**General protein information.** UniProt-sourced context about the protein as a whole — useful for judging what an alteration at the residue might mean for the organism. Shown under *Protein Information from UniProt* in the [Function Annotations](#function) panel.

<a id="glossary:isoforms"></a>**Isoforms.** ProtVar maps each variant to as many UniProt isoforms as the translated transcripts allow. The default view shows the canonical isoform, marked with a *can* pill; alternative isoforms are marked *iso*. All annotations use canonical-isoform numbering.

<a id="glossary:missense"></a>**Missense.** A single-nucleotide change in which the codon is altered to encode a different amino acid. Synonymous mutations — point mutations that don't change the encoded amino acid — are also recognised by ProtVar.

<a id="glossary:predicted-free-energy-change"></a>**Predicted Free Energy Change (ΔΔG).** The difference in Gibbs free energy between the wild-type and variant proteins, computed by [FoldX](https://foldxsuite.crg.eu/) v5.0 on the AlphaFold2 structure. See [Predictions](#predictions) for how the score is interpreted.

<a id="glossary:protein-pockets"></a>**Protein Pockets.** Pockets predicted from the AlphaFold2 model using geometry and physico-chemical features within high-confidence regions. Surfaced in the [Structure](#structure) panel.

<a id="glossary:protein-protein-interfaces"></a>**Protein–protein Interfaces.** Predicted interfaces between interacting protein pairs, modelled with AlphaFold2 by Burke *et al.* — please cite the [interface paper](https://www.nature.com/articles/s41594-022-00910-8) if you use this data. Surfaced in the [Structure](#structure) panel.

<a id="glossary:region"></a>**Region.** The area in sequence space surrounding the variant position, with no fixed size — may include structural features (e.g. helices) or functional features (e.g. binding regions). Shown in the [Function Annotations](#function) panel.
