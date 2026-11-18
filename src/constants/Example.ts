import { ID_GENE, ID_PDB, SEARCH, SEMANTIC_SEARCH } from "./BrowserPaths";

// Example cards on the search page (Annotate, Browse, Semantic). A card opens its result straight away.
// All checked against the 2026_02 data on int (2026-11-03/04).

export interface ExampleCard {
  name: string;      // what users know it as
  detail: string;    // gene + change, or what the filters select
  code: string;      // the query as typed (shown in mono)
  tag: string;       // input format / identifier type / query kind
  to: string;        // route the card opens
  note?: string;     // why it's interesting (tooltip)
}

const q = (input: string) => `${SEARCH}?q=${encodeURIComponent(input)}`;

// --- Annotate: well-known variants, one per input type (the format chips cover the rest)
// view: extra URL params to open the result at, e.g. a panel and a highlighted prediction (ann=fun&pred=foldx)
const variant = (name: string, detail: string, input: string, tag: string, note: string, view?: string): ExampleCard =>
  ({ name, detail, code: input, tag, to: q(input) + (view ? `&${view}` : ''), note });

export const ANNOTATE_CARDS: ExampleCard[] = [
  variant('Sickle cell anaemia associated variant', 'HBB Glu7Val', 'rs334', 'dbSNP',
    'The classic disease variant; Glu6Val in the older numbering without the initial Met'),
  variant('Melanoma driver variant', 'BRAF Val600Glu', 'COSV56056643', 'COSMIC',
    'The most common BRAF cancer mutation, target of BRAF inhibitors'),
  variant('Splice-altering synonymous variant', 'MLH1 Gly181= (synonymous)', 'NM_000249.4:c.543C>T', 'HGVS c.',
    'No amino-acid change, yet pathogenic for Lynch syndrome (ClinVar, expert panel): Pangolin predicts a strong splicing effect (0.84)',
    'ann=fun&pred=pangolin'),
  variant('Structure altering variant', 'TP53 Arg175His', 'VAR_005932', 'UniProt VAR',
    'The most frequent TP53 mutation in cancer; opens on its FoldX stability prediction',
    'ann=fun&pred=foldx'),
  variant('Warfarin sensitivity', 'F9 Ala37Val', 'VAR_083981', 'UniProt VAR',
    'Hypersensitivity to warfarin, commonly caused by a change to valine in European populations and threonine in South Asian populations',
    'ann=pop'),
  variant('EGFR pocket variant', 'EGFR Thr790Met', 'P00533 T790M', 'Protein',
    'The bulky methionine can interfere with ligand binding; opens on the AlphaFill model',
    'ann=str&structure=alphafill&zoom=true'),
];

// --- Browse: an identifier (or none) with preset filters; known variants only (browse default)
const browse = (name: string, detail: string, path: string, params: string, tag: string, note: string): ExampleCard =>
  ({ name, detail, code: path === SEARCH ? 'all genes' : path.split('/').pop()!, tag, to: `${path}?${params}`, note });

export const BROWSE_CARDS: ExampleCard[] = [
  browse('TP53, pathogenic calls', 'AlphaMissense pathogenic', `${ID_GENE}/TP53`, 'am=pathogenic', 'Gene',
    'Known TP53 variants that AlphaMissense predicts pathogenic'),
  browse('KRAS drug-binding pockets', 'Variants in predicted pockets', `${ID_GENE}/KRAS`, 'pocket=true', 'Gene',
    'Known KRAS variants in AlphaFold-predicted ligand-binding pockets'),
  browse('BRCA1 domains', 'In domains, most damaging (CADD) first', `${ID_GENE}/BRCA1`, 'domain=true&sort=cadd&order=desc', 'Gene',
    'Known BRCA1 variants in annotated domains, sorted by CADD'),
  browse('CFTR membrane segments', 'In transmembrane regions', `${ID_GENE}/CFTR`, 'transmem=true', 'Gene',
    'Known CFTR variants in its transmembrane helices'),
  browse('Haemoglobin structure', 'Likely destabilising (FoldX)', `${ID_PDB}/4HHB`, 'stability=destabilizing', 'PDB',
    'Known variants on PDB 4HHB that FoldX predicts destabilise the fold'),
  browse('EGFR binding sites', 'Binding sites, AVI top 1%', `${ID_GENE}/EGFR`, 'binding=true&aviMin=20', 'Gene',
    'Known EGFR variants at binding sites with an AlphaGenome Variant Impact score in the top 1% genome-wide'),
  browse('Rare, pathogenic, at interfaces', 'Interfaces · AM pathogenic · very rare', SEARCH,
    'interact=true&am=pathogenic&freq=very_rare', 'All genes',
    'Across all proteins: very rare known variants at predicted protein–protein interfaces that AlphaMissense calls pathogenic'),
];

