// Result table columns, in display order. The grid, header labels and row cells are all built from this list.
// `id` is persisted in user prefs (phase 2), so never rename or reuse one.

export type ColumnGroup = 'genomic' | 'protein' | 'annotations';

export type ColumnId =
  | 'id' | 'position' | 'gene' | 'codon' | 'cadd' | 'avi' | 'pangolin'
  | 'isoform' | 'protein' | 'aaChange' | 'consequence' | 'popeve' | 'am'
  | 'details';

export interface ResultColumn {
  id: ColumnId;
  label: string;         // chooser label
  note?: string;         // chooser: muted text after the label
  header: string;        // table column header
  tip: string;           // column header tooltip
  group: ColumnGroup;
  defaultOn: boolean;
  locked?: boolean;      // always visible: the genomic → protein bridge (position, gene, isoform, AA change)
}

export const RESULT_COLUMNS: ResultColumn[] = [
  { id: 'id',          label: 'ID',            note: 'when available', header: 'ID',            tip: 'Variant ID',                                group: 'genomic',     defaultOn: true },
  { id: 'position',    label: 'position',      header: 'Position',      tip: 'Chromosome, position, reference and alternative base', group: 'genomic', defaultOn: true, locked: true },
  { id: 'gene',        label: 'gene',          header: 'Gene',          tip: 'Gene symbol',                               group: 'genomic',     defaultOn: true, locked: true },
  { id: 'codon',       label: 'mRNA codon',    header: 'Codon',         tip: 'mRNA codon change and strand',              group: 'genomic',     defaultOn: true },
  { id: 'cadd',        label: 'CADD',          header: 'CADD',          tip: 'CADD score',                                group: 'genomic',     defaultOn: true },
  { id: 'avi',         label: 'AVI',           header: 'AVI',           tip: 'AlphaGenome Variant Impact score',          group: 'genomic',     defaultOn: false },
  { id: 'pangolin',    label: 'Pangolin',      header: 'Pangolin',      tip: 'Pangolin splice prediction',                group: 'genomic',     defaultOn: false },
  { id: 'isoform',     label: 'isoform',       header: 'Isoform',       tip: 'UniProt isoform',                           group: 'protein',     defaultOn: true, locked: true },
  { id: 'protein',     label: 'name',          header: 'Protein',       tip: 'Protein name',                              group: 'protein',     defaultOn: true },
  { id: 'aaChange',    label: 'AA change',     header: 'AA change',     tip: 'Amino acid change',                         group: 'protein',     defaultOn: true, locked: true },
  { id: 'consequence', label: 'consequence',   header: 'Effect',        tip: 'Consequence on the protein',                group: 'protein',     defaultOn: true },
  { id: 'popeve',      label: 'popEVE',        header: 'popEVE',        tip: 'popEVE score',                              group: 'protein',     defaultOn: true },
  { id: 'am',          label: 'AlphaMissense', header: 'AM',            tip: 'AlphaMissense score',                       group: 'protein',     defaultOn: true },
  { id: 'details',     label: 'annotations',   header: 'Annotations',   tip: 'Functional, population and structural annotations: click an icon to expand', group: 'annotations', defaultOn: true, locked: true },
];

export const DEFAULT_COLUMN_IDS: ColumnId[] = RESULT_COLUMNS.filter(c => c.defaultOn).map(c => c.id);

// Visible columns in display order; locked ones are always included.
export const visibleColumns = (ids: ColumnId[] = DEFAULT_COLUMN_IDS): ResultColumn[] =>
  RESULT_COLUMNS.filter(c => c.locked || ids.includes(c.id));

export const inGroup = (cols: ResultColumn[], group: ColumnGroup) => cols.filter(c => c.group === group);

// Views = named column presets. The current view is derived from the visible ids (no match = custom).
export type ResultViewId = 'genomic' | 'both' | 'protein';
export const RESULT_VIEWS: { id: ResultViewId; label: string; tip: string; columns: ColumnId[] }[] = [
  { id: 'genomic', label: 'Genomic',
    tip: 'Genomic focus: variant ID, position, gene, codon and CADD, plus the isoform and amino acid change it maps to',
    columns: ['id', 'position', 'gene', 'codon', 'cadd', 'isoform', 'aaChange', 'details'] },
  { id: 'both',    label: 'Genomic + protein',
    tip: 'The full genomic-to-protein mapping (default)',
    columns: DEFAULT_COLUMN_IDS },
  { id: 'protein', label: 'Protein',
    tip: 'Protein focus: isoform, protein name, amino acid change, consequence and scores, plus the genomic position it maps from',
    columns: ['position', 'gene', 'isoform', 'protein', 'aaChange', 'consequence', 'popeve', 'am', 'details'] },
];

export const viewOf = (ids: ColumnId[]): ResultViewId | undefined => {
  const shown = new Set(visibleColumns(ids).map(c => c.id));
  return RESULT_VIEWS.find(v => {
    const cols = visibleColumns(v.columns);
    return cols.length === shown.size && cols.every(c => shown.has(c.id));
  })?.id;
};

// Saved in user prefs. `known` = ids that existed when the user last saved, so a column added later follows its
// defaultOn instead of looking "deselected". Unknown (removed/renamed) ids are ignored.
export interface ResultColumnsPref {
  version: 1;
  visible: ColumnId[];
  known: ColumnId[];
}

export const columnIdsFromPref = (pref?: ResultColumnsPref): ColumnId[] => {
  if (!pref) return DEFAULT_COLUMN_IDS;
  return RESULT_COLUMNS
    .filter(c => pref.known.includes(c.id) ? pref.visible.includes(c.id) : c.defaultOn)
    .map(c => c.id);
};

export const columnIdsToPref = (ids: ColumnId[]): ResultColumnsPref => ({
  version: 1,
  visible: ids,
  known: RESULT_COLUMNS.map(c => c.id),
});
