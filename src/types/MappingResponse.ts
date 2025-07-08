// todo align with new backend model when in place (use VariantInput)
export type UserInput = GenomicInput|ProteinInput|IDInput|CodingInput

export interface MappingResponse {
  inputs: Array<UserInput>
  messages: Array<Message>
}

export interface Message {
  type: string
  text: string
}

export const INPUT_GEN = 'GENOMIC'
export const INPUT_PRO = 'PROTEIN'
export const INPUT_CDNA = 'CODING'
export const INPUT_ID = 'ID'

export const INFO = 'INFO'
export const WARN = 'WARN'
export const ERROR = 'ERROR'

export interface BaseInput {
  type: string
  format: string
  inputStr: string
  messages: Array<Message>
  //valid: boolean
}

export interface Message {
  type: string
  text: string
}

export interface GenomicInput extends BaseInput {
  chr:string
  pos:number
  ref:string
  alt:string
  id:string // TODO perhaps change to variantId to avoid ambiguity
  converted:boolean
  genes: Array<Gene>
}

export interface ProteinInput extends BaseInput {
  acc:string
  pos:number
  ref:string
  alt:string
  derivedGenomicInputs:Array<GenomicInput>
}

export interface IDInput extends BaseInput {
  id:string // TODO not needed, is 'inputStr'/'raw' in new model
  derivedGenomicInputs:Array<GenomicInput>
}

// for HGVSc input
export interface CodingInput extends BaseInput {
  acc:string
  pos:number
  ref:string
  alt:string

  gene:string
  protRef:string
  protAlt:string
  protPos:number

  derivedUniprotAcc:string
  derivedProtPos:number
  derivedCodonPos:number

  derivedGenomicInputs:Array<GenomicInput>
}

export interface Gene {
  ensg: string;
  reverseStrand: boolean;
  geneName: string;
  refAllele: string;
  altAllele: string;
  isoforms: Array<Isoform>;
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