import { GenomeProteinMapping } from "../types/MappingResponse";

export interface MappingRecord {
  chromosome: string
  id: string
  refAllele: string
  geneName?: string
  codon?: string
  CADD?: string
  position: number
  altAllele: string
  proteinName?: string
  isoform?: string
  aaPos?: number
  aaChange?: string
  refAA?: string
  variantAA?: string
  consequences?: string
  cdsPosition?: number
  canonical?: boolean
  canonicalAccession: string | null
  referenceFunctionUri?: string
  populationObservationsUri?: string
  proteinStructureUri?: string
  ensp?: Array<TranslatedSequence>
  strand?: boolean
  ensg?: string
  note?: string
}

export interface TranslatedSequence {
  ensp: string
  ensts: string
}

function getBasicMapping(mapping: GenomeProteinMapping) {
  return {
    chromosome: mapping.chromosome,
    position: mapping.geneCoordinateStart,
    id: mapping.id,
    refAllele: mapping.userAllele,
    altAllele: mapping.variantAllele,
    canonicalAccession: null,
  };
}
function getEmptyMapping(mapping: GenomeProteinMapping) {
  const ret = getBasicMapping(mapping);
  ret.chromosome = "";
  ret.id = "";
  ret.refAllele = "";
  return ret;
}
export function convertApiMappingToTableRecords(mapping: GenomeProteinMapping) {
  var genes: Array<Array<MappingRecord>> = [];
  var variant = mapping.variantAllele;

  mapping.genes.forEach((gene) => {
    var rows: Array<MappingRecord> = [];
    let ensg = gene.ensg;
    gene.isoforms.forEach((isoform) => {
      var record: MappingRecord = getEmptyMapping(mapping);
      if (isoform.canonical || isoform.canonicalAccession === null) {
        record.chromosome = mapping.chromosome;
        record.id = mapping.id;
        record.refAllele = gene.refAllele;
        record.geneName = gene.geneName;
        record.codon = isoform.refCodon + '/' + isoform.variantCodon;
        if (gene.caddScore === null) record.CADD = '-';
        else record.CADD = gene.caddScore.toString();
      }
      record.altAllele = variant;
      record.proteinName = isoform.proteinName;
      record.isoform = isoform.accession;
      record.aaPos = isoform.isoformPosition;
      record.aaChange = isoform.refAA + '/' + isoform.variantAA;
      record.refAA = isoform.refAA;
      record.variantAA = isoform.variantAA;
      record.consequences = isoform.consequences;
      record.cdsPosition = isoform.cdsPosition;
      record.canonical = isoform.canonical;
      record.canonicalAccession = isoform.canonicalAccession;
      record.referenceFunctionUri = isoform.referenceFunctionUri;
      record.populationObservationsUri = isoform.populationObservationsUri;
      record.proteinStructureUri = isoform.proteinStructureUri;
      record.ensp = [];
      record.strand = gene.reverseStrand;
      if (isoform.translatedSequences !== undefined && isoform.translatedSequences.length > 0) {
        var ensps: Array<TranslatedSequence> = [];
        isoform.translatedSequences.forEach((translatedSeq) => {
          var ensts: Array<string> = [];
          translatedSeq.transcripts.forEach((transcript) => ensts.push(transcript.enst));
          ensps.push({ ensp: translatedSeq.ensp, ensts: ensts.join() });
        });
        record.ensp = ensps;
      }
      record.ensg = ensg;
      rows.push(record);
    });
    genes.push(rows);
  });

  if (genes.length === 0) {
    var rows: Array<MappingRecord> = [];
    const record: MappingRecord = getBasicMapping(mapping);
    record.note = "Sorry, no mapping found"
    rows.push(record);
    genes.push(rows);
  }

  return genes;
}