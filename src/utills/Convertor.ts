import {
  GenomeProteinMapping,
  INPUT_GEN,
  INPUT_PRO,
  INPUT_ID,
  INPUT_CDNA,
  UserInput,
  GenomicInput,
  InputType, Message, ERROR
} from "../types/MappingResponse";

export interface MappingRecord {
  idx: number
  input: string
  type: string
  // GENOMIC column properties
  chromosome: string
  position: number
  id: string
  refAllele: string
  altAllele: string
  geneName?: string
  codon?: string
  strand?: boolean
  CADD?: string
  // PROTEIN column properties
  canonical?: boolean   // display as can (true) or iso (false)
  isoform?: string
  canonicalAccession: string | null
  proteinName?: string
  aaPos?: number
  aaChange?: string // display as refAA/variantAA
  refAA?: string
  variantAA?: string
  cdsPosition?: number // not displayed or used anywhere
  consequences?: string
  eveScore?: string
  eveClass?: number
  // ANNOTATIONS column
  referenceFunctionUri?: string
  populationObservationsUri?: string
  proteinStructureUri?: string
  // OTHER properties
  ensp?: Array<TranslatedSequence>  // passed to FunctionalDetail component
  ensg?: string                     // passed to FunctionalDetail component
  msg?: Message
}

export interface TranslatedSequence {
  ensp: string
  ensts: string
}

function getBasicMapping(input: GenomicInput, mapping: GenomeProteinMapping) {
  return {idx: 0,
    chromosome: input.chr,
    position: input.pos,
    id: input.id,
    refAllele: input.ref,
    altAllele: input.alt,
    canonicalAccession: null,
    input: input.inputStr,
    type: input.type
  };
}
function getEmptyMapping(input: GenomicInput, mapping: GenomeProteinMapping) {
  const ret = getBasicMapping(input, mapping);
  ret.chromosome = "";
  ret.id = "";
  ret.refAllele = "";
  return ret;
}
function emptyRow(input: UserInput) {
  return {
    idx: 0,
    chromosome: "",
    position: 0,
    id: "",
    refAllele: "",
    altAllele: "",
    canonicalAccession: null,
    input: input.inputStr,
    type: input.type
  }
}

function msgRow(input: UserInput, inputIdx:number, m: Message) {
  var genes: Array<Array<MappingRecord>> = [];
  var rows: Array<MappingRecord> = [];
  const empty: MappingRecord = emptyRow(input);
  empty.msg = m;
  empty.idx = inputIdx
  rows.push(empty);
  genes.push(rows);
  return genes
}

/*
TableRow
-PrimaryRow - contains all fields
-IsoformRow     - contains isoform fields
-MsgRow     - contains any message

 */


export function convertApiMappingToTableRecords(inputs: Array<InputType>) {
  var records: Array<Array<Array<MappingRecord>>> = [];
  inputs.forEach((input, index) => {

    input.messages.forEach(m => {
      records.push(msgRow(input, index, m))
    });

    if (input.type === INPUT_GEN && "mappings" in input) {
      records.push(convertGenInputMappings(input, input, index))
    }
    else if ((input.type === INPUT_PRO || input.type === INPUT_CDNA || input.type === INPUT_ID) && "derivedGenomicInputs" in input) {
      input.derivedGenomicInputs.forEach((gInput: GenomicInput) => {
        records.push(convertGenInputMappings(input, gInput, index))
      })
    }
  });
  return records;
}

const NO_MAPPING: Message = {type: 'ERROR', text: 'No mapping found' }

function convertGenInputMappings(originalInput: UserInput, gInput: GenomicInput, idx: number) {
  if (gInput.mappings.length === 0 || (gInput.mappings.length === 1 && gInput.mappings[0].genes.length === 0)) {
    if (!(originalInput.messages.length > 0 || gInput.messages.length > 0)) {
      return msgRow(gInput, idx, NO_MAPPING)
    }
  }
  var genes: Array<Array<MappingRecord>> = [];

  gInput.mappings.forEach(mapping => {
    mapping.genes.forEach((gene) => {
      var rows: Array<MappingRecord> = [];
      let ensg = gene.ensg;
      gene.isoforms.forEach((isoform) => {
        var record: MappingRecord = getEmptyMapping(gInput, mapping)
        record.idx = idx;
        record.type = originalInput.type
        // GENOMIC
        if (isoform.canonical || isoform.canonicalAccession === null) {
          record.chromosome = gInput.chr;
          record.id = gInput.id;
          record.refAllele = gene.refAllele;
          record.geneName = gene.geneName;
          record.codon = isoform.refCodon + '/' + isoform.variantCodon;
          record.strand = gene.reverseStrand;
          if (gene.caddScore === null) record.CADD = '-';
          else record.CADD = gene.caddScore.toString();
        }
        // PROTEIN
        record.canonical = isoform.canonical;
        record.isoform = isoform.accession;
        record.canonicalAccession = isoform.canonicalAccession;
        record.proteinName = isoform.proteinName;
        record.aaPos = isoform.isoformPosition;
        record.aaChange = isoform.refAA + '/' + isoform.variantAA;
        record.refAA = isoform.refAA;
        record.variantAA = isoform.variantAA;
        record.cdsPosition = isoform.cdsPosition;
        record.consequences = isoform.consequences;
        if (isoform.eveScore !== undefined && isoform.eveScore !== null) {
          record.eveScore = isoform.eveScore.toString();
          record.eveClass = isoform.eveClass;
        } else {
          record.eveScore = '-';
        }
        // ANNOTATIONS
        record.referenceFunctionUri = isoform.referenceFunctionUri;
        record.populationObservationsUri = isoform.populationObservationsUri;
        record.proteinStructureUri = isoform.proteinStructureUri;
        // OTHER
        record.ensp = [];
        if (isoform.translatedSequences !== undefined && isoform.translatedSequences.length > 0) {
          var ensps: Array<TranslatedSequence> = [];
          isoform.translatedSequences.forEach((translatedSeq) => {
            var ensts: Array<string> = [];
            translatedSeq.transcripts.forEach((transcript) => ensts.push(transcript.enst));
            ensps.push({ensp: translatedSeq.ensp, ensts: ensts.join()});
          });
          record.ensp = ensps;
        }
        record.ensg = ensg;
        rows.push(record);
      });
      genes.push(rows);
    });
  });
  return genes;
}