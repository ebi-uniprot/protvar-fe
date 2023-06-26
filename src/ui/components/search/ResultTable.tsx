import { useState } from "react"
import { StringVoidFun } from "../../../constants/CommonTypes";
import { MappingRecord } from "../../../utills/Convertor";
import AlternateIsoFormRow from "./AlternateIsoFormRow";
import { GENOMIC_COLS, PROTEIN_COLS } from "../../../constants/SearchResultTable";
import Tool from "../../elements/Tool";
import getPrimaryRow from "./PrimaryRow";
import NoteRow from "./NoteRow";

interface ResultTableProps {
  mappings: Array<Array<Array<MappingRecord>>>
}

export function getProteinName(record: MappingRecord) {
  let proteinName = record.proteinName;
  if (record.proteinName && record.proteinName.length > 20) {
    proteinName = record.proteinName.substring(0, 20) + '...';
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
  return <table className="" cellPadding="0" cellSpacing="0" id="resultTable">
    <thead>
      <tr>
        <Tool el="th" colSpan={GENOMIC_COLS} tip="Gene and nucleotide level annotations">GENOMIC</Tool>
        <Tool el="th" colSpan={PROTEIN_COLS} tip="Amino acid/protein level annotations">PROTEIN</Tool>
        <Tool el="th" tip="Three types of annotations; functional, co-located variants and structural" pos="up-right">ANNOTATIONS</Tool>
      </tr>
      <tr>
        {/* <th className="sticky"><Tool tip="Chromosome" pos="up-left">Chr</Tool></th> */}
        <Tool el="th" className="sticky" tip="Chromosome" pos="up-left">Chr.</Tool>
        <Tool el="th" className="sticky" tip="Genomic coordinate">Coordinate</Tool>
        <Tool el="th" className="sticky" tip="User entered variant identifier">ID</Tool>
        <Tool el="th" className="sticky" tip="Reference allele">Ref.</Tool>
        <Tool el="th" className="sticky" tip="Alternative allele">Alt.</Tool>
        <Tool el="th" className="sticky" tip="HGNC short gene name">Gene</Tool>
        <Tool el="th" className="sticky" tip="Change of the codon containing the variant nucleotide the position of which is capitalised">Codon (strand)</Tool>
        <Tool el="th" className="sticky" tip="CADD (Combined Annotation Dependent Depletion) phred-like score. Colours are defined in the key at the bottom of the page. Source: PubMed PMID 30371827">CADD</Tool>
        <Tool el="th" className="sticky" tip="The protein isoform the variant is mapped to. 
        By default this is the UniProt canonical isoform, however other isoforms are shown if necessary. 
        Alternative isoforms can be shown by expanding the arrow to the right of the isoform" tSize="xlarge">Isoform</Tool>
        <Tool el="th" className="sticky" tip="Full protein name from UniProt">Protein name</Tool>
        <Tool el="th" className="sticky" tip="Position of the amino acid containing the variant in the displayed isoform">AA pos.</Tool>
        <Tool el="th" className="sticky" tip="Three letter amino acid code for the reference and alternative alleles">AA change</Tool>
        <Tool el="th" className="sticky" tip="A description of the consequence of the variant">Consequence(s)</Tool>
        <Tool el="th" className="sticky" tip="EVE (Evolutionary model of Variant Effects) score. Source: PubMed PMID 34707284">EVE</Tool>
        <th className="sticky">Click for details</th>
      </tr>
    </thead>
    <tbody>
      {tableRows}
    </tbody>
  </table>
}

const getTableRows = (mappings: MappingRecord[][][], isoFormGroupExpanded: string, toggleIsoFormGroup: StringVoidFun,
  annotationExpanded: string, toggleAnnotation: StringVoidFun) => {
  const tableRows: Array<JSX.Element> = [];
  const rowStyle = { a: {backgroundColor: "#F4F3F3" }, b: {backgroundColor: "#FFFFFF" }}
  let prevInput = ""
  let currStyle = rowStyle.a
  let swapStyle = (s: object) => (s === rowStyle.a) ? rowStyle.b : rowStyle.a;
  mappings.forEach((mapping, inputRecordIndex) => {
    mapping.forEach((matchingIsoForms) => {
      for (let index = 0; index < matchingIsoForms.length; index++) {
        const isoform = matchingIsoForms[index];
        const currentGroup = inputRecordIndex + '-' + isoform.canonicalAccession + '-' + isoform.position + '-' + isoform.altAllele;
        let currInput = isoform.input
        if (currInput !== prevInput) {
          currStyle = swapStyle(currStyle)
        }
        prevInput = currInput
        if (index === 0)
          if (isoform.note) {
            tableRows.push(<NoteRow record={isoform}
                                    key={currentGroup}
                                    currStyle={currStyle}/>)
          }
          else
            tableRows.push(getPrimaryRow(isoform, currentGroup, isoFormGroupExpanded, toggleIsoFormGroup, annotationExpanded,
              toggleAnnotation, matchingIsoForms.length > 1, currStyle))
        else if (currentGroup === isoFormGroupExpanded)
          tableRows.push(<AlternateIsoFormRow record={isoform} key={isoform.isoform} currStyle={currStyle} />)
      }
    })
  });
  return tableRows;
};

export default ResultTable;