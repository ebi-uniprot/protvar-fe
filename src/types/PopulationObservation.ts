import {DbReferenceObject, Evidence} from "./Common";

export interface PopulationObservation {
    accession: string,
    position: number,
    chromosome: string,
    genomicPosition: number,
    altBase: string,
    variants: Array<Variant>,
    freqMap: { [key: string]: AlleleFreq };
}

export interface AlleleFreq {
    ac: number;
    an: number;
    af: number;
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