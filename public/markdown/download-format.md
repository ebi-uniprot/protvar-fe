# <a id="download-format"></a>Download File Format

The output file has 41 columns in total. Every column value is double-quoted, for example "User input" and then separated by a comma.
Columns can contain "N/A" as a value indicating either:

- The user did not request the data (for example if only mappings are requested without annotation)
- We can not provide a value for reasons such as:
- No data exists in our database in the category for this variant
- One of the external APIs is not working

## Download Help File Contents

The output file will be in CSV (comma separated values) format. The file is divided into the following general categories:


- [User Input Columns](#download-format:user-input-columns)
- [Mapping Notes Columns](#download-format:mapping-notes-columns)
- [Genomic Mapping columns](#download-format:genomic-mapping-columns)
- [Protein Mapping Columns](#download-format:protein-mapping-columns)
- [Function Annotations Columns](#download-format:function-annotations-columns)
- [Predictions Columns](#download-format:predictions-columns)
- [Population Observations Columns](#download-format:population-observations-columns)
- [Structure Annotations Columns](#download-format:structure-annotations-columns)

The descriptions of the columns in the download file below are numbered from left to right. The letters in brackets correspond to the columns when visualised in a spreadsheet.

- [User Input](#download-format:user-input)

<a id="download-format:user-input"></a>**A - User input:**
This field replicates the user input with no changes to the format. Users can use this field to match their input data to the annotated output file.

## <a id="download-format:user-input-columns"></a>Genomic coodinate Columns

There are six columns:
- [Chromosome](#download-format:chromosome)
- [Coordinate](#download-format:coordinate)
- [ID](#download-format:id)
- [Reference_allele](#download-format:reference-allele)
- [Alternative_allele](#download-format:alternative-allele)

<a id="download-format:chromosome"></a>**B - Chromosome:**
Only numbers 1-22 or X or Y or mitochondria (chrM, mitochondria, mitochondrion, MT, mtDNA, mit) are accepted. All case-insensitive.

<a id="download-format:coordinate"></a>**C - Coordinate:** The genomic coordinate position of the variant as interpreted from the user input. Only numeric characters.

<a id="download-format:id"></a>**D - ID:** This is a field which can optionally be provided by the user to keep track of their variants or store information about the variant which will be retained in the output file.

<a id="download-format:reference-allele"></a>**E - Reference_allele:** This is the reference allele. It is defined by the nucleotide identity at that coordinate in the reference genome build. If the user inputted nucleotide differs from the reference build the reference build nucleotide identity will be shown and not the user inputted identity. This conflict will be noted in the "notes" column. Any user inputs except 'A', 'G', 'C', 'T' will be flagged in the "notes" section.

<a id="download-format:alternative-allele"></a>**F - Alternative_allele** This is the alternative allele and will always match the user input. Any user inputs except 'A', 'G', 'C', 'T' will be flagged in the "notes" section.

## <a id="download-format:mapping-notes-columns"></a>Mapping Notes Columns

<a id="download-format:mapping-notes"></a>**G - Mapping_notes:** Single column which describes potential issues with the user input. It will contain "N/A" if there is nothing to report. Possible issues include:
- Invalid input - Such as a nonsense chromosome, a non-numeric coordinate of invalid nucleotides in either the reference or variant allele positions
- The input sequence does not match the reference. Possible reasons for this include:
    - user error
    - an updated sequence in the reference build
    - because the user has submitted variants from a different reference genome such as GRCh37)
- Mapping not found. Reasons may include:
    - variant in an intergenic region
    - variant in an intronic region
    - no transcript maps to the canonical isoform

## <a id="download-format:genomic-mapping-columns"></a>Genomic Mapping Columns

Contains information regarding mapping of the user variant input to the relevant gene(s), transcript(s) and codon. The category contains six columns:
- [Gene](#download-format:gene)
- [Codon_change](#download-format:codon-change)
- [Strand](#download-format:strand)
- [CADD_phred-like_score](#download-format:cadd-phred-like-score)
- [Canonical_isoform_transcripts](#download-format:canonical-isoform-transcripts)
- [MANE_transcript](#download-format:mane-transcript)

<a id="download-format:gene"></a>**H - Gene:** The gene symbol as defined by the HGNC. [HGNC website](https://www.genenames.org/about/guidelines/)
Symbols contain only uppercase Latin letters and Arabic numerals, and punctuation is avoided, with an exception for
hyphens in specific groups.

<a id="download-format:codon-change"></a>**I - Codon_change:** The format is three nucleotides containing the reference allele which make the codon, followed by "/" and then the
three corresponding nucleotides but containing the alternative nucleotide. The position which is changed is capitalised,
for example aCg/aTg where the middle nucleotide of the codon is changed from a Cytosine (C) to a Thymine (T).

<a id="download-format:strand"></a>**J - Strand:** The reference genome and variants are stated as the positive strand only, therefore if a user enters G->T variant but the gene is on the negative strand the codon change displayed will be C->A (the reverse complement).

<a id="download-format:cadd-phred-like-score"></a>**K - CADD_phred_like_score:** The CADD (Combined Annotation Dependent Depletion) score is a nucleotide specific pathogenicity score devised at the University of Washington - [CADD website](https://cadd.gs.washington.edu/)
They calculate a score for every possible change in the genome. The phred-like score ("scaled C-scores") ranges from 1 to 99. It is based on the rank of each variant relative to all possible 8.6 billion substitutions in the human reference genome.

<a id="download-format:canonical-isoform-transcripts"></a>**L - Canonical_isoform_transcripts:** The transcripts and transcript translation identifiers which correspond to the UniProt canonical isoform. Transcripts (DNA sequences) have an ID starting with "ENST". There can be several different transcripts which encode the same
isoform because they may differ in their untranslated (non-coding) regions at either end. The translated transcript has an ID
starting "ENSP". For example:
>[ENSP00000337353(ENST00000335725,ENST00000123456).

<a id="download-format:mane-transcript"></a>**M - MANE_transcript:** MANE (Matched Annotation from NCBI and EBI). - One of the transcripts is selected as the representative by NCBI and Ensembl. This transcript may not translate into the UniProt canonical isoform sequence. If the MANE Select corresponds directly to the isoform described in the row the MANE Select ID is given. If they do not match, "N/A" is found in the column and the MANE Select ID is found with the corresponding transcript in the "Alternative_isoform_mappings" column. More information can be found on the [Ensembl website](https://www.ensembl.org/info/genome/genebuild/mane.html)

## <a id="download-format:protein-mapping-columns"></a>Protein Mapping Columns

Contains information regarding mapping of the user variant input to the encoded protein(s). The category contains six columns:

- [Uniprot canonical_isoform (non_canonical)](#download-format:uniprot-canonical)
- [Alternative_isoform_mappings](#download-format:alternative-isoform-mappings)
- [Protein_name](#download-format:protein-name)
- [Amino_acid_position](#download-format:amino-acid-position)
- [Amino_acid_change](#download-format:amino-acid-change)
- [Consequences](#download-format:consequences)


<a id="download-format:uniprot-canonical"></a>**N - Uniprot canonical_isoform (non_canonical):** This is the accession of the canonical isoform of the protein if ProtVar is able to map the variant to it. ProtVar always attempts to map to this isoform because most of the UniProt annotations are based on numbering in the canonical isoform. Sometimes ProtVar cannot map to the canonical isoform
but can to an alternative isoform (sequence version of the protein). In these cases brackets are displayed around the accession to show that the mapping is to a non-canonical isoform.

<a id="download-format:alternative-isoform-mappings"></a>**O - Alternative_isoform_mappings:** Details about each isoform including the isoform accession, amino acid position in the isoform, amino acid change,
consequence and ENSP and ENST identifiers. Many genes have several transcripts caused by alternative splicing, some of which translate into different isoforms. Here we list details about all the isoforms where we can map from genomic location to isoform. Isoforms are separated by "|".

<a id="download-format:protein-name"></a>**P - Protein_name:** The full protein name from UniProt.

<a id="download-format:amino-acid-position"></a>**Q - Amino_acid_position** The position of the amino acid in the UniProt canonical isoform or the alternative isoform shown in the UniProt canonical_isoform(non_canonical) column.

<a id="download-format:amino-acid-change"></a>**R - Amino_acid_change:** The identity of the reference and variant amino acid caused by the missense mutation. Three letter amino acid nomenclature is used separated by "/". Stop codons are shown as an asterisk (\*).

<a id="download-format:consequences"></a>**S - Consequences:** The consequence of the variant on the amino acid sequence.

## <a id="download-format:function-annotations-columns"></a>Function Annotations Columns

These columns contain functional annotations regarding the variant amino acid, region and protein. There are 12 columns in this category:

- [Residue_function_(evidence)](#download-format:residue-function)
- [Region_function_(evidence)](#download-format:region-function)
- [Protein_existence_evidence](#download-format:protein-existence)
- [Protein_length](#download-format:protein-length)
- [Entry_last_updated](#download-format:entry-last-updated)
- [Sequence_last_updated](#download-format:sequence-last-updated)
- [Protein_catalytic_activity](#download-format:protein-catalytic-activity)
- [Protein_complex](#download-format:protein-complex)
- [Protein_sub_cellular_location](#download-format:protein-sub-cellular-location)
- [Protein_family](#download-format:protein-family)
- [Protein_interactions_PROTEIN(gene)](#download-format:protein-interactions)


<a id="download-format:residue-function"></a>**T - Residue_function_(evidence):** Functional features specifically describing the residue encoded by the user submitted variant.

<a id="download-format:region-function"></a>**U - Region_function_(evidence):** This column describes functional features of the region in which the residue encoded by the user submitted variant falls. The range of the region is provided after the ";". Overlapping regions describing the variant are separated by "|".

<a id="download-format:protein-existence"></a>**V - Protein_existence_evidence:** Describes if there is experimental evidence to support the existence of the protein.

<a id="download-format:protein-length"></a>**W - Protein_length:** The length of the UniProt canonical isoform sequence in amino acids.

<a id="download-format:entry-last-updated"></a>**X - Entry_last_updated:** When the UniProt entry was last updated with any type of information.

<a id="download-format:sequence-last-updated"></a>**Y - Sequence_last_updated:** When the canonical isoform sequence was last updated.

<a id="download-format:protein-catalytic-activity"></a>**Z - Protein_catalytic_activity:** Describes the reactions previously ascribed to this protein. These are not necessarily reactions affected by the variant amino acid but they could be. The RHEA ID (a SIB reactions database) is given as is the evidence(s) from publications. Different reactions are separated by "|". For example:

> RHEA:25017(PubMed:[16824732,9593664,9811831])|RHEA:20629(PubMed:[9256433])

<a id="download-format:protein-complex"></a>**AA - Protein_complex:** Describes whether the protein containing the variant exists in a complex.

<a id="download-format:protein-sub-cellular-location"></a>**AB - Protein_sub_cellular_location:** Describes the location within the cell where the protein is localised. There may be more than one location if multiple locations have been described.

<a id="download-format:protein-family"></a>**AC - Protein_family:** Describes the functional family that the protein belongs to.

<a id="download-format:protein-interactions"></a>**AD - Protein_interactions_PROTEIN(gene):** This shows which other proteins have been shown to interact with the variant containing protein. This data is from the EMBL-EBI IntAct database and is predominantly from manual curation. The format is: UniProt accession(gene symbol). Different interacting partners are separated by ";".

## <a id="download-format:predictions-columns"></a>Structure Prediction Columns
Predictions based on structure hosted by ProtVar. There are 4 columns in this category:

- [Predicted_pockets](#download-format:predicted-pockets)
- [Predicted_interactions](#download-format:predicted-interactions)
- [Foldx_prediction](#download-format:foldx-prediction)
- [Conservation_score](#download-format:conservation-score)

<a id="download-format:predicted-pockets"></a>**AE - Predicted_pockets:** This shows the residues which are predicted to form a pocket in the AlphaFold modelled protein.

<a id="download-format:predicted-interactions"></a>**AF - Predicted_interactions:**  Interface residues are predicted from folding proteins which are considered to interact simultaneously using the Alphafold2 algorithm. The interfaces are then scored for confidence.

<a id="download-format:foldx-prediction"></a>**AG - Foldx_prediction:** The predicted Gibbs free energy change of the protein when the variant is introduced as calculated using the FoldX algorithm: [foldX website](https://foldxsuite.crg.eu/)

<a id="download-format:conservation-score"></a>**AH - Conservation_score:**  Is a score from 0-1 where 0 is not at all conserved and 1 is totally conserved in pre-calculated multiple sequence alignments based on UniRef90 and scored using the ScoreCons algorithm.

## <a id="download-format:predictors-columns"></a>Pathogenicity Prediction Columns
Pathogenicity prediction retrieved from other resources (all pre-computed). There are 3 columns in this category:

- [AlphaMissense_pathogenicity(class)](#download-format:alphamissense)
- [EVE_score(class)](#download-format:eve-score)
- [ESM1b_score](#download-format:esm1b-score)

<a id="download-format:alphamissense"></a>**AI - Alpha_Missense:** AlphaMissense score is a pathogenity score based on ALphaFold structures. It ranges from 0 to 1 with higher scores more likely to be pathogenic. The categories have different boundaries based on the protein and are taken directly from AlphaMissense. [AlphaMissense paper](https://www.science.org/doi/10.1126/science.adg7492) [AlphaMissense data](https://zenodo.org/records/8208688)

<a id="download-format:eve-score"></a>**AJ - EVE:** Evolutionary model of variant effect. A score from 0-1 (predicted benign-pathogenic) and a category benign/uncertain/pathogenic. [EVE paper](https://www.nature.com/articles/s41586-021-04043-8)

<a id="download-format:esm1b-score"></a>**AK - ESM1b_score:** A 650-million-parameter protein language model trained on 250 million protein sequences across all organisms. It is log 10 scaled and the category boundaries can be seen in the ProtVar legend. Higher scores equate to variants with a higher probability of deliteriousness. [ESM1b paper](https://www.nature.com/articles/s41588-023-01465-0)

## <a id="download-format:population-observations-columns"></a>Population Observations Columns
There are five columns in this category:

- [Genomic_location](#download-format:genomic-location)
- [Cytogenetic_band](#download-format:cytogenetic-band)
- [Other_identifiers_for_the_variant](#download-format:other-identifiers-for-the-variant)
- [Diseases_associated_with_variant](#download-format:diseases-associated-with-variant)
- [Variants_colocated_at_residue_position](#download-format:variants-colocated-at-residue-position)

<a id="download-format:genomic-location"></a>**AL - Genomic_location:** The variant described in HGVS format. This is a different way of describing the variant which includes the sequence
version of the reference genome assembly: [HGVS website](https://varnomen.hgvs.org/bg-material/simple/)

<a id="download-format:cytogenetic-band"></a>**AM - Cytogenetic_band:** The region of the chromosome containing the variant position. Cytogenic bands are areas of chromosomes rich in
actively transcribing DNA.

<a id="download-format:other-identifiers-for-the-variant"></a>**AN - Other_identifiers_for_the_variant:** Description of the same variant (position and nucleotide change) as the user entered variant in different databases. The source database name is given, separated by the variant ID with "-" then separated from the clinical consequence with ";". Each separate database is separated by "|". For example:
> ClinVar-RCV000003593;Pathogenic|UniProt-VAR_017144;Pathogenic.

<a id="download-format:diseases-associated-with-variant"></a>**AO - Diseases_associated_with_variant:** Describes diseases from literature which have been associated with the variant containing protein. There may be multiple diseases listed which are separated by "|". The evidence for each disease is in brackets which may be a CliVar ID or Pubmed link to a publication.

<a id="download-format:variants-colocated-at-residue-position"></a>**AP - Variants_colocated_at_residue_position:** This column describes other variants which have been described at the same AMINO ACID position. As a codon is three nucleotides this means that the variants here could be at any one of three positions and can be any alternative allele.

## <a id="download-format:structure-annotations-columns"></a>Structure Annotations Columns

This category has one column:

<a id="download-format:position-in-structures"></a>**AQ - Position_in_structures:** This column shows which PDB protein structures contain the variant. This is not an exhaustive list of all structures
of the protein as some structures will not cover the region containing the variant. The format is:
> PDB_accesion;chain_position_in_structure,chain_position_in_structure;structure_resolution;structure_method. Structures are separated by "|".
