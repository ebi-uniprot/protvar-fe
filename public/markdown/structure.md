# <a id="structure"></a>Structure

The **3D Structures** panel shows the variant in the context of available protein structures — experimental PDB entries and AlphaFold predictions — with optional overlays for predicted pockets and protein–protein interfaces.

## The three structure tables

![PDBe experimental structure selected, zoomed to the variant residue](images/str_ann2.png)

Three tables list structures that contain the variant position:

- **PDBe Experimental Structure** — every PDB entry whose sequence covers the variant, with chain, residue position, resolution and experimental method.
- **Predicted Structure based on AlphaFold** — the [AlphaFold](#predictions:alphafold) model for the protein, plus AlphaFill where ligand-augmented models exist. The POCKETS column flags predicted pockets that contain the variant.
- **Predicted Interacting Structure** — partners predicted to interact at an interface containing the variant, with the [pDockQ](#glossary:protein-protein-interfaces) confidence score.

Selecting a row loads that structure into the [Mol\* viewer](#glossary:3d-structure-viewer) on the right. Click the variant residue to see surrounding residues; click empty space to zoom out. Use **Zoom to variant** to recentre, and the chain buttons (e.g. **Chain A**, **C**) to isolate single chains in multi-chain structures.

## AlphaFold model

![AlphaFold model with confidence and PAE](images/alphafold.png)

Selecting an AlphaFold row colours the structure by per-residue model confidence (pLDDT). The **Model Confidence** legend maps colours to confidence bands; the **Predicted Aligned Error** heatmap indicates AlphaFold's confidence in the relative positions of residue pairs — useful for assessing inter-domain accuracy. See [AlphaFold](#predictions:alphafold) for the full description.

## Pockets

![Pocket highlighted in the AlphaFold model](images/pockets.png)

If [predicted pockets](#glossary:protein-pockets) contain the variant, they appear in the POCKETS column (e.g. *P3*). Selecting a pocket highlights the residues that form it on the structure; use the pocket button (e.g. **Pocket P3**) below the viewer to toggle the highlight.

## Interfaces

![Interface chains highlighted](images/interfaces.png)

Selecting a row in **Predicted Interacting Structure** loads the two-chain prediction with interface residues highlighted on each chain. The **Interface** button toggles the highlight; pDockQ in the table indicates how confident the prediction is.
