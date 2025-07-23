import {GENOMIC_COLS, PROTEIN_COLS} from "../../../constants/SearchResultTable";
import Tool from "../../elements/Tool";
import React, {useContext, useState} from "react";
import {PagedMappingResponse} from "../../../types/PagedMappingResponse";
import {Message, GenomicVariant} from "../../../types/MappingResponse";
import {StringVoidFun} from "../../../constants/CommonTypes";
import {getAlternateIsoFormRow} from "./AlternateIsoFormRow";
import {getNewPrimaryRow} from "./PrimaryRow";
import {AppContext} from "../../App";
import MsgRow from "./MsgRow";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";

function ResultTable(props: { data: PagedMappingResponse | null }) {
  const stdColor = useContext(AppContext).stdColor
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isoformGroupExpanded, setIsoformGroupExpanded] = useState('')
  const [annotationExpanded, setAnnotationExpanded] = useState(searchParams.get('annotation') ?? '')

  function toggleIsoformGroup(key: string) {
    setIsoformGroupExpanded(isoformGroupExpanded === key ? '' : key);
  }

  function toggleAnnotation(key: string) {
    const ann = annotationExpanded === key ? '' : key
    if (ann)
      searchParams.set("annotation", ann);
    else
      searchParams.delete("annotation");
    setAnnotationExpanded(ann);

    const url = `${location.pathname}${searchParams.size > 0 ? `?${searchParams.toString()}` : ``}`
    navigate(url);
  }

  if (!props.data)
    return null

  const tableRows = getTableRows(props.data, isoformGroupExpanded, toggleIsoformGroup, annotationExpanded, toggleAnnotation, stdColor);
  return <table className="" cellPadding="0" cellSpacing="0" id="resultTable">
    <thead>
    <tr>
      <Tool el="th" colSpan={GENOMIC_COLS} tip="Gene and nucleotide level annotations">GENOMIC</Tool>
      <Tool el="th" colSpan={PROTEIN_COLS} tip="Amino acid/protein level annotations">PROTEIN</Tool>
      <Tool el="th" tip="Three types of annotations; functional, co-located variants and structural"
            pos="up-right">ANNOTATIONS</Tool>
    </tr>
    <tr>
      {/* <th className="sticky"><Tool tip="Chromosome" pos="up-left">Chr</Tool></th> */}
      <Tool el="th" className="sticky" tip="Chromosome" pos="up-left">Chr.</Tool>
      <Tool el="th" className="sticky" tip="Genomic coordinate">Coordinate</Tool>
      <Tool el="th" className="sticky" tip="User entered variant identifier">ID</Tool>
      <Tool el="th" className="sticky" tip="Reference allele">Ref.</Tool>
      <Tool el="th" className="sticky" tip="Alternative allele">Alt.</Tool>
      <Tool el="th" className="sticky" tip="HGNC short gene name">Gene</Tool>
      <Tool el="th" className="sticky"
            tip="Change of the codon containing the variant nucleotide the position of which is capitalised">Codon
        (strand)</Tool>
      <Tool el="th" className="sticky"
            tip="CADD (Combined Annotation Dependent Depletion) phred-like score. Colours are defined in the legends. Source: PubMed PMID 30371827">CADD
        v1.7</Tool>
      <Tool el="th" className="sticky" tip="The protein isoform the variant is mapped to.
        By default this is the UniProt canonical isoform, however other isoforms are shown if necessary.
        Alternative isoforms can be shown by expanding the arrow to the right of the isoform"
            tSize="xlarge">Isoform</Tool>
      <Tool el="th" className="sticky" tip="Full protein name from UniProt">Protein name</Tool>
      <Tool el="th" className="sticky" tip="Position of the amino acid containing the variant in the displayed isoform">AA
        pos.</Tool>
      <Tool el="th" className="sticky" tip="Three letter amino acid code for the reference and alternative alleles">AA
        change</Tool>
      <Tool el="th" className="sticky" tip="A description of the consequence of the variant">Consequence(s)</Tool>
      <Tool el="th" className="sticky"
            tip="AlphaMissense prediction. Colours are defined in the legends. Source: PubMed PMID 37733863">AlphaMiss.
        pred.</Tool>
      <th className="sticky">Click for details</th>
    </tr>
    </thead>
    <tbody>
    {tableRows}
    </tbody>
  </table>
}

export const rowBg = (index: number) => {
  const rowColor = {backgroundColor: "#F4F3F3"}
  const altRowColor = {backgroundColor: "#FFFFFF"}
  return (index % 2 === 0) ? altRowColor : rowColor;
}

const NO_MAPPING: Message = {type: 'ERROR', text: 'No mapping found'}

// Process and convert paged mapping response into table rows
const getTableRows = (data: PagedMappingResponse | null, isoformGroupExpanded: string, toggleIsoformGroup: StringVoidFun,
                      annotationExpanded: string, toggleAnnotation: StringVoidFun, stdColor: boolean) => {
  const tableRows: Array<React.JSX.Element> = [];

  // whole-input messages
  data?.content.messages?.forEach((message, messageIndex) => {
    tableRows.push(<MsgRow key={`message-${messageIndex}`} message={message}/>)
  });

  let primaryRow = 0 // ensures similar or duplicate inputs do not lead to conflicting key
  let altRow = 0

  data?.content.inputs?.forEach((input, inputIndex) => {

    // each user input messages
    input.messages.forEach((message, messageIndex) => {
      tableRows.push(<MsgRow key={`input-${inputIndex}-message-${messageIndex}`} index={inputIndex} message={message}
                             input={input}/>)
    });

    input.derivedGenomicVariants.forEach((genomicVariant: GenomicVariant, genIndex: number) => {
      /*gInput.messages.forEach((message, messageIndex) => {
        tableRows.push(<MsgRow index={inputIndex} key={`input-${inputIndex}-${genIndex}-message-${messageIndex}`} message={message} input={input} />)
      });*/
      // IT SEEMS WE MAY NOT BE TAKING THE ORIGINAL AND DERIVED GEN INPUT
      // INTO ACCOUNT SOMEWHERE...

      if (genomicVariant.genes.length === 0 && input.messages.length === 0) { // no message
        tableRows.push(<MsgRow key={`input-${inputIndex}-${genIndex}-nomapping`} index={inputIndex} message={NO_MAPPING}
                               input={input} genomicVariant={genomicVariant}/>)
        return
      }

      genomicVariant.genes.forEach((gene, geneIdx) => {
        const isoformGroupKey = `input-${inputIndex}-${genIndex}-gene-${geneIdx}-isoform`
        gene.isoforms.forEach((isoform, isoformIdx) => {
          if (isoformIdx === 0) {
            primaryRow++;
            altRow = 0; // reset
            tableRows.push(getNewPrimaryRow(`row-${primaryRow}`, isoformGroupKey, isoformGroupExpanded, inputIndex, genomicVariant, input, gene, isoform,
              toggleIsoformGroup, annotationExpanded, toggleAnnotation, gene.isoforms.length > 1, stdColor))
          } else if (isoformGroupKey === isoformGroupExpanded) {
            altRow++;
            tableRows.push(getAlternateIsoFormRow(`row-${primaryRow}-${altRow}`, inputIndex, isoform))
          }
        })
      })

    })

  });
  return tableRows;
};

export default ResultTable;