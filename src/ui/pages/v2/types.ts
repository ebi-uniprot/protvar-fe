export type GenomeAssembly = 'auto' | 'grch37' | 'grch38';

export interface VariantSearchInput {
  variantText?: string;
  uploadedFile?: File | null;
  genomeAssembly: GenomeAssembly;
}
