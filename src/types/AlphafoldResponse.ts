export type AlphafoldResponse = Array<AlphafoldResponseElement>

export interface AlphafoldResponseElement {
    entryId: string,
    gene: string,
    uniprotAccession: string,
    uniprotId: string,
    uniprotDescription: string,
    taxId: number,
    organismScientificName: string,
    uniprotStart: number,
    uniprotEnd: number,
    uniprotSequence: string,
    modelCreatedDate: string,
    latestVersion: number,
    allVersions: Array<number>,
    cifUrl: string,
    bcifUrl: string,
    pdbUrl: string,
    paeImageUrl: string,
    paeDocUrl: string
}