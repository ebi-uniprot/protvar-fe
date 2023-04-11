export interface MappingResponse {
  inputs: Array<GenomicInput|ProteinInput|RSInput>
  messages: Array<Message>
}

export interface Message {
  type: string
  text: string
}

export const INPUT_GEN = 'GEN'
export const INPUT_PRO = 'PRO'
export const INPUT_RS = 'RS'

export const INFO = 'INFO'
export const WARN = 'WARN'
export const ERROR = 'ERROR'

export interface UserInput {
  inputStr: string
  messages: Array<Message>
  type: string
  valid: boolean
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
  mappings:Array<GenomeProteinMapping>
}

export interface ProteinInput extends UserInput {
  acc:string
  pos:number
  ref:string
  alt:string
  derivedGenomicInputs:Array<GenomicInput>
}

export interface RSInput extends UserInput {
  id:string
  derivedGenomicInputs:Array<GenomicInput>
}

export interface GenomeProteinMapping {
  //chromosome: string;
  //geneCoordinateStart: number;
  //geneCoordinateEnd: number;
  //id: string;
  //userAllele: string;
  //variantAllele: string;
  genes: Array<Gene>;
  //input: string;
}
interface Gene {
  ensg: string;
  reverseStrand: boolean;
  geneName: string;
  refAllele: string;
  isoforms: Array<IsoFormMapping>;
  caddScore: number;
}
// TODO clean up unused commented properties below
interface IsoFormMapping {
  accession: string;
  canonical: boolean;
  canonicalAccession: string;
  isoformPosition: number;
  refCodon: string;
//  userCodon: string;
  cdsPosition: number;
  refAA: string;
//  userAA: string;
  variantAA: string;
  variantCodon: string;
  consequences: string;
  proteinName: string;
  translatedSequences: Array<Ensp>;
//  populationObservations: any;
  populationObservationsUri: string;
//  referenceFunction: any;
  referenceFunctionUri: string;
//  experimentalEvidence: Array<any>;
//  evolutionalInference: any;
//  evolutionalInferenceUri: string;
//  proteinStructure: Array<any>;
  proteinStructureUri: string;
  eveScore: number;
  eveClass: number;
}
interface Ensp {
  ensp: string;
  transcripts: Array<Transcript>;
}
interface Transcript {
  enst: string;
  ense: string;
}

export interface ParsedInput{
  chromosome: string
  start: number
  id: string
  ref: string
  alt: string
  inputString: string
  invalidReason: string
}
export default MappingResponse;