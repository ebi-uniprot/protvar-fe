export type CustomInput = GenomicInput|ProteinInput|IDInput|CodingInput

export interface MappingResponse {
  inputs: Array<CustomInput>
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

export interface UserInput {
  inputStr: string
  messages: Array<Message>
  type: string
  format: string
  //valid: boolean
}

export interface Message {
  type: string
  text: string
}

export interface GenomicInput extends UserInput {
  chr:string
  pos:number
  ref:string
  alt:string
  id:string
  converted:boolean
  genes: Array<Gene>
}

export interface ProteinInput extends UserInput {
  acc:string
  pos:number
  ref:string
  alt:string
  derivedGenomicInputs:Array<GenomicInput>
}

export interface IDInput extends UserInput {
  id:string
  derivedGenomicInputs:Array<GenomicInput>
}

// for HGVSc input
export interface CodingInput extends UserInput {
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
  alleleFreq: number;
}
// TODO clean up unused commented properties below
export interface Isoform {
  accession: string;
  canonical: boolean;
  canonicalAccession: string;
  isoformPosition: number;
  refCodon: string;
//  userCodon: string;
  codonPosition: number;
  refAA: string;
//  userAA: string;
  variantAA: string;
  variantCodon: string;
  consequences: string;
  proteinName: string;
  transcripts: Array<Transcript>;
//  populationObservations: any;
  populationObservationsUri: string;
//  referenceFunction: any;
  referenceFunctionUri: string;
//  experimentalEvidence: Array<any>;
//  evolutionalInference: any;
//  evolutionalInferenceUri: string;
//  proteinStructure: Array<any>;
  proteinStructureUri: string;
  conservScore: ConservScore;
  amScore: AMScore;
  eveScore: EVEScore;
  esmScore: ESMScore;
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

export interface EVEScore {
  score:number
  eveClass:string
}

export interface ESMScore {
  score:number
}

export interface AMScore {
  amPathogenicity:number
  amClass:string
}

export default MappingResponse;