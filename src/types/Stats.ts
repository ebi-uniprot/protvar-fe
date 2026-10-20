// One figure from GET /stats (BE ReleaseStat). Keys are <domain>.<what>[.<sub>]; a.b.<sub> is a sub-figure of a.b.
export interface ReleaseStat {
  key: string;
  label: string;
  description: string;
  value: number;
  source: string;
  version?: string;
  sourceTable?: string;
  recorded: string;
  inSync?: boolean;    // false: counted from a table the API does not serve
}
