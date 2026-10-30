// A ready-made dataset (GET /datasets): an upload anyone can open at /dataset/<name> and filter like their own
export interface Dataset {
  name: string;
  title: string;
  description: string;
  sourceVersion?: string;
  lineCount: number;
  resultId: string;
}
