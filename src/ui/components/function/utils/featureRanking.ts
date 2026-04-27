/**
 * UniProt Feature (FT) ranking by susceptibility to disease when mutated.
 *
 * Based on ProtVar curation guidelines. Higher rank = more clinically relevant.
 * Priority tiers:
 *   high   — strong functional implication; frequently pathogenic
 *   middle — moderate functional implication; context-dependent
 *   low    — structural/compositional; less likely to be directly pathogenic
 */

import { Feature } from '../../../../types/FunctionalInfo';

export type FeaturePriority = 'high' | 'middle' | 'low';

export interface FeatureRankInfo {
  rank: number;
  priority: FeaturePriority;
  label: string;
  description: string;
}

/**
 * Ranked list of UniProt FT feature types.
 * Keys are the type strings returned by the UniProt API.
 */
export const FEATURE_RANKING: Record<string, FeatureRankInfo> = {
  VARIANT: {
    rank: 1,
    priority: 'high',
    label: 'Variant',
    description: 'Naturally occurring variants; includes disease/OMIM associations, dbSNP and PMID references.',
  },
  MUTAGEN: {
    rank: 2,
    priority: 'high',
    label: 'Mutagenesis',
    description: 'Experimentally induced mutations and their characterised effects on protein function.',
  },
  ACT_SITE: {
    rank: 3,
    priority: 'high',
    label: 'Active site',
    description: 'Amino acid(s) directly involved in the catalytic mechanism.',
  },
  BINDING: {
    rank: 4,
    priority: 'high',
    label: 'Binding site',
    description: 'Residue(s) that interact with a ligand or small molecule.',
  },
  MOD_RES: {
    rank: 5,
    priority: 'high',
    label: 'Modified residue',
    description: 'Post-translational modification sites (strictly controlled vocabulary).',
  },
  LIPID: {
    rank: 6,
    priority: 'high',
    label: 'Lipidation',
    description: 'Covalent attachment of a lipid group; affects trafficking, localisation and signalling.',
  },
  CARBOHYD: {
    rank: 7,
    priority: 'high',
    label: 'Glycosylation',
    description: 'N- or O-linked glycosylation sites; disruption linked to human disease.',
  },
  ZN_FING: {
    rank: 8,
    priority: 'middle',
    label: 'Zinc finger',
    description: 'Zinc-coordinating structural motif; variants can impair folding and function.',
  },
  SITE: {
    rank: 9,
    priority: 'middle',
    label: 'Site',
    description: 'Interesting single-residue site, e.g. cleavage or reactive bond positions.',
  },
  DOMAIN: {
    rank: 10,
    priority: 'middle',
    label: 'Domain',
    description: 'Defined structural/functional domain; variant impact depends on position within domain.',
  },
  REPEAT: {
    rank: 11,
    priority: 'middle',
    label: 'Repeat',
    description: 'Internal sequence repeat; similar functional implications to domains.',
  },
  DNA_BIND: {
    rank: 12,
    priority: 'middle',
    label: 'DNA binding',
    description: 'Region that mediates DNA interaction; pathogenicity depends on protein and mutation.',
  },
  DISULFID: {
    rank: 13,
    priority: 'middle',
    label: 'Disulfide bond',
    description: 'Conserved covalent bond; disruption affects protein stability.',
  },
  COILED: {
    rank: 14,
    priority: 'middle',
    label: 'Coiled coil',
    description: 'Region involved in protein assembly and oligomerisation.',
  },
  MOTIF: {
    rank: 15,
    priority: 'middle',
    label: 'Motif',
    description: 'Short functional sequence motif described in the literature.',
  },
  REGION: {
    rank: 16,
    priority: 'middle',
    label: 'Region',
    description: 'Region of interest; pathogenicity depends on the functional role of the region.',
  },
  TRANSMEM: {
    rank: 17,
    priority: 'low',
    label: 'Transmembrane',
    description: 'Membrane-spanning segment.',
  },
  HELIX: {
    rank: 18,
    priority: 'low',
    label: 'Helix',
    description: 'Alpha-helical secondary structure.',
  },
  TURN: {
    rank: 19,
    priority: 'low',
    label: 'Turn',
    description: 'Turn secondary structure element.',
  },
  STRAND: {
    rank: 20,
    priority: 'low',
    label: 'Beta strand',
    description: 'Beta-strand secondary structure.',
  },
  COMPBIAS: {
    rank: 21,
    priority: 'low',
    label: 'Compositional bias',
    description: 'Region with compositionally biased amino acid composition.',
  },
  TOPO_DOM: {
    rank: 22,
    priority: 'low',
    label: 'Topological domain',
    description: 'Location of the non-membrane region of a membrane-spanning protein.',
  },
  INTRAMEM: {
    rank: 23,
    priority: 'low',
    label: 'Intramembrane',
    description: 'Region that lies within but does not span a membrane.',
  },
  NON_STD: {
    rank: 24,
    priority: 'low',
    label: 'Non-standard residue',
    description: 'Occurrence of a non-standard amino acid, e.g. selenocysteine.',
  },
  CROSSLNK: {
    rank: 25,
    priority: 'low',
    label: 'Cross-link',
    description: 'Residues participating in an inter- or intra-chain covalent bond.',
  },
  VAR_SEQ: {
    rank: 26,
    priority: 'low',
    label: 'Alternative sequence',
    description: 'Sequence variants arising from alternative splicing or initiation.',
  },
};

const DEFAULT_RANK = 99;

export function getFeatureRankInfo(type: string): FeatureRankInfo | undefined {
  return FEATURE_RANKING[type];
}

export function getFeatureRank(type: string): number {
  return FEATURE_RANKING[type]?.rank ?? DEFAULT_RANK;
}

export function getFeatureLabel(type: string): string {
  return FEATURE_RANKING[type]?.label ?? type.replace(/_/g, ' ').toLowerCase();
}

export function getFeaturePriority(type: string): FeaturePriority {
  return FEATURE_RANKING[type]?.priority ?? 'low';
}

/** Sort features in-place by rank (highest priority first). */
export function sortFeaturesByRank(features: Feature[]): Feature[] {
  return [...features].sort((a, b) => getFeatureRank(a.type) - getFeatureRank(b.type));
}

/**
 * Group features by type, preserving rank order of groups.
 * Returns a Map so insertion order (= rank order) is maintained.
 */
export function groupFeaturesByType(features: Feature[]): Map<string, Feature[]> {
  const sorted = sortFeaturesByRank(features);
  const grouped = new Map<string, Feature[]>();
  sorted.forEach(feature => {
    if (!grouped.has(feature.type)) grouped.set(feature.type, []);
    grouped.get(feature.type)!.push(feature);
  });
  return grouped;
}
