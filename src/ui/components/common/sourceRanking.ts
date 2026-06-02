/**
 * Evidence/cross-reference source ranking — highest clinical authority first.
 * Sources not in this list sort to the end.
 */
export const SOURCE_RANK: Record<string, number> = {
  uniprot:            1,
  clinvar:            2,
  civic:              3,
  clingen:            4,
  cosmic:             5,
  exac:               6,
  dbsnp:              7,
  gnomad:             8,
  pubmed:             9,
};

/**
 * Returns the rank for a source name using case-insensitive substring matching.
 * Picks the most specific (longest) key that the name contains, s
 * o
 * "COSMIC Curated" correctly matches "cosmic curated" over "cosmic".
 */
export function getSourceRank(name: string): number {
  const lower = name.toLowerCase();
  let bestRank = 99;
  let bestKeyLen = 0;
  for (const [key, rank] of Object.entries(SOURCE_RANK)) {
    if (lower.includes(key) && key.length > bestKeyLen) {
      bestRank = rank;
      bestKeyLen = key.length;
    }
  }
  return bestRank;
}
