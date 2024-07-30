import {
  Message, EVEScore, ConservScore, ESMScore, AMScore, TranslatedSequence
} from "../types/MappingResponse";

export interface MappingRecord {
  idx: number
  input: string
  type: string
  // GENOMIC column properties
  chromosome: string
  position: number
  converted?: boolean
  id: string
  refAllele: string
  altAllele: string
  geneName?: string
  codon?: string
  strand?: boolean
  cadd?: string
  // PROTEIN column properties
  canonical?: boolean   // display as can (true) or iso (false)
  isoform?: string
  canonicalAccession: string | null
  proteinName?: string
  aaPos?: number
  aaChange?: string // display as refAA/variantAA
  refAA?: string
  variantAA?: string
  cdsPosition?: number // not displayed or used anywhere
  consequences?: string
  conservScore?: ConservScore
  amScore?: AMScore
  eveScore?: EVEScore
  esmScore?: ESMScore
  // ANNOTATIONS column
  referenceFunctionUri?: string
  populationObservationsUri?: string
  proteinStructureUri?: string
  // OTHER properties
  ensp?: Array<TranslatedSequence>  // passed to FunctionalDetail component
  ensg?: string                     // passed to FunctionalDetail component
  msg?: Message
}