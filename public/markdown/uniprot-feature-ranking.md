# UniProt Feature Ranking

ProtVar ranks UniProt sequence features (FT lines) by their likely susceptibility to disease when mutated. Features are listed in priority order — highest clinical relevance first — within each annotation panel.

## Ranking principles

The order reflects a synthesis of the following factors:

- **Evolutionary conservation** — Highly conserved residues and domains are more likely to cause disease when mutated. Proteins under stronger constraint (e.g. high pLI or low LOEUF scores) are prioritised.
- **Functional domains** — Mutations in catalytic or interaction-critical regions are more often pathogenic.
- **Protein stability** — Mutations predicted to destabilise a protein (e.g. via FoldX ΔΔG) tend to be disease-causing. Note: gain-of-function variants may instead act through stabilising effects.
- **Post-translational modification sites** — Disruption of PTM sites can be highly pathogenic.
- **Structural features** — Core structural elements (zinc fingers, disulfide bonds) are more sensitive than flexible or disordered regions.
- **Solvent accessibility** — Buried residues are generally more sensitive to mutation than surface-exposed ones.
- **Network centrality** — Proteins central to interaction networks are more susceptible.

The exact impact of any given variant depends on the protein, disease context, and inheritance mode.

## Feature priority tiers

### High priority

| Rank | Feature | Description |
|------|---------|-------------|
| 1 | **Variant** | Naturally occurring variants; includes disease/OMIM associations, dbSNP and literature references. |
| 2 | **Mutagenesis** | Experimentally induced mutations with characterised functional effects. |
| 3 | **Active site** | Residue(s) directly involved in the catalytic mechanism. |
| 4 | **Binding site** | Residue(s) that interact with a ligand or small molecule. |
| 5 | **Modified residue** | Post-translational modification sites (strictly controlled vocabulary). |
| 6 | **Lipidation** | Covalent lipid attachment; affects trafficking, localisation and signalling. |
| 7 | **Glycosylation** | N- or O-linked glycosylation sites; disruption is linked to human disease. |

### Middle priority

| Rank | Feature | Description |
|------|---------|-------------|
| 8 | **Zinc finger** | Zinc-coordinating motif; variants can impair folding and function. |
| 9 | **Site** | Interesting single-residue site, e.g. cleavage or reactive bond positions. |
| 10 | **Domain** | Defined structural/functional domain; impact depends on position. |
| 11 | **Repeat** | Internal sequence repeat; similar considerations to domains. |
| 12 | **DNA binding** | Region mediating DNA interaction; pathogenicity is context-dependent. |
| 13 | **Disulfide bond** | Conserved covalent bond; disruption affects protein stability. |
| 14 | **Coiled coil** | Region involved in protein assembly and oligomerisation. |
| 15 | **Motif** | Short functional sequence motif. |
| 16 | **Region** | Region of interest from the literature; impact depends on functional role. |

### Lower priority

| Rank | Feature | Description |
|------|---------|-------------|
| 17 | **Transmembrane** | Membrane-spanning segment. |
| 18 | **Helix** | Alpha-helical secondary structure. |
| 19 | **Turn** | Turn secondary structure element. |
| 20 | **Beta strand** | Beta-strand secondary structure. |
| 21 | **Compositional bias** | Region with biased amino acid composition. |
| 22 | **Topological domain** | Non-membrane region of a membrane-spanning protein. |
| 23 | **Intramembrane** | Region within but not spanning a membrane. |
| 24 | **Non-standard residue** | Non-standard amino acid, e.g. selenocysteine. |
| 25 | **Cross-link** | Residue involved in an inter- or intra-chain covalent bond. |
| 26 | **Alternative sequence** | Sequence variants from alternative splicing or initiation. |

## Further reading

UniProt feature annotation guidelines are described in the [UniProt curation manual](https://www.uniprot.org/help/sequence_annotation).
