// Column group counts for the CSS grid result table
export const GENOMIC_COLS = 4;    // user-id | genomic-pos | codon | cadd
export const PROTEIN_COLS = 4;    // isoform | protein-name | aa-change | consequence
export const ANNOTATION_COLS = 3; // popeve | alphamiss | details
export const TOTAL_COLS = GENOMIC_COLS + PROTEIN_COLS + ANNOTATION_COLS; // 11

export const ALLELE: Map<string, string> = new Map(Object.entries({
  G: "Guanine",
  A: "Adenine",
  C: "Cytosine",
  T: "Thymine"
}));

export const CONSEQUENCES: Map<string, string> = new Map(Object.entries({
  "missense": "The genetic variant produces an amino acid that is different from the reference amino acid",
  "synonymous": "The genetic variant produces an amino acid that is the same as the reference amino acid",
  "stop gained": "The genetic variant produces as new stop codon in place of the reference amino acid"
}));
