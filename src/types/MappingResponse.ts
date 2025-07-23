// Types matching the Java model for `Type`, `Format`, etc.
export type Type = "GENOMIC" | "CODING" | "PROTEIN" | "ID" | "INVALID";
export type Format =
  // Genomic
  | "VCF" | "HGVS_GEN" | "GNOMAD" | "INTERNAL_GENOMIC"
  // Coding
  | "HGVS_CODING"
  // Protein
  | "HGVS_PROT" | "INTERNAL_PROTEIN"
  // ID
  | "DBSNP" | "CLINVAR" | "COSMIC";
export type MessageType = "INFO" | "WARN" | "ERROR";

// Base interface for all user inputs
export interface UserInput {
  type: Type;
  format: Format;
  inputStr: string;
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
  inputs: UserInput[]
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