#### <a id="predictions"></a>Predictions

- **Conservation:** Inter species amino acid conservation based on UniRef90 sequence alignments using the ScoreCons algorithm (Source: PubMeb ID [11093265](https://pubmed.ncbi.nlm.nih.gov/11093265)).
Scored from 0 (no conservation) to 1 (complete conservation).

  - _0.00-0.15_ = very low conservation
  - _0.15-0.30_ = low conservation
  - _0.30-0.45_ = fairly low conservation
  - _0.45-0.60_ = moderate conservation
  - _0.60-0.75_ = fairly high conservation
  - _0.75-0.90_ = high conservation
  - _0.90-1.00_ = very high conservation

##### Structure Predictions

- **Stability change:** The predicted free energy change in the protein when the reference amino acid is replaced with the variant as calculated using foldX v5.0 on the AlphaFold2 structure (Source: PubMeb ID [15980494](https://pubmed.ncbi.nlm.nih.gov/15980494)). 

  A ΔΔG of more than 2 kcal/mol is considered to be likely destabilising to the protein.

##### Pathogenicity Predictions
Predictions relating to the probability that the user entered variant has a pathogenic or benign consequence.

- **CADD:** Scaled Combined Annotation-Dependent Depletion scores (Source: PubMeb ID [30371827](https://pubmed.ncbi.nlm.nih.gov/30371827)). An integrative annotation score built from genomic features. Scores are relative to all other scores. They are log10 scaled with higher values representing a more deleterious variant consequence.

  - _<15.0_ = likely benign
  - _15.0-19.9_ = potentially deleterious
  - _20.0-24.9_ = quite likely deleterious
  - _25.0-29.9_ = probably deleterious
  - _>29.9_ = highly likely deleterious

- **AlphaMissense:** (Source: PubMeb ID [37733863](https://pubmed.ncbi.nlm.nih.gov/37733863))
A deep learning model based on structural context and population frequencies.
Scores range from 0 (least deleterious) to 1 (most deleterious).
Category ranges vary and are provided by AlphaMissense.

- **EVE:** Evolutionary model of Variant Effect (Source: PubMeb ID [34707284](https://pubmed.ncbi.nlm.nih.gov/34707284)). Deep generative model using the distribution of variation in sequences across species.
Scores range from 0 (least effect) to 1 (largest effect).
Categorisation provided by EVE.

- **ESM-1b:** Evolutionary Scaled Model (Source: PubMeb ID [33876751](https://pubmed.ncbi.nlm.nih.gov/33876751)). Deep contextual language model built across a diverse range of species. 
Scores range from -25 (most deleterious) to 0 (least deleterious).

  - _-25 to -10_ = likely pathogenic
  - _-10 to -5_ = uncertain significance
  - _-5 to 0_ = likely benign


##### Pockets containing the variant
Predicted protein pockets containing the variant position and other amino acids involved in the pocket with prediction confidence (Source: PubMeb ID [38854010](https://pubmed.ncbi.nlm.nih.gov/38854010)).

- **Pocket confidence:** Filter pockets containing the variant in the protein according to confidence that the pocket exists. Thresholds taken from the original publication.

  - _>900_ = Very high confidence
  - _800-900_ = High confidence
  - _<800_ = Low confidence

- **Combined score:** Used to measure the confidence level of the pocket prediction (as above).
- **Pocket pLDDT mean:** The mean per residue model confidence for the amino acids predicted to form the pocket from AlphaFold.
- **Buriedness:** Ranges from 0 to 1 where 0 is entirely exposed to the solvent and 1 is completely buried.
- **Radius of gyration:** A measure of pocket compactness.
- **Residues:** The amino acids which are predicted to compose the pocket.

##### Protein-protein interfaces containing the variant
Predicted protein-protein interfaces containing the variant position with information about the quality of the interface and the proteins involved (Source: PubMeb ID [36690744](https://pubmed.ncbi.nlm.nih.gov/36690744), [38854010](https://pubmed.ncbi.nlm.nih.gov/38854010)).

- **pDockQ:** interface confidence score based on the pLDDT model confidence and the number of residues at the interface as demonstrated in the original research (above).

  - _<0.23_ = low confidence in the interface 
  - _0.23-0.5_ = high model confidence
  - _>0.5_ = very high confidence