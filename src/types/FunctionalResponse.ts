import {Evidence} from "./Common";

export interface FunctionalResponse {
    position: number
    accession: string
    name: string
    alternativeNames: string
    geneNames: Array<GeneName>
    id: string
    proteinExistence: string
    type: string
    features: Array<ProteinFeature>
    comments: Array<Comment>
    sequence: Sequence
    lastUpdated: string
    dbReferences: Array<DBReference>
    pockets: Array<Pocket>
    foldxs: Array<Foldx>
    interactions: Array<P2PInteraction>
}

export interface GeneName {
    geneName: string
    synonyms: string
}

export interface ProteinFeature {
    begin: number
    end: number
    description: string
    type: string
    category: string
    typeDescription: string
    evidences: Array<Evidence>
}

interface Sequence {
    length: number
    sequence: string
    modified: string
}

export interface DBReference {
    id: string
    type: string
    properties: object
}

export interface Comment {
    type: string
    text: Array<CommentText>
    reaction: Reaction
    interactions: Array<Interaction>
    locations: Array<Locations>
    description: Description
    name: string
    url: string
}
interface CommentText {
    value: string;
    evidences: Array<Evidence>
}

export interface Reaction {
    name: string;
    dbReferences: Array<DBReference>
    evidences: Array<Evidence>
}

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

export interface P2PInteraction {
    a: string
    aresidues: Array<number>
    b: string
    bresidues: Array<number>
    pdockq: number
    pdbModel: string
}

export interface Interaction {
    accession1: string
    accession2: string
    gene: string
    interactor1: string
    interactor2: string
    organismDiffer: boolean
    experiments: number
}

interface Locations {
    location: CommentLocation
    topology: CommentLocation
}

interface CommentLocation {
    value: string
}

interface Description {
    value: string
    evidences: Array<Evidence>
}