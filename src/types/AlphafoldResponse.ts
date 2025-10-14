export type AlphafoldResponse = Array<AlphafoldResponseElement>

export interface AlphafoldResponseElement {
    modelEntityId: string,
    gene: string,
    uniprotAccession: string,
    uniprotId: string,
    uniprotDescription: string,
    taxId: number,
    organismScientificName: string,
    sequenceStart: number,
    sequenceEnd: number,
    sequence: string,
    modelCreatedDate: string,
    latestVersion: number,
    allVersions: Array<number>,
    cifUrl: string,
    bcifUrl: string,
    pdbUrl: string,
    paeImageUrl: string,
    paeDocUrl: string
}