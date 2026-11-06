import {AmScore, ConservScore, EsmScore, EveScore, M3dPred, PopEveScore} from "./MappingResponse";

export interface Pocket {
  structId: string
  pocketId: number
  radGyration: number
  energyPerVol: number
  buriedness: number
  resid: Array<number>
  meanPlddt: number
  score: number
}

export interface Foldx {
  proteinAcc: string
  position: number
  afId: string
  afPos: number
  wildType: string
  mutatedType: string
  foldxDdg: number
  plddt: number
  numFragments: number
}

export interface Interaction {
  a: string
  aresidues: Array<number>
  b: string
  bresidues: Array<number>
  pdockq: number
  pdbModel: string
}
// GET /prediction/{accession}/{position}[?variantAA=&include=]: everything predicted at a protein position. Field
// names are the prediction keys; variant-level lists have one entry per variant AA (one when variantAA is given).
export interface PredictionInfo {
  accession: string
  position: number
  variantAA?: string
  conserv?: ConservScore
  pocket?: Array<Pocket>
  interface?: Array<Interaction>
  alphamissense?: Array<AmScore>
  popeve?: Array<PopEveScore>
  esm?: Array<EsmScore>
  eve?: Array<EveScore>
  foldx?: Array<Foldx>
  m3d?: Array<M3dPred>
}
