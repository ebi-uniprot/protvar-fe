import {Evidence, EvidencedString} from "./Common";
import {Foldx, Interaction, Pocket} from "./Prediction";
import {Comment} from "./Comment";

export interface FunctionalInfo {
    accession: string
    id: string
    proteinExistence: string
    gene: Array<Gene>
    comments: Array<Comment>
    features: Array<Feature>
    //dbReferences: Array<DBReference> // not used
    sequence: Sequence

    //position: number // not used
    //type: string // not used
    name: string
    alternativeNames: string
    lastUpdated: string

    // Predictions
    pockets: Array<Pocket>
    foldxs: Array<Foldx>
    interactions: Array<Interaction>
}

export interface Gene {
    name: EvidencedString
    synonyms: Array<EvidencedString>
}

export interface Feature {
    type: string
    category: string
    description: string
    begin: string
    end: string
    evidences: Array<Evidence>
}

interface Sequence {
    length: number
    sequence: string
    modified: string
}