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
const variant = (name: string, detail: string, input: string, tag: string, note: string): ExampleCard =>
  ({ name, detail, code: input, tag, to: q(input), note });

export const ANNOTATE_CARDS: ExampleCard[] = [
  variant('Sickle cell', 'HBB Glu7Val', 'rs334', 'dbSNP',
    'The classic disease variant; Glu6Val in the older numbering without the initial Met'),
  variant('Melanoma driver', 'BRAF Val600Glu', 'COSV56056643', 'COSMIC',
    'The most common BRAF cancer mutation, target of BRAF inhibitors'),
  variant('Hidden splice defect', 'MLH1 Gly181= (synonymous)', 'NM_000249.4:c.543C>T', 'HGVS c.',
    'No amino-acid change, yet pathogenic for Lynch syndrome (ClinVar, expert panel): Pangolin predicts a strong splicing effect (0.84)'),
  variant('Tumour suppressor hotspot', 'TP53 Arg175His', 'VAR_005932', 'UniProt VAR',
    'The most frequent TP53 mutation in cancer'),
  variant('Pancreatic cancer driver', 'KRAS Gly12Asp', '12-25245350-C-T', 'gnomAD',
    'A KRAS hotspot in pancreatic, colorectal and lung cancer'),
  variant('Factor V Leiden', 'F5 Arg534Gln', 'VCV000000642', 'ClinVar',
    'Common inherited clotting risk; AlphaMissense calls it benign, a reminder that predictors miss gain-of-function effects'),
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

// How many cards show before "more"
export const CARDS_SHOWN = 4;

// Paste-box placeholder: sickle cell (HBB Glu7Val) written five ways
export const PASTE_BOX = `NP_000509.1:p.Glu7Val
11-5227002-T-A
rs334
NC_000011.10:g.5227002T>A
VAR_002863`;
