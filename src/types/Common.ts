export interface Evidence {
    //code: string,
    //label: string,
    source: DbReferenceObject,
}

// uk.ac.ebi.uniprot.domain.features
export interface DbReferenceObject {
    name: string,
    id: string,
    url: string,
    //alternativeUrl: string,
    //reviewed: any
}

// uk.ac.ebi.uniprot.domain.entry
export interface DbReference {
    id: string
    type: string
    properties: object
}

export interface EvidencedString {
    value: string;
    evidences: Evidence[];
}

