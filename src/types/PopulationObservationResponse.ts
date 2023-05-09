import {Evidence} from "./Common";

export interface PopulationObservationResponse {
    genomicColocatedVariant: any,
    proteinColocatedVariant: Array<ProteinColocatedVariant>
}

export interface ProteinColocatedVariant {
    cytogeneticBand: string,
    wildType: string,
    alternativeSequence: string,
    genomicLocation: string | null,
    populationFrequencies: Array<PopulationFrequency>,
    predictions: Array<Prediction>,
    xrefs: Array<Xref>,
    evidences: Array<Evidence>,
    association: Array<Association>,
    clinicalSignificances: Array<ClinicalSignificance>
}

interface Prediction {
    predictionValType: string,
    predAlgorithmNameType: string,
    score: number
}

export interface Xref {
    name: string,
    id: string,
    url: string,
    alternativeUrl: string,
    reviewed: any
}

export interface Association {
    name: string,
    description: string,
    dbReferences: Array<Xref>,
    evidences: Array<Evidence>,
    disease: boolean
}

export interface ClinicalSignificance {
    type: string,
    sources: Array<string>
}

export interface PopulationFrequency {
    sourceName: string
    populationName: string
    frequency: number
}