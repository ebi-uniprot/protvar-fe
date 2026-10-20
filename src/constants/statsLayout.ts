// Release page layout: which stats (by key) appear where. Labels, values and versions come from GET /stats;
// sub-figures (key.<sub>, e.g. .proteins) are shown under their key. Revisit the cards each release.

export interface StatsItem {
  key: string;
  shareOf?: string;   // also show the value as a % of this key
}

export interface StatsGroup {
  title: string;
  items: StatsItem[];
}

const k = (...keys: string[]): StatsItem[] => keys.map(key => ({key}));

export const STATS_CARDS: StatsItem[] = [
  {key: 'mapping.rows'},
  {key: 'variant.possible'},
  {key: 'protein.reviewed_mapped', shareOf: 'protein.reviewed'},
  {key: 'variant.known'},
  {key: 'missense.predictors'},
  {key: 'structure.foldx'},
];

export const STATS_SECTIONS: { title: string; groups: StatsGroup[] }[] = [
  {
    title: 'Built for this release',
    groups: [
      {title: 'Proteins & genes', items: [
        {key: 'protein.reviewed'},
        {key: 'protein.reviewed_mapped', shareOf: 'protein.reviewed'},
        ...k('protein.isoform_mapped', 'protein.unreviewed_mapped', 'gene.uniprot', 'gene.ensembl'),
      ]},
      {title: 'Transcripts', items: k('transcript.mapped', 'transcript.mane_select', 'refseq.nm', 'refseq.np')},
      {title: 'Genome coverage', items: [
        {key: 'coding.grch38_bases'},
        {key: 'coding.grch37_bases', shareOf: 'coding.grch38_bases'},
        {key: 'mapping.rows'},
      ]},
      {title: 'Variants in coding regions', items: k('variant.known', 'variant.dbsnp', 'variant.uniprot')},
      {title: 'Genomic scores', items: k('variant.possible')},
      {title: 'Annotations', items: k('annotation.function', 'annotation.features', 'structure.pdb', 'annotation.search_texts')},
    ],
  },
  {
    title: 'Integrated datasets',
    groups: [
      {title: 'Clinical & population', items: [
        {key: 'variant.clinvar', shareOf: 'clinvar.vcv'},
        {key: 'variant.cosmic', shareOf: 'cosmic.variants'},
        {key: 'variant.gnomad', shareOf: 'gnomad.variants'},
      ]},
      {title: 'Missense predictions', items: k('missense.alphamissense', 'missense.esm1b', 'missense.popeve', 'missense.eve', 'missense.conservation')},
      {title: 'Structure', items: k('structure.foldx', 'structure.missense3d', 'structure.pockets', 'structure.interfaces')},
    ],
  },
];
