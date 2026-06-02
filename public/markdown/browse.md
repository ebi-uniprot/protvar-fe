# <a id="browse"></a>Browse by Identifier

The **Browse by Identifier** tab lists every known (or potential) variant for a protein, gene or other biological identifier. Unlike Annotate Variants, you don't supply variants yourself — ProtVar returns the full set known for that target.

![Browse by Identifier tab](images/browse.png)

## Identifier types

The search box accepts any of:

- **UniProt accession** — e.g. *P68871*
- **Gene symbol** — e.g. *HBB*
- **Ensembl Gene** — e.g. *ENSG00000244734*
- **RefSeq ID** — e.g. *NM_007294.4*
- **PDB ID** — e.g. *1JNX*

Each resolves to its UniProt protein(s); variants are returned across all matching [isoforms](#glossary:isoforms).

## Search filters

Filters can be combined — each one further narrows the result; an empty pane (with an identifier) returns everything for that target.

- **Variant Type** — *Known variants* (reported in databases) or *Potential variants* (every possible missense substitution).
- **Functional** — checkboxes restricting to variants that fall within a UniProt-annotated feature: *PTM* (post-translational modification site), *Mutagenesis* (experimentally altered site), *Functional Domain* (domain, region, motif or notable site), *Binding Site*, *Active Site*. Plus a Conservation slider, 0–1.
- **Structural** — *Transmembrane Region*, *Experimental Model*, *Protein-Protein Interface*, *Predicted Pocket* checkboxes.
- **Stability** — toggle FoldX-derived classes *Likely Destabilising* / *Unlikely to Destabilise*.
- **Consequence** — chip groups for [CADD](#glossary:cadd), [AlphaMissense, popEVE and ESM-1b](#predictions) categories; ESM-1b also has a numeric range slider.

The feature checkboxes (PTM, Mutagenesis, Functional Domain, Binding Site, Active Site, Transmembrane Region) were chosen for **variant-interpretation relevance** — each marks a region where an amino-acid change is more likely to be functionally consequential: a modified or catalytic residue, a ligand-binding site, a structural domain, a membrane-spanning segment. UniProt feature types with little standalone interpretive value — secondary-structure elements, sequence-conflict annotations and the like — are intentionally not offered as filters.

### Filter-only browse

You can submit with no identifier, returning matches across all proteins. This requires at least one *primary filter* — **Predicted Pocket**, **Protein-Protein Interface** or **Experimental Model** — to keep the query bounded; ProtVar prompts you if none is set.

## Browse the result

Press **Browse** to load the [Results](#results) page for that identifier and filter set. **Clear** resets the form.

![Browse result for UniProt P68871](images/browse_protein.png)

The result page is the same as for Annotate Variants — same columns, same annotation panels, same Download Panel — but the rows are every variant that matched. Use the **Search Filters** bar at the top of the page to narrow the list further without resubmitting from the home tab.

## Saving a browse

Browse results are **not** saved to your history automatically — they're designed for quick lookup. To keep one, click **Save** in the toolbar; it then appears in [Activity → History](#activity:activity-history) where you can rename, share or delete it.
