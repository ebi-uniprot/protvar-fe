import { useState } from "react"
import InvalidTableRows from "./InvalidTableRows";
import { StringVoidFun } from "../../../constants/CommonTypes";
import { MappingRecord } from "../../../utills/Convertor";
import { ParsedInput } from "../../../types/MappingResponse";
import AlternateIsoFormRow from "./AlternateIsoFormRow";
import { GENOMIC_COLS, INPUT_COLS, PROTEIN_COLS } from "../../../constants/SearchResultTable";
import Tool from "../../elements/Tool";
import getPrimaryRow from "./PrimaryRow";

interface ResultTableProps {
  invalidInputs: Array<ParsedInput>
  mappings: Array<Array<Array<MappingRecord>>>
}

export function getProteinName(record: MappingRecord) {
  let proteinName = record.proteinName;
  if (record.proteinName && record.proteinName.length > 20) {
    proteinName = record.proteinName.substring(0, 20) + '..';
  }
  return proteinName
}

function ResultTable(props: ResultTableProps) {
  const [isoFormGroupExpanded, setIsoFormGroupExpanded] = useState('')
  const [annotationExpanded, setAnnotationExpanded] = useState('')

  function toggleIsoFormGroup(key: string) {
    setIsoFormGroupExpanded(isoFormGroupExpanded === key ? '' : key);
  }

  function toggleAnnotation(key: string) {
    setAnnotationExpanded(annotationExpanded === key ? '' : key);
  }

  const tableRows = getTableRows(props.mappings, isoFormGroupExpanded, toggleIsoFormGroup, annotationExpanded, toggleAnnotation);
  return <table className="unstriped" cellPadding="0" cellSpacing="0">
    <thead>
      <tr>
        <Tool el="th" colSpan={INPUT_COLS} tip="User input is interpreted and displayed based on the reference genome" pos="up-left">INPUT</Tool>
        <Tool el="th" colSpan={GENOMIC_COLS} tip="Gene and nucleotide level annotations">GENOMIC</Tool>
        <Tool el="th" colSpan={PROTEIN_COLS} tip="Amino acid/protein level annotations">PROTEIN</Tool>
        <Tool el="th" tip="Three types of annotation describing the position and function of the reference amino acid, 
        region and protein and known associations" pos="up-right">ANNOTATIONS</Tool>
      </tr>
      <tr>
        {/* <th className="sticky"><Tool tip="Chromosome" pos="up-left">Chr</Tool></th> */}
        <Tool el="th" className="sticky" tip="Chromosome" pos="up-left">Chr</Tool>
        <Tool el="th" className="sticky" tip="Genomic coordinate">Coordinate</Tool>
        <Tool el="th" className="sticky" tip="User entered variant identifier">ID</Tool>
        <Tool el="th" className="sticky" tip="Reference allele">Ref</Tool>
        <Tool el="th" className="sticky" tip="Alternative allele">Alt</Tool>
        <Tool el="th" className="sticky" tip="HGNC short gene name">Gene</Tool>
        <Tool el="th" className="sticky" tip="Change of the codon containing the variant nucleotide the position of which is capitalised">Codon (strand)</Tool>
        <Tool el="th" className="sticky" tip="CADD (Combined Annotation Dependent Depletion) phred-like score. Colours are defined in the key at the bottom of the page">CADD</Tool>
        <Tool el="th" className="sticky" tip="The protein isoform the variant is mapped to. 
        By default this is the UniProt canonical isoform, however other isoforms are shown if necessary. 
        Alternative isoforms can be shown by expanding the arrow to the right of the isoform" tSize="xlarge">Isoform</Tool>
        <Tool el="th" className="sticky" tip="Full protein name from UniProt">Protein name</Tool>
        <Tool el="th" className="sticky" tip="Position of the amino acid containing the variant in the displayed isoform">AA pos.</Tool>
        <Tool el="th" className="sticky" tip="Three letter amino acid code for the reference and alternative alleles">AA change</Tool>
        <Tool el="th" className="sticky" tip="A description of the consequence of the variant">Consequences</Tool>
        <th className="sticky">Click for details</th>
      </tr>
    </thead>
    <tbody>
      {tableRows}
      <InvalidTableRows invalidInputs={props.invalidInputs} />
    </tbody>
  </table>
}

const getTableRows = (mappings: MappingRecord[][][], isoFormGroupExpanded: string, toggleIsoFormGroup: StringVoidFun,
  annotationExpanded: string, toggleAnnotation: StringVoidFun) => {
  const tableRows: Array<JSX.Element> = [];
  mappings.forEach((mapping, inputRecordIndex) => {
    mapping.forEach((matchingIsoForms) => {
      for (let index = 0; index < matchingIsoForms.length; index++) {
        const isoform = matchingIsoForms[index];
        const currentGroup = inputRecordIndex + '-' + isoform.canonicalAccession + '-' + isoform.position + '-' + isoform.altAllele;
        if (index === 0)
          tableRows.push(getPrimaryRow(isoform, currentGroup, isoFormGroupExpanded, toggleIsoFormGroup, annotationExpanded,
            toggleAnnotation, matchingIsoForms.length > 1))
        else if (currentGroup === isoFormGroupExpanded)
          tableRows.push(<AlternateIsoFormRow record={isoform} toggleOpenGroup={currentGroup} />)
      }
    })
  });
  return tableRows;
};

export default ResultTable;