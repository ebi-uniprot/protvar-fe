# ProtVar Release Notes

## 22/05/2023
ProtVar will be launched on __Wednesday 24th May__ at an EMBL-EBI webinar at 15:30 BST (UTC+1). 
We will discuss the various ways in which ProtVar can help users with their work as well as recent improvements and 
fixes. Places are limited so please register to secure your place
[here](https://www.ebi.ac.uk/training/events/contextualise-and-interpret-human-missense-variation-protvar/).

## 30/05/2023 UPDATE
We have made some fixes and changes since the release on May 24th.
- novel predictions now in downloaded result files
- fixed failure of some large files due to a bug
- added a max. file limit of 10MB to cope with load

## 07/06/2023 UPDATE
- improve foldx coverage to 208M (from 5.9M) predicted values ie all 19 possible mutations 
- bug fix: ensure that GRCh37 build is correctly used in the download
- bug fix: missing fields (`Genomic_location, Cytogenetic_band, Other_identifiers_for_the_variant, Diseases_associated_with_variant`) in the download
- added optional `variantAA` query parameter to `/foldx/{acc}/{pos}` and `/function/{acc}/{pos}` endpoints