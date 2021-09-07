export interface Evidence {
    code: string,
    source: EvidenceSource,
    label: string
}

interface EvidenceSource {
    name: string,
    id: string,
    url: string,
    alternativeUrl: string
}