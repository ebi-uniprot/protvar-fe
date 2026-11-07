# <a id="download-format"></a>Download File Format

The file is CSV (comma separated values): every value is double-quoted, for example "BRCA1", and separated by a comma.

**The first row names the columns. Which columns are present depends on what you pick in the [Download Panel](#download-panel), so read the columns by name, not by position.**

A value of "N/A" means ProtVar has no value for this variant, for example:

- No data exists in our database in the category for this variant
- One of the external APIs is not working

## Download Help File Contents

The columns come in groups, in this order. Variant and Mapping are always in the file; the others are added when you tick them.

- [Variant columns](#download-format:variant-columns)
- [Mapping columns](#download-format:mapping-columns)
- [Protein function columns](#download-format:function-annotations-columns)
- [Prediction columns](#download-format:predictions-columns)
- [Population columns](#download-format:population-observations-columns)
- [Structure columns](#download-format:structure-annotations-columns)

With **Only columns shown in the table**, the Variant and Mapping groups keep only the columns the result table shows, plus Input and Notes. Transcripts has no table column, so it is left out.

## <a id="download-format:variant-columns"></a>Variant columns

Always in the file: the line as entered and the genomic variant it was read as.

- [Input](#download-format:user-input)
- [Notes](#download-format:mapping-notes)
- [ID](#download-format:id)
- [Chromosome](#download-format:chromosome)
- [Position](#download-format:coordinate)
- [Ref](#download-format:reference-allele)
- [Alt](#download-format:alternative-allele)

<a id="download-format:user-input"></a>**Input:** This field replicates the user input with no changes to the format. Users can use this field to match their input data to the annotated output file.

<a id="download-format:mapping-notes"></a>**Notes:** Single column which describes potential issues with the user input. It will contain "N/A" if there is nothing to report. Possible issues include:
- Invalid input - Such as a nonsense chromosome, a non-numeric coordinate or invalid nucleotides in either the reference or variant allele positions. The messages are separated by ";" and all other columns are "N/A".
- The input sequence does not match the reference. Possible reasons for this include:
    - user error
    - an updated sequence in the reference build
    - because the user has submitted variants from a different reference genome such as GRCh37
- "No mapping found". Reasons may include:
    - variant in an intergenic region
    - variant in an intronic region
    - no transcript maps to the canonical isoform

<a id="download-format:id"></a>**ID:** The variant ID carried over from the input. For VCF input this is the value of the VCF ID column (an ID, "." or n/a). When the input is a variant ID (dbSNP rs ID, ClinVar, COSMIC or UniProt VAR_ ID), that ID is shown. Other input formats have no ID, so the column is empty.

<a id="download-format:chromosome"></a>**Chromosome:** Only numbers 1-22 or X or Y or mitochondria (chrM, mitochondria, mitochondrion, MT, mtDNA, mit) are accepted. All case-insensitive.

<a id="download-format:coordinate"></a>**Position:** The genomic coordinate position of the variant as interpreted from the user input. Only numeric characters.

<a id="download-format:reference-allele"></a>**Ref:** This is the reference allele. It is defined by the nucleotide identity at that coordinate in the reference genome build. If the user inputted nucleotide differs from the reference build the reference build nucleotide identity will be shown and not the user inputted identity. This conflict will be noted in the "Notes" column. Any user inputs except 'A', 'G', 'C', 'T' will be flagged in the "Notes" column.

<a id="download-format:alternative-allele"></a>**Alt:** This is the alternative allele and will always match the user input. Any user inputs except 'A', 'G', 'C', 'T' will be flagged in the "Notes" column.

## <a id="download-format:mapping-columns"></a>Mapping columns

Always in the file, in the result table's order: the gene, transcript and protein the variant maps to, with the table's scores.

- [Gene](#download-format:gene)
- [Codon_change](#download-format:codon-change)
- [Strand](#download-format:strand)
- [CADD](#download-format:cadd-phred-like-score)
- [AVI](#download-format:avi-phred-like-score)
- [Pangolin](#download-format:pangolin-splice-score)
- [Isoform](#download-format:uniprot-canonical)
- [Other_isoforms](#download-format:alternative-isoform-mappings)
- [Transcripts](#download-format:canonical-isoform-transcripts)
- [Protein](#download-format:protein-name)
- [AA_position](#download-format:amino-acid-position)
- [AA_change](#download-format:amino-acid-change)
- [Consequence](#download-format:consequences)
- [popEVE](#download-format:popeve-score)
- [AlphaMissense](#download-format:alphamissense)

<a id="download-format:gene"></a>**Gene:** The gene symbol as defined by the HGNC. [HGNC website](https://www.genenames.org/about/guidelines/)
Symbols contain only uppercase Latin letters and Arabic numerals, and punctuation is avoided, with an exception for
hyphens in specific groups.

<a id="download-format:codon-change"></a>**Codon_change:** The format is three nucleotides containing the reference allele which make the codon, followed by "/" and then the
three corresponding nucleotides but containing the alternative nucleotide. The position which is changed is capitalised,
for example aCg/aTg where the middle nucleotide of the codon is changed from a Cytosine (C) to a Thymine (T).

<a id="download-format:strand"></a>**Strand:** "+" or "-", the strand of the gene. The reference genome and variants are stated as the positive strand only, therefore if a user enters G->T variant but the gene is on the negative strand the codon change displayed will be C->A (the reverse complement).

<a id="download-format:cadd-phred-like-score"></a>**CADD:** The CADD (Combined Annotation Dependent Depletion) score is a nucleotide specific pathogenicity score devised at the University of Washington - [CADD website](https://cadd.gs.washington.edu/)
They calculate a score for every possible change in the genome. The phred-like score ("scaled C-scores") ranges from 1 to 99. It is based on the rank of each variant relative to all possible 8.6 billion substitutions in the human reference genome. The cell is empty when there is no score.

<a id="download-format:avi-phred-like-score"></a>**AVI:** The AlphaGenome Variant Impact (AVI) score from Google DeepMind's [AlphaGenome](https://deepmind.google.com/science/alphagenome/) Atlas. Like CADD, AVI is PHRED-scaled against all possible single nucleotide variants in the genome: higher scores are more likely deleterious, and 20 corresponds to roughly the top 1%. The cell is empty when there is no score.

<a id="download-format:pangolin-splice-score"></a>**Pangolin:** The [Pangolin](https://doi.org/10.1186/s13059-022-02664-4) splice prediction for this gene (precomputed scores, [Zenodo](https://zenodo.org/records/15649338)): the larger of the predicted gain and loss of splice-site usage within 50 nucleotides of the variant, from 0 (no change) to 1. Genes can overlap, so each gene has its own score. Pangolin publishes no categories; 0.2 and 0.5 are cut-offs commonly used for splice predictors. The cell is empty when Pangolin has no score for the gene.

<a id="download-format:uniprot-canonical"></a>**Isoform:** This is the accession of the canonical isoform of the protein if ProtVar is able to map the variant to it. ProtVar always attempts to map to this isoform because most of the UniProt annotations are based on numbering in the canonical isoform. Sometimes ProtVar cannot map to the canonical isoform
but can to an alternative isoform (sequence version of the protein). In these cases brackets are displayed around the accession to show that the mapping is to a non-canonical isoform.

<a id="download-format:alternative-isoform-mappings"></a>**Other_isoforms:** Details about each isoform including the isoform accession, amino acid position in the isoform, amino acid change,
consequence and ENSP and ENST identifiers. Many genes have several transcripts caused by alternative splicing, some of which translate into different isoforms. Here we list details about all the isoforms where we can map from genomic location to isoform. Isoforms are separated by "|".

<a id="download-format:canonical-isoform-transcripts"></a>**Transcripts:** The transcripts and transcript translation identifiers which correspond to the UniProt canonical isoform. Transcripts (DNA sequences) have an ID starting with "ENST". There can be several different transcripts which encode the same
isoform because they may differ in their untranslated (non-coding) regions at either end. The translated transcript has an ID
starting "ENSP". For example:
>[ENSP00000337353(ENST00000335725,ENST00000123456).

<a id="download-format:protein-name"></a>**Protein:** The full protein name from UniProt.

<a id="download-format:amino-acid-position"></a>**AA_position:** The position of the amino acid in the UniProt canonical isoform or the alternative isoform shown in the Isoform column.

<a id="download-format:amino-acid-change"></a>**AA_change:** The identity of the reference and variant amino acid caused by the variant. Three letter amino acid nomenclature is used separated by "/". Stop codons are shown as an asterisk (\*).

<a id="download-format:consequences"></a>**Consequence:** The consequence of the variant on the amino acid sequence: "missense", "synonymous" (no change to the amino acid) or "stop gained".

<a id="download-format:popeve-score"></a>**popEVE:** The popEVE score (an extension of EVE, the evolutionary model of variant effect, calibrated across proteins with population data), followed by its class in brackets. [EVE paper](https://www.nature.com/articles/s41586-021-04043-8)

<a id="download-format:alphamissense"></a>**AlphaMissense:** AlphaMissense score is a pathogenicity score based on AlphaFold structures. It ranges from 0 to 1 with higher scores more likely to be pathogenic, followed by the class in brackets. The categories have different boundaries based on the protein and are taken directly from AlphaMissense. [AlphaMissense paper](https://www.science.org/doi/10.1126/science.adg7492) [AlphaMissense data](https://zenodo.org/records/8208688)

## <a id="download-format:function-annotations-columns"></a>Protein function columns

Added with **Protein function**: UniProt knowledge about the protein and residue.

- [Residue_features](#download-format:residue-function)
- [Region_features](#download-format:region-function)
- [Existence_evidence](#download-format:protein-existence)
- [Protein_length](#download-format:protein-length)
- [Entry_updated](#download-format:entry-last-updated)
- [Sequence_updated](#download-format:sequence-last-updated)
- [Catalytic_activity](#download-format:protein-catalytic-activity)
- [Complex](#download-format:protein-complex)
- [Subcellular_location](#download-format:protein-sub-cellular-location)
- [Family](#download-format:protein-family)
- [Interactions](#download-format:protein-interactions)

<a id="download-format:residue-function"></a>**Residue_features:** Functional features specifically describing the residue encoded by the user submitted variant, i.e. features that start and end at that position (for example start 213, end 213).

<a id="download-format:region-function"></a>**Region_features:** This column describes functional features of the region in which the residue encoded by the user submitted variant falls, i.e. features spanning more than one position that contain it (for example start 200, end 213 for position 206). The range of the region is provided after the ";". Overlapping regions describing the variant are separated by "|".

<a id="download-format:protein-existence"></a>**Existence_evidence:** Describes if there is experimental evidence to support the existence of the protein.

<a id="download-format:protein-length"></a>**Protein_length:** The length of the UniProt canonical isoform sequence in amino acids.

<a id="download-format:entry-last-updated"></a>**Entry_updated:** When the UniProt entry was last updated with any type of information.

<a id="download-format:sequence-last-updated"></a>**Sequence_updated:** When the canonical isoform sequence was last updated.

<a id="download-format:protein-catalytic-activity"></a>**Catalytic_activity:** Describes the reactions previously ascribed to this protein. These are not necessarily reactions affected by the variant amino acid but they could be. The RHEA ID (a SIB reactions database) is given as is the evidence(s) from publications. Different reactions are separated by "|". For example:

> RHEA:25017(PubMed:[16824732,9593664,9811831])|RHEA:20629(PubMed:[9256433])

<a id="download-format:protein-complex"></a>**Complex:** Describes whether the protein containing the variant exists in a complex.

<a id="download-format:protein-sub-cellular-location"></a>**Subcellular_location:** Describes the location within the cell where the protein is localised. There may be more than one location if multiple locations have been described.

<a id="download-format:protein-family"></a>**Family:** Describes the functional family that the protein belongs to.

<a id="download-format:protein-interactions"></a>**Interactions:** This shows which other proteins have been shown to interact with the protein containing the variant. This data is from the EMBL-EBI IntAct database and is predominantly from manual curation. The format is: UniProt accession(gene symbol). Different interacting partners are separated by ";".

## <a id="download-format:predictions-columns"></a>Prediction columns

Added with **More predictions**: computed residue and structure predictions.

- [Conservation](#download-format:conservation-score)
- [ESM1b](#download-format:esm1b-score)
- [FoldX](#download-format:foldx-prediction)
- [Missense3D](#download-format:missense3d)
- [Pockets](#download-format:predicted-pockets)
- [Interfaces](#download-format:predicted-interactions)

<a id="download-format:conservation-score"></a>**Conservation:** Is a score from 0-1 where 0 is not at all conserved and 1 is totally conserved in pre-calculated multiple sequence alignments based on UniRef90 and scored using the ScoreCons algorithm.

<a id="download-format:esm1b-score"></a>**ESM1b:** A 650-million-parameter protein language model trained on 250 million protein sequences across all organisms. It is log 10 scaled and the category boundaries can be seen in the ProtVar legend. Higher scores equate to variants with a higher probability of deleteriousness. [ESM1b paper](https://www.nature.com/articles/s41588-023-01465-0)

<a id="download-format:foldx-prediction"></a>**FoldX:** The predicted Gibbs free energy change of the protein when the variant is introduced as calculated using the FoldX algorithm: [foldX website](https://foldxsuite.crg.eu/). Given as "foldxDdg:…;plddt:…", multiple predictions separated by "|".

<a id="download-format:missense3d"></a>**Missense3D:** The Missense3D prediction of the structural effect of the variant on the AlphaFold model, followed by the damaging feature in brackets where there is one. See [Predictions](#predictions:m3d).

<a id="download-format:predicted-pockets"></a>**Pockets:** This shows the residues which are predicted to form a pocket in the AlphaFold modelled protein. Each pocket is given as "pocket_id:…;rad_gyration:…;energy_per_vol:…;buriedness:…;resid:…;mean_plddt:…;score:…" and pockets are separated by "|".

<a id="download-format:predicted-interactions"></a>**Interfaces:** Interface residues are predicted from folding proteins which are considered to interact simultaneously using the Alphafold2 algorithm. The interfaces are then scored for confidence. Each interaction is given as "chainA-chainB;A residues:…;B residues:…;pDockQ:…" and interactions are separated by "|".

## <a id="download-format:population-observations-columns"></a>Population columns

Added with **Population**.

- [gnomAD_AF](#download-format:gnomad-allele-freq)
- [HGVS_g](#download-format:genomic-location)
- [Cytoband](#download-format:cytogenetic-band)
- [Xrefs](#download-format:other-identifiers-for-the-variant)
- [Diseases](#download-format:diseases-associated-with-variant)
- [Colocated_variants](#download-format:variants-colocated-at-residue-position)

<a id="download-format:gnomad-allele-freq"></a>**gnomAD_AF:** The gnomAD allele count, allele number and allele frequency for the variant's alternative allele, given as "ac;an;af". "N/A" when gnomAD has no record of the variant.

<a id="download-format:genomic-location"></a>**HGVS_g:** The variant described in HGVS format. This is a different way of describing the variant which includes the sequence
version of the reference genome assembly: [HGVS website](https://varnomen.hgvs.org/bg-material/simple/)

<a id="download-format:cytogenetic-band"></a>**Cytoband:** The region of the chromosome containing the variant position. Cytogenic bands are areas of chromosomes rich in
actively transcribing DNA.

<a id="download-format:other-identifiers-for-the-variant"></a>**Xrefs:** Description of the same variant (position and nucleotide change) as the user entered variant in different databases. The source database name is given, separated by the variant ID with "-" then separated from the clinical consequence with ";". Each separate database is separated by "|". For example:
> ClinVar-RCV000003593;Pathogenic|UniProt-VAR_017144;Pathogenic.

<a id="download-format:diseases-associated-with-variant"></a>**Diseases:** Describes diseases from literature which have been associated with the variant. There may be multiple diseases listed which are separated by "|". The evidence for each disease is in brackets which may be a ClinVar ID or Pubmed link to a publication.

<a id="download-format:variants-colocated-at-residue-position"></a>**Colocated_variants:** This column describes other variants which have been described at the same AMINO ACID position. As a codon is three nucleotides this means that the variants here could be at any one of three positions and can be any alternative allele.

## <a id="download-format:structure-annotations-columns"></a>Structure columns

Added with **Structures**.

- [PDB_structures](#download-format:position-in-structures)

<a id="download-format:position-in-structures"></a>**PDB_structures:** This column shows which PDB protein structures contain the variant. This is not an exhaustive list of all structures
of the protein as some structures will not cover the region containing the variant. The format is:
> PDB_accesion;chain_position_in_structure,chain_position_in_structure;structure_resolution;structure_method. Structures are separated by "|".
