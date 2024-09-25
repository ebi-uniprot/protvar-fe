#### <a id="structure-annotations"></a>Structure Annotations

![ProtVar Structure Annotations](images/structure_annotations.png)  
**A.** This page shows the position of the user variant in protein structures.  
**B.** The structure can be animated via this button for example it can spin or rock.  
**C.** The [3D structure viewer](#further-info:3d-structure-viewer) uses Mol* to display the structures selected from the tables on the right.  
**D.** Go to the PDBe page for this structure.
**E.** Reset the camera to see the whole protein.  
**F.** Take a screenshot of the current view.  
**G.** Control panel options to change how the structure looks.  
**H.** Expand the view to fill the screen.  
**I.** Change the Mol* settings.  
**J.** Selection mode for residues or regions.  
**K.** All experimental structures which contain the variant position are shown in this table.  
**L.** Press here to zoom and focus the view on the variant position (note: the reference side chain is shown in the structure, not the variant).
**M.** Highlight one chain in multi-chain structures.
**N.** Reset the view to the default.

![ProtVar AlphaFold](images/alphafold.png)  
**A.** The latest AlphaFold model for the protein containing the variant with the variant position according to AlphaFold structure numbering.
**B.** Model position confidence. From AlphaFold: “AlphaFold produces a per-residue estimate of its confidence on a scale from 0 - 100. This confidence measure is called pLDDT and corresponds to the model’s predicted score on the lDDT-Cα metric.”
**C.** Predicted align error indicates the confidence in assigning the correct relative positions between regions in the structure and is produced for each structure by AlphaFold.

![ProtVar Pockets](images/pockets.png)  
**A.** Predicted pockets are displayed in this table if they contain the variant position. There may be multiple pockets overlapping the variant position in which case each can be selected here.
**B.** Press this button to highlight all of the residues which form the pocket in pink. The variant will also be highlighted but in yellow.
**C.** AlphaFold model confidence is disabled in the structure when investigating pockets but can be retrieved by resetting the view.

![ProtVar Interfaces](images/interfaces.png)  
**A.** Predicted protein-protein interactions are displayed in this table if the variant is considered to be part of the interface.
**B.** pDockQ is a measure of the quality of the interface.
**C.** This highlights the residues in both chains which are involved at the interface.
