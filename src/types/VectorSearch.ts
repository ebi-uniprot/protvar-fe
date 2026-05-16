export interface ModelInfo {
  id: string;
  label: string;
  description: string;
  defaultModel: boolean;
}

// Function-corpus hit.
export interface VectorSearchResult {
  accession: string;
  sourceType: string;
  sourceText: string;
  distance: number;
  beginPos: number | null;
  endPos: number | null;
}

// Population-corpus hit — one per variant; sourceText is the composite snippet.
export interface PopulationVectorSearchResult {
  accession: string;
  position: number | null;
  sourceText: string;
  distance: number;
}

// Side-by-side response — two corpora, no merged ranking (scores not comparable).
export interface VectorSearchResponse {
  query: string;
  functionResults: VectorSearchResult[];
  populationResults: PopulationVectorSearchResult[];
  limit: number;
  offset: number;
  model: string;
  success: boolean;
  error: string | null;
}

export interface GroupedResult {
  accession: string;
  proteinName: string | null;
  score: number;           // (1 - min distance) * 100, rounded to 1dp
  bestText: string;
  sourceTypes: string[];
  matches: VectorSearchResult[];
}

export interface GroupedPopulationResult {
  accession: string;
  score: number;           // (1 - min distance) * 100, rounded to 1dp
  matches: PopulationVectorSearchResult[];
}
