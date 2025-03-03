// src/types/Stats.ts
export interface Stats {
  createdAt: string;
  datasetType: string;
  importType: string;
  keyName: string;
  note?: string;
  value: number;
}