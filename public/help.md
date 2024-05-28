### Help

1. [Website](#website)
2. [Download File](#download-file)
3. [API](#api)
4. [Direct Variant Link](#direct-variant-link)

---

##### <a name="website"></a>Website

Clicking each category in the contents below will take you to an annotated image of the relevant page in ProtVar linked to more detailed descriptions of each feature.

- [Home Page](#home-page)
- [Results Page](#results-page)
- [Functional Information](#function-annotations)
- [Population Observations](#population-observations)
- [Structure Annotations](#structure-annotations)
- [Download Options](#download-options)
- [Downloads](#downloads)


###### <a name="home-page"></a>Home Page

![ProtVar Home Page](images/v1.2/home_page.png)
**A.** ProtVar retrieves annotations and predictions for human [missense](#missense) variants.  
**B.** Users can submit a new search by pressing here and returning to the home screen.
**C.** The [results page](#results-page) page following variant list submission.  
**D.** [Downloads](#downloads) contains all the files you have submitted for download. These can be downloaded from here to your local computer.  
**E.** This can be used to [contact](#contact) ProtVar with questions, comments or suggestions.  
**F.** [ProtVar REST API](#protvar-rest-api) can be used to obtain data programmatically.
**G.** The Help section in ProtVar contains information about the options and fields available in the user interface and a description of the columns in the download.
**H.** About contains information about the ProtVar resource. HELP contains information to help users use the ProtVar resource.  
**I.** Release notes contains statistics about the current ProtVar release.
**J.** Variants can be pasted in the box and then submitted to ProtVar by clicking “Submit”. ProtVar maps genomic coordinates to protein positions and protein positions to genomic coordinates. It can also map from cDNA positions to protein positions and retrieve variants using IDs from dbSNP, COSMIC and ClinVar.
**K.** The paste box can be populated using examples of the different variant formats accepted by ProtVar by clicking these buttons.
**L.** Users can choose which [genome assembly](#genome-assembly) to use for mapping or leave it for ProtVar to decide.  
**M.** [File upload](#file-upload) can be used for uploading large files from your computer.  
**N.** Users should press submit once they have pasted or uploaded their data and chosen the relevant options.

###### <a name="results-page"></a>Results Page

![ProtVar Results Page](images/v1.2/results_page.png)
**A.** [Downloads](#downloads) A. My downloads contains all the files you have submitted for download. These can be downloaded from here to your local computer. Users can return to the same results again by clicking the 'Results' tab. The results will remain during the users session or until they are replaced by new results.   
**B.** Navigate to the previous or next page of results and choose how many results to display on the page.
**C.** The legend shows the colour schemes and category boundaries for scores and predictions. The colours can be switched between ProtVar standardised colours and the original colours.
**D.** Download all variant results. The file will be available in [Downloads](#downloads)  
**E.** The data is split into [genomic position](#genomic-position) and [protein position](#protein-position) and [annotations](#annotations)  
**F.** The types and number of user inputs and processing by ProtVar is shown here.
**G.** The [data type](#data-types) used to submit the variant is shown in pink. Multiple lines may be shown for a single input in cases such as overlapping genes or when the specific SNP is ambiguous.  
**H.** [CADD](#cadd) score is a nucleotide level predictor of pathogenicity.  
**I.** Mappings to different [isoforms](#isoforms) can be observed by expanding.  
**J.** AlphaMissense is an amino acid level predictor of pathogenicity.
**K.** Each of three Annotation types [Function annotation](#function-annotations) and [Population Observations](#population-observations) and [Structure Annotations](#structure-annotations) regarding each variant can be explored by clicking on the icons.

###### <a name="function-annotations"></a>Function Annotations

![ProtVar Function Annotations](images/v1.2/function_annotations.png)  
**A.** This page contains the [function annotations](#function-annotations) relating to the variant position in the protein.  
**B.** This window contains data regarding the precise variant position in the protein from UniProt and predictions.  
**C.** Curated annotations retrieved from UniProt specifically pertaining to the protein position of the variant.
**D.**  The conservation of the wild-type amino acid from inter species alignments. A score of 0 represents the minimal conservation and a score of 1 is maximal conservation.
**E.** [The predicted free energy change](#predicted-free-energy-change)  in the protein when the reference amino acid is replaced with the variant as calculated using foldX v5.0 on the AlphaFOld structure.
**F.** Predictions relating to the probability that the user entered variant has a pathogenic or benign consequence.
**G.** Information regarding the [region](#region) in which the variant position is located from UniProt.  
**H.** Curated annotations retrieved from UniProt pertaining to the region of the protein surrounding  the variant.
**I.** Predicted [protein pockets](#protein-pockets) containing the variant position containing data on the physicochemical properties and confidence of the pocket prediction.
**J.**  Predicted [protein-protein interfaces](#protein-protein-interfaces) containing the variant position with information about the quality of the interface and the proteins involved.
**K.** A description of the function of the protein from UniProt.  
**L.** This window contains information about the reference protein from UniProt.  
**M.** Protein names and identifiers and UniProt entry information.  
**N.** [General protein information](#general-protein-information) from UniProt.  
**O.** [Ensembl identifiers](#ensembl-identifiers) for the gene and for the transcript which translates to the UniProt canonical isoform.

###### <a name="population-observations"></a>Population Observations

![ProtVar Population Observations](images/v1.2/population_observations.png)  
**A.** - This page contains data about the variant in other resources and [co-located variants](#co-located-variants)  
**B.** - This window displays identifiers of the user submitted variant in different databases with links to them.  
**C.** - Variants [co-located](#co-located-variants) at the same amino acid as the user variant and associated diseases.  
**D.** - Diseases associated with variation in the protein.

###### <a name="structure-annotations"></a>Structure Annotations

![ProtVar Structure Annotations](images/v1.2/structure_annotations.png)  
**A.** This page shows the position of the user variant in protein structures.  
**B.** The structure can be animated via this button for example it can spin or rock.  
**C.** The [3D structure viewer](#3d-structure-viewer) uses Mol* to display the structures selected from the tables on the right.  
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

![ProtVar AlphaFold](images/v1.2/alphafold.png)  
**A.** The latest AlphaFold model for the protein containing the variant with the variant position according to AlphaFold structure numbering.
**B.** Model position confidence. From AlphaFold: “AlphaFold produces a per-residue estimate of its confidence on a scale from 0 - 100. This confidence measure is called pLDDT and corresponds to the model’s predicted score on the lDDT-Cα metric.”
**C.** Predicted align error indicates the confidence in assigning the correct relative positions between regions in the structure and is produced for each structure by AlphaFold.

![ProtVar Pockets](images/v1.2/pockets.png)  
**A.** Predicted pockets are displayed in this table if they contain the variant position. There may be multiple pockets overlapping the variant position in which case each can be selected here.
**B.** Press this button to highlight all of the residues which form the pocket in pink. The variant will also be highlighted but in yellow.
**C.** AlphaFold model confidence is disabled in the structure when investigating pockets but can be retrieved by resetting the view.

![ProtVar Interfaces](images/v1.2/interfaces.png)  
**A.** Predicted protein-protein interactions are displayed in this table if the variant is considered to be part of the interface.
**B.** pDockQ is a measure of the quality of the interface.
**C.** This highlights the residues in both chains which are involved at the interface.

###### <a name="download-options"></a>Download Options

![ProtVar Download Options](images/download_options.png)  
**A.** - Users can choose to obtain mappings with annotations or mappings only (which is much faster).  
**B.** - Users can choose which specific fields are most useful to them.  
**C.** - Email addresses are optional and are used to notify users when their job is ready.  
**D.** - Job names are optional but can help users to identify specific jobs when multiple jobs have been submitted.  
**E.** - Pressing submit will put the job in a queue. The results will be available from the [Downloads](#downloads) tab.  
**F.** - Close to return to the results page

###### <a name="downloads"></a>Downloads

![ProtVar Downloads](images/downloads.png)  
**A.** - All of the user's downloads for this session will be displayed on this page.  
**B.** - The number of downloads for this session.  
**C.** - A date and time stamp when the download request was received.  
**D.** - ProtVar generated ID.  
**E.** - User supplied job name.  
**F.** - Status - an email will be sent to the user when the requested data is ready to download if they have chosen to supply one. The page will need to be refreshed manually to see the updated status.    
**G.** - Button to download to the user’s local machine.  
**H.** - Delete the file from the list.

#### Website Help Further Information

<a name="3d-structure-viewer"></a>**3D Structure Viewer:** 3D structures are visualised using the Mol* viewer which “is a modern web-based open-source toolkit for visualisation and analysis of large-scale molecular data”. Further information can be found at their website: [Mol* website](https://molstar.org/)
ProtVar uses a limited version of Mol* with less functionality than the full version to allow proteins to be displayed quickly and smoothly.

<a name="annotations"></a>**Annotations:** Annotations are subdivided into function annotations, population observations and structure annotations. Annotations either help the user to understand the function of the reference amino acid at the variant position, evaluate the likelihood that the variant amino acid will alter the function or contextualise the variant position and protein role to suggest what effect the variant may have on the organism.

<a name="cadd"></a>**CADD:** CADD scores “the deleteriousness of single nucleotide variants as well as insertion/deletions variants in the human genome” - from the [CADD website](https://cadd.gs.washington.edu/) CADD scores are freely available for all non-commercial applications however a licence is required for commercial applications, details of which can be found on their website. [CADD citation](https://www.nature.com/articles/ng.2892)

<a name="co-located-variants"></a>**Co-located Variants:** ProtVar retrieves variants which have been reported at the same amino acid position as the variant. This means that the point mutation itself may be any of the three nucleotide positions of the codon, not necessarily the same genomic position as the user entered variant.

<a name="contact"></a>**Contact:** If you have any problems using ProtVar or cannot retrieve the data you want then please use the contact form to get in touch with the ProtVar team who will do their best to assist you. Additionally if you have any suggestions to improve ProtVar or requests to add something new to help your work then please let us know.

<a name="data-types"></a>**Data Types:** The following variant input data types are currently supported by ProtVar: [VCF](#vcf), [gnomAD](#gnomad), [HGVS](#HGVS), [Protein position](#protein-position), [dbSNP ID](#dbsnp-id).

Examples of each of the formats can be found to the right of the paste input box.
A mixture of formats can be submitted. For example:
>rs864622779  
P22304 A205P  
X 149498202 . C G

ProtVar will evaluate each one and map them to the protein position in a unified format.

<a name="dbsnp-id"></a>**dbSNP ID:** dbSNP is a resource which “contains human single nucleotide variations, microsatellites, and small-scale insertions and deletions." The resource can be found here: [dbSNP website](https://www.ncbi.nlm.nih.gov/snp/) Variants in ProtVar can be searched via the paste box or uploaded using dbSNP RefSNP IDs for example:
> rs4148323

Because dbSNP IDs may represent more than one variant allele, ProtVar will separate the different variant alleles onto different lines on the mapping page. This is because the different variant alleles may have different consequences to the protein

<a name="download"></a>**Download:** Downloads can be tailored according to the users’ needs. If only mappings from genomic coordinates to protein positions are required then “mappings only” can be used. If specific annotations are required then these can be selected individually. Each annotation category selected adds extra time to produce the downloadable file. Files ready for download are displayed in the "Downloads” section. Optionally users can add a job name to keep track of multiple jobs and an email address so that they can be informed when the file is ready to be downloaded. All of the annotations in the download file can also be accessed programmatically via the ProtVar REST API.

<a name="ensembl-identifiers"></a>**Ensembl identifiers:** The ENSG (Ensembl gene identifiers), ENSP (Ensembl translated sequence identifiers) and ENST (Ensembl transcript identifiers) are given for each isoform. The identifiers in the "Function Annotation" section correspond to those associated with the UniProt canonical isoform. More information about Ensembl stable IDs can be found here: [Ensembl website](http://www.ensembl.org/info/genome/stable_ids/index.html)

<a name="eve"></a>**EVE:** EVE is “a model for the prediction of clinical significance of human variants based on sequences of diverse organisms across evolution”. To cite the use of EVE scores: [EVE paper](https://www.nature.com/articles/s41586-021-04043-8)
To explore EVE scores further visit the [EVE website](https://evemodel.org/)

<a name="function-annotationse"></a>**Function Annotations:** Function annotations are principally sourced from UniProt. There are three sections. The first section contains annotations describing the variant position only. The second section describes the region surrounding the variant as the variant may play a role in a function reliant on the region. The third section describes the role of the protein more generally in order for the user to predict the effect on the organism if the variant affects protein function.

<a name="file-upload"></a>**File Upload:** Any file in plain text format can be uploaded to ProtVar, the delimiter is unimportant and could be a space, tab or comma etc. ProtVar will strip header lines from uploaded files as well as any other data provided additionally to the 4/5 columns required. The output will be in the same variant order as the input file.

<a name="general-protein-information"></a>**General protein information:** Annotations regarding the variant position itself and the surrounding region may inform users as to the probability that the variation may perturb a protein function. However, more general protein information is required to consider what that effect might have on the organism. This information is all taken from UniProt.

<a name="genomic-position"></a>**Genomic position:** Genomic position is defined in terms of the chromosome the variant is found on in the genome and the position within the sequence in terms of a reference assembly. The genomic descriptions in ProtVar results also include the codon which the variant is in with the precise position in upper case as well as the reference and variant nucleotides. Also, in this section is the CADD score of predicted pathogenicity.

<a name="genome-assembly"></a>**Genome Assembly:** All of the annotations in ProtVar are based upon the mappings between GRCh38 assembly and the UniProt canonical isoform sequence. However, ProtVar does support coordinates in GRCh37 which can be uploaded or pasted to search. ProtVar will map the positions from the GRCh37 to the GRCh38 equivalent positions using pre-mapped equivalency tables derived from the CrossMap tool [CrossMap website](https://crossmap.sourceforge.net/). Users should specify the assembly if they know it. However, ProtVar will by default attempt to predict which assembly the user has submitted by comparing the nucleotides at each user entered coordinate against each reference assembly. This will not work reliably for very small (<10) numbers of variants submitted.

<a name="genomic-coordinates-to-protein-positions"></a>**Genomic Coordinates to Protein Positions:** ProtVar maps genomic coordinates to protein positions by using Ensembl exon boundary coordinates, mapping to relevant positions on transcripts, matching translated transcripts to canonical isoforms and calculating protein positions. By default the canonical isoform is shown as the UniProt annotations use this isoform for numbering.

<a name="gnomad"></a>**gnomAD:** Users may want to copy and paste variants directly from the GnomAD UI to rapidly retrieve annotations, the gnomAD website can be found here: [GnomAD website](http://www.gnomad-sg.org/). The following VCF-like format is therefore supported in ProtVar:
>X-149498202-C-G

<a name="hgvs"></a>**HGVS:** Variants can be submitted to ProtVar using the HGVS nomenclature standard for single nucleotide polymorphisms. This format differs from VCF in that it incorporates the reference sequence the coordinate is based upon, for example:
>NC_000023.11:g.149498202C>G

Futher details about the HGVS format can be found on the [HGVS website](https://varnomen.hgvs.org/bg-material/simple/)

<a name="isoforms"></a>**Isoforms:** ProtVar maps from genomic coordinates to as many different isoforms of the protein as possible. This is limited by the match between the translated transcripts and isoform sequences in UniProt. The isoform displayed by default is the Uniprot canonical isoform which is denoted by a logo “can”. All of the annotations are based upon the numbering in the canonical isoform. Other isoforms, where the variant may be in a different numerical position, are denoted by a logo “iso”.

<a name="missense"></a>**Missense:** ProtVar retrieves annotations and predictions for the evaluation of missense mutations. Missense mutations are single nucleotide changes which result in a codon which encodes a different amino acid to the reference sequence. Synonymous mutations are also handled by ProtVar where a point mutation does not alter the encoded amino acid.

<a name="downloads"></a>**Downloads:** This page contains all the jobs sent for download for this browser session. This means that if you submit several different variant sets you will see a list of jobs here. From this page you can see the status of jobs to check if they are ready. When they are, the files can be downloaded to your local machine.

<a name="paste"></a>**Paste:** Several thousand variants can be pasted into the box (for longer lists please upload a file).

<a name="population-observations"></a>**Population Observations:** Descriptions of other humans with the same variation or in the same amino acid location to help users to assess the likely effect of their variant. ProtVar retrieves IDs from several databases which report the same variant as the user query. It also pulls data on co-located variants at the same amino acid position along with accompanying disease notes. ProtVar also retrieves information regarding diseases which have been associated with the protein.

<a name="predicted-free-energy-change"></a>**Predicted Free Energy Change:** This is the difference in Gibbs free energy (stability) of the protein between the wild type state and the protein containing the variant amino acid. It is calculated using the AlphaFold2 structure using FoldX software, details of which can be found on the [FoldX website](https://foldxsuite.crg.eu/)

<a name="protein-protein-interfaces"></a>**Protein-protein Interfaces:** Protein-protein interfaces have been predicted between proteins thought to interact. Both chains are predicted together using the ALphafold2 algorithm. All of the interface data in ProtVar are taken from the following paper which should be cited if this information is used: [Interface paper](https://www.nature.com/articles/s41594-022-00910-8)

<a name="protein-pockets"></a>**Protein Pockets:** Protein pockets are predicted based on geometry and physico-chemical properties from the regions of high confidence in the AlphaFold2 models.

<a name="protein-position"></a>**Protein Position:** Variant annotations can be accessed in ProtVar via their protein accession and position. The proteins should be named according to the UniProt canonical isoform accession and numbering. ProtVar maps the protein position to the genomic coordinates of the relevant codon on the GRCh38 assembly. ProtVar then considers the codon sequence and the reference and variant amino acids provided by the user to calculate the exact coordinate(s) and the variant nucleotide(s). If there is more than one variant or coordinate which could be possible then both alternatives are shown on different rows in the results.

<a name="protein-position-to-genomic-coordinates"></a>**Protein Position to Genomic Coordinates:** If the user enters a UniProt accession and position the variant will firstly be mapped to the genomic location on the GRCh38 reference. ProtVar will then retrieve information based on that position. ProtVar uses the codon sequence of the reference and the amino acid variant to calculate which of the positions in the codon must be changed and to which other nucleotide to affect the user entered change. This means that the result is not always a single genomic position or nucleotide change if more than one change can cause the same amino acid variation.

<a name="protvar-rest-api"></a>**ProtVar REST API:** The REST API can be used to access single or groups of positions programmatically without needing to use the user interface. This may be useful for embedding in a pipeline or if the user wants to write a parser to extract specific information from the resulting json object.

<a name="region"></a>**Region:** The region has no fixed size but is simply the area surrounding the variant position in sequence space. This may include structural features such as helices or functional features such as binding regions.

<a name="structure-annotations"></a>**Structure Annotations:** ProtVar retrieves all human experimental structures which contain the protein position of the user defined variant. This is not necessarily all of the structures for that protein. Mol* is used to view the proteins which are retrieved from the PDBe. AlphaFold models are also shown for each protein and predicted pocket regions which contain the variant are displayed on these structures. The third table shows predicted protein-protein interactions where the variant is considered to be part of the interface.

<a name="vcf"></a>**VCF:** VCF is a tab separated text file format. It contains information about a position in the genome. ProtVar evaluates the first five fields in each line, namely:
>CHROM  - The name of the chromosome on which the variation is being called  
POS - The position of the variation on the sequence  
ID - An identifier of the variation for example dbSNP ID. This is not a mandatory field for ProtVar and can be left out or included as “.”  
REF - The reference base at the given position on the reference sequence. ProtVar always uses the reference of the most recent version of the assembly. If the user base does not match then a warning will appear on the results screen informing the user of the mismatch.  
ALT - The alternative allele at this position. This must be a single nucleotide for ProtVar.

Meta information and header lines are ignored by ProtVar
Further details regarding the VCF format can be found here: [VCF pdf](https://samtools.github.io/hts-specs/VCFv4.2.pdf)

ProtVar is as forgiving as possible with regards to the input format and will attempt to interpret the input if possible. For example the following formats can be read:
>X 149498202 . C/G  
>10 43118436 A C  
>2 233760498 . G A . . .  
>14 89993420 A G

---

##### <a name="download-file"></a>Download File

The output file has 41 columns in total. Every column value is double quoted, for example “User input” and then separated by a comma.
Columns can contain “N/A” as a value indicating either:

- The user did not requested the data (for example if only mappings are requested without annotation)
- We can not provide a value for reasons such as:
- No data exists in our database in the category for this variant
- One of the external APIs is not working

###### Download Help File Contents

The output file will be in CSV (comma separated values) format. The file is divided into the following general categories:


- [User Input Columns](#user-input-columns)
- [Mapping Notes Columns](#mapping-notes-columns)
- [Genomic Mapping columns](#genomic-mapping-columns)
- [Protein Mapping Columns](#protein-mapping-columns)
- [Function Annotations Columns](#function-annotations-columns)
- [Predictions Columns](#predictions-columns)
- [Population Observations Columns](#population-observations-columns)
- [Structure Annotations Columns](#structure-annotations-columns)

The descriptions of the columns in the download file below are numbered from left to right. The letters in brackets correspond to the columns when visualised in a spreadsheet.


- [User Input](#user-input)

<a name="user-input"></a>**A - User input:**
This field replicates the user input with no changes to the format. Users can use this field to match their input data to the annotated output file.

###### <a name="user-input-columns"></a>Genomic coodinate Columns

There are six columns:
- [Chromosome](#chromosome)
- [Coordinate](#coordinate)
- [ID](#id)
- [Reference_allele](#reference-allele)
- [Alternative_allele](#alternative-allele)

<a name="chromosome"></a>**B - Chromosome:**
Only numbers 1-22 or “X” or “Y” or mitochondria (chrM, mitochondria, mitochondrion, MT, mtDNA, mit) are accepted. All case insensitive.

<a name="coordinate"></a>**C - Coordinate:** The genomic coordinate position of the variant as interpreted from the user input. Only numeric characters.

<a name="id"></a>**D - ID:** This is a field which can optionally be provided by the user to keep track of their variants or store information about the variant which will be retained in the output file.

<a name="reference-allele"></a>**E - Reference_allele:** This is the reference allele. It is defined by the nucleotide identity at that coordinate in the reference genome build. If the user inputted nucleotide differs from the reference build the reference build nucleotide identity will be shown and not the user inputted identity. This conflict will be noted in the "notes" column. Any user inputs except 'A', 'G', 'C', 'T' will be flagged in the "notes section.

<a name="alternative-allele"></a>**F - Alternative_allele** This is the alternative allele and will always match the user input. Any user inputs except 'A', 'G', 'C', 'T' will be flagged in the "notes section.

###### <a name="mapping-notes-columns"></a>Mapping Notes Columns

<a name="mapping-notes"></a>**G - Mapping_notes:** Single column which describes potential issues with the user input. It will contain “N/A” if there is nothing to report. Possible issues include:
- Invalid input - Such as a nonsense chromosome, a non-numeric coordinate of invalid nucleotides in either the reference or variant allele positions
- The input sequence does not match the reference. Possible reasons for this include:
  - user error
  - an updated sequence in the reference build
  - because the user has submitted variants from a different reference genome such as GRCh37)
- Mapping not found. Reasons may include:
  - variant in an intergenic region
  - variant in an intronic region
  - no transcript maps to the canonical isoform

###### <a name="genomic-mapping-columns"></a>Genomic Mapping Columns

Contains information regarding mapping of the user variant input to the relevant gene(s), transcript(s) and codon. The category contains six columns:
- [Gene](#gene)
- [Codon_change](#codon-change)
- [Strand](#strand)
- [CADD_phred-like_score](#cadd-phred-like-score)
- [Canonical_isoform_transcripts](#canonical-isoform-transcripts)
- [MANE_transcript](#mane-transcript)

<a name="gene"></a>**H - Gene:** The gene symbol as defined by the HGNC. [HGNC website](https://www.genenames.org/about/guidelines/)
Symbols contain only uppercase Latin letters and Arabic numerals, and punctuation is avoided, with an exception for
hyphens in specific groups.

<a name="codon-change"></a>**I - Codon_change:** The format is three nucleotides containing the reference allele which make the codon, followed by “/” and then the
three corresponding nucleotides but containing the alternative nucleotide. The position which is changed is capitalised,
for example aCg/aTg where the middle nucleotide of the codon is changed from a Cytosine (C) to a Thymine (T).

<a name="strand"></a>**J - Strand:** The reference genome and variants are stated as the positive strand only, therefore if a user enters G->T variant but the gene is on the negative strand the codon change displayed will be C->A (the reverse complement).

<a name="cadd-phred-like-score"></a>**K - CADD_phred_like_score:** The CADD (Combined Annotation Dependent Depletion) score is a nucleotide specific pathogenicity score devised at the University of Washington - [CADD website](https://cadd.gs.washington.edu/)
They calculate a score for every possible change in the genome. The phred-like score ("scaled C-scores") ranges from 1 to 99. It is based on the rank of each variant relative to all possible 8.6 billion substitutions in the human reference genome.

<a name="canonical-isoform-transcripts"></a>**L - Canonical_isoform_transcripts:** The transcripts and transcript translation identifiers which correspond to the UniProt canonical isoform. Transcripts (DNA sequences) have an ID starting with “ENST”. There can be several different transcripts which encode the same
isoform because they may differ in their untranslated (non-coding) regions at either end. The translated transcript has an ID
starting “ENSP”. For example:
>[ENSP00000337353(ENST00000335725,ENST00000123456).

<a name="mane-transcript"></a>**M - MANE_transcript:** MANE (Matched Annotation from NCBI and EBI). - One of the transcripts is selected as the representative by NCBI and Ensembl. This transcript may not translate into the UniProt canonical isoform sequence. If the MANE Select corresponds directly to the isoform described in the row the MANE Select ID is given. If they do not match, "N/A" is found in the column and the MANE Select ID is found with the corresponding transcript in the "Alternative_isoform_mappings" column. More information can be found on the [Ensembl website](https://www.ensembl.org/info/genome/genebuild/mane.html)

###### <a name="protein-mapping-columns"></a>Protein Mapping Columns

Contains information regarding mapping of the user variant input to the encoded protein(s). The category contains six columns:

- [Uniprot canonical_isoform (non_canonical)](#uniprot-canonical)
- [Alternative_isoform_mappings](#alternative-isoform-mappings)
- [Protein_name](#protein-name)
- [Amino_acid_position](#amino-acid-position)
- [Amino_acid_change](#amino-acid-change)
- [Consequences](#consequences)


<a name="uniprot-canonical"></a>**N - Uniprot canonical_isoform (non_canonical):** This is the accession of the canonical isoform of the protein if ProtVar is able to map the variant to it. ProtVar always attempts to map to this isoform because most of the UniProt annotations are based on numbering in the canonical isoform. Sometimes ProtVar cannot map to the canonical isoform
but can to an alternative isoform (sequence version of the protein). In these cases brackets are displayed around the accession to show that the mapping is to a non-canonical isoform.

<a name="alternative-isoform-mappings"></a>**O - Alternative_isoform_mappings:** Details about each isoform including the isoform accession, amino acid position in the isoform, amino acid change,
consequence and ENSP and ENST identifiers. Many genes have several transcripts caused by alternative splicing, some of which translate into different isoforms. Here we list details about all the isoforms where we can map from genomic location to isoform. Isoforms are separated by "|".

<a name="protein-name"></a>**P - Protein_name:** The full protein name from UniProt.

<a name="amino-acid-position"></a>**Q - Amino_acid_position** The position of the amino acid in the UniProt canonical isoform or the alternative isoform shown in the UniProt canonical_isoform(non_canonical) column.

<a name="amino-acid-change"></a>**R - Amino_acid_change:** The identity of the reference and variant amino acid caused by the missense mutation. Three letter amino acid nomenclature is used separated by "/". Stop codons are shown as an asterisk (\*).

<a name="consequences"></a>**S - Consequences:** The consequence of the variant on the amino acid sequence.

###### <a name="function-annotations-columns"></a>Function Annotations Columns

These columns contain functional annotations regarding the variant amino acid, region and protein. There are 12 columns in this category:

- [Residue_function_(evidence)](#residue-function)
- [Region_function_(evidence)](#region-function)
- [Protein_existence_evidence](#protein-existence)
- [Protein_length](#protein-length)
- [Entry_last_updated](#entry-last-updated)
- [Sequence_last_updated](#sequence-last-updated)
- [Protein_catalytic_activity](#protein-catalytic-activity)
- [Protein_complex](#protein-complex)
- [Protein_sub_cellular_location](#protein-sub-cellular-location)
- [Protein_family](#protein-family)
- [Protein_interactions_PROTEIN(gene)](#protein-interactions)


<a name="residue-function"></a>**T - Residue_function_(evidence):** Functional features specifically describing the residue encoded by the user submitted variant.

<a name="region-function"></a>**U - Region_function_(evidence):** This column describes functional features of the region in which the residue encoded by the user submitted variant falls. The range of the region is provided after the ";". Overlapping regions describing the variant are separated by "|".

<a name="protein-existence"></a>**V - Protein_existence_evidence:** Describes if there is experimental evidence to support the existence of the protein.

<a name="protein-length"></a>**W - Protein_length:** The length of the UniProt canonical isoform sequence in amino acids.

<a name="entry-last-updated"></a>**X - Entry_last_updated:** When the UniProt entry was last updated with any type of information.

<a name="sequence-last-updated"></a>**Y - Sequence_last_updated:** When the canonical isoform sequence was last updated.

<a name="protein-catalytic-activity"></a>**Z - Protein_catalytic_activity:** Describes the reactions previously ascribed to this protein. These are not necessarily reactions affected by the variant amino acid but they could be. The RHEA ID (a SIB reactions database) is given as is the evidence(s) from publications. Different reactions are separated by "|". For example:

> RHEA:25017(PubMed:[16824732,9593664,9811831])|RHEA:20629(PubMed:[9256433])

<a name="protein-complex"></a>**AA - Protein_complex:** Describes whether the protein containing the variant exists in a complex.

<a name="protein-sub-cellular-location"></a>**AB - Protein_sub_cellular_location:** Describes the location within the cell where the protein is localised. There may be more than one location if multiple locations have been described.

<a name="protein-family"></a>**AC - Protein_family:** Describes the functional family that the protein belongs to.

<a name="protein-interactions"></a>**AD - Protein_interactions_PROTEIN(gene):** This shows which other proteins have been shown to interact with the variant containing protein. This data is from the EMBL-EBI IntAct database and is predominantly from manual curation. The format is: UniProt accession(gene symbol). Different interacting partners are separated by ";".

###### <a name="predictions-columns"></a>Structure Prediction Columns
Predictions based on structure hosted by ProtVar. There are 4 columns in this category:

- [Predicted_pockets](#predicted-pockets)
- [Predicted_interactions](#predicted-interactions)
- [Foldx_prediction](#foldx-prediction)
- [Conservation_score](#conservation-score)

<a name="predicted-pockets"></a>**AE - Predicted_pockets:** This shows the residues which are predicted to form a pocket in the AlphaFold modelled protein.

<a name="predicted-interactions"></a>**AF - Predicted_interactions:**  Interface residues are predicted from folding proteins which are considered to interact simultaneously using the Alphafold2 algorithm. The interfaces are then scored for confidence.

<a name="foldx-prediction"></a>**AG - Foldx_prediction:** The predicted Gibbs free energy change of the protein when the variant is introduced as calculated using the FoldX algorithm: [foldX website](https://foldxsuite.crg.eu/)

<a name="conservation-score"></a>**AH - Conservation_score:**  Is a score from 0-1 where 0 is not at all conserved and 1 is totally conserved in pre-calculated multiple sequence alignments based on UniRef90 and scored using the ScoreCons algorithm.

###### <a name="predictors-columns"></a>Pathogenicity Prediction Columns
Pathogenicity prediction retrieved from other resources (all pre-computed). There are 3 columns in this category:

- [AlphaMissense_pathogenicity(class)](#alphamissense)
- [EVE_score(class)](#eve-score)
- [ESM1b_score](#esm1b-score)

<a name="alphamissense"></a>**AI - Alpha_Missense:** AlphaMissense score is a pathogenity score based on ALphaFold structures. It ranges from 0 to 1 with higher scores more likely to be pathogenic. The categories have different boundaries based on the protein and are taken directly from AlphaMissense. [AlphaMissense paper](https://www.science.org/doi/10.1126/science.adg7492) [AlphaMissense data](https://zenodo.org/records/8208688)

<a name="eve-score"></a>**AJ - EVE:** Evolutionary model of variant effect. A score from 0-1 (predicted benign-pathogenic) and a category benign/uncertain/pathogenic. [EVE paper](https://www.nature.com/articles/s41586-021-04043-8)

<a name="esm1b-score"></a>**AK - ESM1b_score:** A a 650-million-parameter protein language model trained on 250 million protein sequences across all organisms. It is log 10 scaled and the category boundaries can be seen in the ProtVar legend. Higher scores equate to variants with a higher probability of deliteriousness. [ESM1b paper](https://www.nature.com/articles/s41588-023-01465-0)

###### <a name="population-observations-columns"></a>Population Observations Columns
There are five columns in this category:

- [Genomic_location](#genomic-location)
- [Cytogenetic_band](#cytogenetic-band)
- [Other_identifiers_for_the_variant](#other-identifiers-for-the-variant)
- [Diseases_associated_with_variant](#diseases-associated-with-variant)
- [Variants_colocated_at_residue_position](#variants-colocated-at-residue-position)

<a name="genomic-location"></a>**AL - Genomic_location:** The variant described in HGVS format. This is a different way of describing the variant which includes the sequence
version of the reference genome assembly: [HGVS website](https://varnomen.hgvs.org/bg-material/simple/)

<a name="cytogenetic-band"></a>**AM - Cytogenetic_band:** The region of the chromosome containing the variant position. Cytogenic bands are areas of chromosomes rich in
actively transcribing DNA.

<a name="other-identifiers-for-the-variant"></a>**AN - Other_identifiers_for_the_variant:** Description of the same variant (position and nucleotide change) as the user entered variant in different databases. The source database name is given, separated by the variant ID with "-" then separated from the clinical consequence with ";". Each separate database is separated by "|". For example:
> ClinVar-RCV000003593;Pathogenic|UniProt-VAR_017144;Pathogenic.

<a name="diseases-associated-with-variant"></a>**AO - Diseases_associated_with_variant:** Describes diseases from literature which have been associated with the variant containing protein. There may be multiple diseases listed which are separated by “|”. The evidence for each disease is in brackets which may be a CliVar ID or Pubmed link to a publication.

<a name="variants-colocated-at-residue-position"></a>**AP - Variants_colocated_at_residue_position:** This column describes other variants which have been described at the same AMINO ACID position. As a codon is three nucleotides this means that the variants here could be at any one of three positions and can be any alternative allele.

###### <a name="structure-annotations-columns"></a>Structure Annotations Columns

This category has one column:

<a name="other-identifiers-for-the-variant"></a>**AQ - Position_in_structures:** This column shows which PDB protein structures contain the variant. This is not an exhaustive list of all structures
of the protein as some structures will not cover the region containing the variant. The format is:
> PDB_accesion;chain_position_in_structure,chain_position_in_structure;structure_resolution;structure_method. Structures are separated by "|".


---
##### <a name="api"></a>API

ProtVar REST API is a programmatic way to obtain information from ProtVar. You can query:

- A list of variants via their genomic coordinates and choose which annotations you require. These can be posted as a list and then downloaded or emailed or a file can be uploaded.
- Genomic coordinates to retrieve mappings to positions in proteins for all isoforms.
- Individual amino acid positions to retrieve functional/structural/co-located variant annotations via a json object.

REST API uses OpenAPI 3 which means you can use utils like openapi-generator to generate model classes.

---
##### <a name="direct-variant-link"></a>Direct variant Link Help

You can access variant annotations directly using the following URL structures and bypassing the input screen.
You can use genomic coordinates, protein positions but you must state both the reference and variant allele,
and also use search terms as you would do in the Search Variants box.

Examples of valid requests are given below.

Using genomic coordinates:

> www.ebi.ac.uk/ProtVar/query?chromosome=19&genomic_position=1010539&reference_allele=G&alternative_allele=C  
> www.ebi.ac.uk/ProtVar/query?chromosome=14&genomic_position=89993420&reference_allele=A&alternative_allele=G  
> www.ebi.ac.uk/ProtVar/query?chromosome=10&genomic_position=87933147&reference_allele=C&alternative_allele=T

Using protein accession and position:

> www.ebi.ac.uk/ProtVar/query?accession=Q4ZIN3&protein_position=558&reference_AA=S&variant_AA=R  
> www.ebi.ac.uk/ProtVar/query?accession=Q9NUW8&protein_position=493&reference_AA=H&variant_AA=R  
> www.ebi.ac.uk/ProtVar/query?accession=P60484&protein_position=130&reference_AA=R&variant_AA=T  
> www.ebi.ac.uk/ProtVar/query?accession=P60484&protein_position=130&reference_AA=N&variant_AA=G

Using search terms:

> www.ebi.ac.uk/ProtVar/query?search=NC_000021.9:g.25905076A>T  
> www.ebi.ac.uk/ProtVar/query?search=rs864622779,P22304%20A205P

The search option supports all the accepted formats and up to a maximum of 10 inputs separated by comma. Note that any
space in the URL will be encoded (converted) to a special character for e.g. `P22304 A205P` becomes `P22304%20A205P` in the above input.