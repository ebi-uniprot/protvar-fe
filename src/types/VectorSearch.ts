export interface ModelInfo {
  id: string;
  label: string;
  description: string;
  defaultModel: boolean;
}

export interface VectorSearchResult {
  accession: string;
  sourceType: string;
  sourceText: string;
  distance: number;
}

export interface VectorSearchResponse {
  query: string;
  results: VectorSearchResult[];
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
