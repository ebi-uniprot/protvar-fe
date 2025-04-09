import {DbReferenceObject, Evidence} from "./Common";

export interface PopulationObservation {
    variants: Array<Variant>
}

export interface Variant {
    // Feature
    alternativeSequence: string,
    xrefs: Array<DbReferenceObject>,
    //evidences: Array<Evidence>,

    // Variant
    //cytogeneticBand: string,
    genomicLocation: Array<string>,
    //codon: string,
    //consequenceType: string,
    wildType: string,
    populationFrequencies: Array<PopulationFrequency>,
    //predictions: Array<VariantPrediction>,
    clinicalSignificances: Array<ClinicalSignificance>,
    association: Array<VariantAssociation>
}



export interface PopulationFrequency {
    populationName: string
    frequency: number
    sourceName: string
}

interface VariantPrediction {
    predictionValType: string,
    score: number,
    predAlgorithmNameType: string,
}

export interface ClinicalSignificance {
    type: string,
    sources: Array<string>
}

export interface VariantAssociation {
    name: string,
    description: string,
    //dbReferences: Array<DbReferenceObject>,
    evidences: Array<Evidence>,
    //disease: boolean
}