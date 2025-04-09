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