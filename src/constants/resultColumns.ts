// Result table columns, in display order. The grid, header hints and row cells are all built from this list.
// `id` is persisted in user prefs (phase 2), so never rename or reuse one.

export type ColumnGroup = 'genomic' | 'protein' | 'annotations';

export type ColumnId =
  | 'id' | 'position' | 'gene' | 'codon' | 'cadd'
  | 'isoform' | 'protein' | 'aaChange' | 'consequence' | 'popeve' | 'am'
  | 'details';

export interface ResultColumn {
  id: ColumnId;
  label: string;         // header hint + chooser label
  group: ColumnGroup;
  defaultOn: boolean;
  locked?: boolean;      // always visible: the core genomic → protein mapping
}

export const RESULT_COLUMNS: ResultColumn[] = [
  { id: 'id',          label: 'ID',            group: 'genomic',     defaultOn: true },
  { id: 'position',    label: 'position',      group: 'genomic',     defaultOn: true, locked: true },
  { id: 'gene',        label: 'gene',          group: 'genomic',     defaultOn: true, locked: true },
  { id: 'codon',       label: 'mRNA codon',    group: 'genomic',     defaultOn: true, locked: true },
  { id: 'cadd',        label: 'CADD',          group: 'genomic',     defaultOn: true },
  { id: 'isoform',     label: 'isoform',       group: 'protein',     defaultOn: true, locked: true },
  { id: 'protein',     label: 'name',          group: 'protein',     defaultOn: true },
  { id: 'aaChange',    label: 'AA change',     group: 'protein',     defaultOn: true, locked: true },
  { id: 'consequence', label: 'consequence',   group: 'protein',     defaultOn: true, locked: true },
  { id: 'popeve',      label: 'popEVE',        group: 'protein',     defaultOn: true },
  { id: 'am',          label: 'AlphaMissense', group: 'protein',     defaultOn: true },
  { id: 'details',     label: 'annotations',   group: 'annotations', defaultOn: true, locked: true },
];

export const DEFAULT_COLUMN_IDS: ColumnId[] = RESULT_COLUMNS.filter(c => c.defaultOn).map(c => c.id);

// Visible columns in display order; locked ones are always included.
export const visibleColumns = (ids: ColumnId[] = DEFAULT_COLUMN_IDS): ResultColumn[] =>
  RESULT_COLUMNS.filter(c => c.locked || ids.includes(c.id));

export const inGroup = (cols: ResultColumn[], group: ColumnGroup) => cols.filter(c => c.group === group);