// --- Semantic search: natural-language queries that rank well (checked by match distance)
const semantic = (name: string, text: string, tag: string): ExampleCard =>
  ({ name, detail: '', code: text, tag, to: `${SEMANTIC_SEARCH}?q=${encodeURIComponent(text)}` });

export const SEMANTIC_CARDS: ExampleCard[] = [
  semantic('Lynch syndrome', 'loss of DNA mismatch repair in Lynch syndrome', 'Disease'),
  semantic('Warfarin sensitivity', 'warfarin sensitivity', 'Drug response'),
  semantic('Thrombosis risk', 'increased risk of venous thrombosis', 'Risk'),
  semantic('Long QT syndrome', 'potassium channel mutations causing long QT syndrome', 'Phenotype'),
  semantic('Intellectual disability', 'intellectual disability', 'Phenotype'),
  semantic('Kinase activation', 'kinase activation loop phosphorylation', 'Mechanism'),
  semantic("Early-onset Alzheimer's", 'mutations causing early-onset Alzheimer disease', 'Disease'),
];


// Paste-box placeholder: sickle cell (HBB Glu7Val) written five ways
export const PASTE_BOX = `NP_000509.1:p.Glu7Val
11-5227002-T-A
rs334
NC_000011.10:g.5227002T>A
VAR_002863`;

// Annotate: one example set per input format; a format button fills the box with its set.
// Together they cover every supported input form (see the input-formats help).
export interface FormatExample {
  label: string;
  value: string;
  tip: string;
}

export const FORMAT_EXAMPLES: FormatExample[] = [
  { label: 'Genomic', tip: 'VCF, gnomAD, chromosome/position (space, colon, > or /), mitochondrial',
    value: '7\t140753336\trs113488022\tA\tT\n12-25245350-C-T\n17 7675088 C T\n7:55191822:T:G\nchr11:5227002 T>A\n'
      + '19 44908684 T/C\nMT 3460 G A' },
  { label: 'HGVS g.', tip: 'HGVS genomic, with an NC_ accession or a chromosome',
    value: 'NC_000007.14:g.140753336A>T\nchr11:g.5227002T>A' },
  { label: 'HGVS c.', tip: 'HGVS coding, optionally with the gene or the protein change',
    value: 'NM_000518.5:c.20A>T\nNM_004333.6(BRAF):c.1799T>A\nNM_000546.6:c.524G>A p.(Arg175His)\nNM_000249.4:c.543C>T' },
  { label: 'HGVS p.', tip: 'HGVS protein', value: 'NP_000509.1:p.Glu7Val\nNP_000537.3:p.Arg213Ter' },
  { label: 'Protein', tip: 'UniProt accession + change: 1- or 3-letter, any case, stop (*) and silent (=)',
    value: 'P15056 V600E\nP01116 p.G12D\nP02649 Cys130Arg\np00533 leu858arg\nP38398 61 C/G\nQ30201 282 Cys Tyr\n'
      + 'P04637 R213*\nP40692 G181=' },
  { label: 'Variant IDs', tip: 'dbSNP, ClinVar (VCV with a version, RCV), COSMIC (COSV, COSM, COSN), UniProt (VAR_)',
    value: 'rs334\nVCV000000642.133\nRCV000007540\nCOSV56056643\nCOSM521\nCOSN190667\nVAR_004109' },
  { label: 'Position only', tip: 'Without the alternative (or both alleles / amino acids): every possible change at the position',
    value: '17 7675088\n7 140753336 A\n11:5227002:na:na\nP01116 12\nP15056 600 Val\nP04637 M1?' },
  { label: 'GRCh37', tip: 'GRCh37 positions: detected and converted to GRCh38',
    value: '7 140453136 A T\n11 5248232 T A\n12 25398284 C T\n17 7578406 C T' },
];

// Browse: one example identifier per type; a button adds it to the box as a token
export const ID_EXAMPLES: FormatExample[] = [
  { label: 'UniProt', value: 'P04637', tip: 'UniProt accession: P04637 (TP53)' },
  { label: 'Gene', value: 'BRCA1', tip: 'Gene symbol: BRCA1' },
  { label: 'Ensembl', value: 'ENSG00000141510', tip: 'Ensembl gene, transcript, protein or exon: ENSG00000141510 (TP53)' },
  { label: 'RefSeq', value: 'NM_000492.4', tip: 'RefSeq transcript or protein: NM_000492.4 (CFTR)' },
  { label: 'PDB', value: '4HHB', tip: 'PDB structure: 4HHB (haemoglobin)' },
];
