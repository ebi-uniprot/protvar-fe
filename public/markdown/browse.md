# <a id="browse"></a>Browse Variants

The **Browse Variants** tab lists every known (or potential) variant for a protein, gene or other biological identifier, or across all proteins using filters alone. Unlike Annotate Variants, you don't supply variants yourself — ProtVar returns the full set known for that target.

![Browse Variants tab](images/browse.png)

## Identifier types

Enter one or more identifiers. Press **Enter** or **+** after each one to add it as a chip, then **Browse**:

- **UniProt accession** — e.g. *P68871* (isoform accessions such as *P68871-2* also work)
- **Gene symbol** — e.g. *HBB*
- **Ensembl ID** — gene, transcript or protein (ENSG / ENST / ENSP), e.g. *ENSG00000244734*
- **RefSeq ID** — NM_ or NP_, e.g. *NM_007294.4*
- **PDB ID** — e.g. *1JNX*

Each resolves to its UniProt protein(s); variants are returned across all matching [isoforms](#glossary:isoforms). Each row is one genomic variant, listed once with every isoform it maps to (canonical first). A single identifier opens a page for that identifier (e.g. `/gene/HBB`); several identifiers, of any mix of types, open one combined result (`/search?id=…&id=…`, see [ProtVar Links](#protvar-links:s3)).

## Filters

Open **Search Filters** to choose filters; each section opens from its title and shows how many of its filters are on. Filters combine — each one narrows the result further.

- **Variant Type** — *Known variants* (reported in databases; the default when browsing) or *Potential variants* (every possible missense change).
- **Functional** — *PTM* (post-translational modification site), *Mutagenesis* (experimentally altered site), *Functional Domain* (domain, region, motif or notable site), *Binding Site*, *Active Site*; **Conservation** range (0–1).
- **Population** — *Disease Association*; **Allele Frequency** (gnomAD): *Very Rare*, *Rare*, *Low*, *Common*.
- **Structural** — *Transmembrane Region*, *Experimental Model*, *Protein-Protein Interface*, *Predicted Pocket*; **Stability** (FoldX): *Likely Destabilising* / *Unlikely to Destabilise*.
- **Consequence** — **CADD** (< 15, 15–25, > 25), **AVI** genome-wide rank (top 10%, 1%, 0.1%), **AlphaMissense** (Benign / Ambiguous / Pathogenic), **popEVE** (Severe / Moderately / Unlikely Deleterious), **ESM-1b** range. See [Predictions](#predictions).

The feature checkboxes (PTM, Mutagenesis, Functional Domain, Binding Site, Active Site, Transmembrane Region) were chosen for **variant-interpretation relevance** — each marks a region where an amino-acid change is more likely to be functionally consequential: a modified or catalytic residue, a ligand-binding site, a structural domain, a membrane-spanning segment. UniProt feature types with little standalone interpretive value — secondary-structure elements, sequence-conflict annotations and the like — are intentionally not offered as filters.

### Filter-only browse

You can browse with no identifier, across all proteins. This needs at least one *primary filter* — **Predicted Pocket**, **Protein-Protein Interface** or **Experimental Model** — to keep the query bounded; ProtVar prompts you if none is set. Very large filter-only results are capped: refine the filters to see them all.

## On the result page

Press **Browse** to load the [Results](#results) page. **Clear** resets the form.

![Browse result for UniProt P68871](images/browse_protein.png)

The result page has the same columns, annotation panels and [Download Panel](#download-panel) as Annotate Variants. On wide screens the filters sit in a **Filters** rail on the left (collapse it with «); on narrower screens they are in a **Search Filters** bar above the table. Change any filter, then press **Update**. Active filters show as chips above the table; click a chip's × to remove it. If nothing matches, the page says so and offers to clear the filters.

**Sort Results** (result page only) orders the rows by CADD, AVI, AlphaMissense, popEVE or ESM-1b, ascending or descending. For popEVE and ESM-1b, lower scores are more damaging.

## <a id="browse:filtering-your-uploads"></a>Filtering your uploads

The same filters and sorting work on an uploaded result (`/result/<id>`), plus a **Notes** section to find lines with [notes](#messages). For an upload, **Variant Type** defaults to *All submitted variants*; choose *Known variants only* to keep just those reported in databases. The summary above the table shows how many of your lines match. A large upload is checked line by line once after it is submitted (a progress bar shows this); filters and sorting are fast after that.

## Saving a browse

Browse results are **not** saved to your history automatically — they're designed for quick lookup. To keep one, click **Save** in the toolbar; it then appears in [Activity → History](#activity:activity-history) where you can rename, share or delete it.
