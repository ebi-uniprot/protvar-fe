export const TOTAL_COLS = 14;
export const INPUT_COLS = 5;
export const GENOMIC_COLS = 3;
export const PROTEIN_COLS = 6;
export const ANNOTATION_COLS = 1;
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