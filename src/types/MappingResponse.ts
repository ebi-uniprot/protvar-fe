// Types matching the Java model for `Type`, `Format`, etc.
export type VariantType = "GENOMIC" | "CODING_DNA" | "PROTEIN" | "VARIANT_ID" | "INVALID";
export type VariantFormat =
  // HGVS formats
  "HGVS_GENOMIC" | "HGVS_CODING" | "HGVS_PROTEIN" |
  // Internal formats
  "INTERNAL_GENOMIC" | "INTERNAL_PROTEIN" |
  // External formats
  "VCF" | "GNOMAD" |
  // ID-based formats
  "DBSNP" | "CLINVAR" | "COSMIC" |
  "INVALID";
export type MessageType = "INFO" | "WARN" | "ERROR";

// Base interface for all user inputs
export interface VariantInput {
  originalIndex: number;
  inputStr: string;
  format: VariantFormat;
  type: VariantType;
  messages: Message[];
  derivedGenomicVariants: GenomicVariant[];
  // Genomic fields only
  id?:string // VCF ID field
  isLiftedFrom37?:boolean // CrossMapped 37->38
}

export interface GenomicVariant {
  chromosome:string
  position:number
  refBase:string
  altBase:string
  genes: Gene[]
}


export interface MappingResponse {
  inputs: VariantInput[]
  messages: Message[]
}

export interface Message {
  type: MessageType
  text: string
}

export interface Gene {
  ensg: string;
  reverseStrand: boolean;
  geneName: string;
  refAllele: string;
  altAllele: string;
  isoforms: Isoform[];
  caddScore: number;
}

// TODO clean up unused commented properties below
export interface Isoform {
  accession: string;
  canonical: boolean;
  canonicalAccession: string;
  isoformPosition: number;
  refCodon: string;
  codonPosition: number;
  refAA: string;
  variantAA: string;
  variantCodon: string;
  consequences: string;
  proteinName: string;
  transcripts: Array<Transcript>;
  populationObservationsUri: string;
  referenceFunctionUri: string;
  proteinStructureUri: string;
  amScore: AmScore;
}

interface Transcript {
  enst: string;
  ensp: string;
  ense: string;
}

export interface TranslatedSequence {
  ensp: string
  ensts: string
}

export interface ConservScore {
  score:number
}

export interface EveScore {
  score:number
  eveClass:string
}

export interface EsmScore {
  score:number
}

export interface AmScore {
  amPathogenicity:number
  amClass:string
}