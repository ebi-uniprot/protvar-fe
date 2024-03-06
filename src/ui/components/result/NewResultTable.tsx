import {GENOMIC_COLS, PROTEIN_COLS} from "../../../constants/SearchResultTable";
import Tool from "../../elements/Tool";
import {useState} from "react";
import {PagedMappingResponse} from "../../../types/PagedMappingResponse";
import {
  GenomicInput,
  INPUT_CDNA,
  INPUT_GEN,
  INPUT_ID,
  INPUT_PRO
} from "../../../types/MappingResponse";
import {NewMsgRow} from "../search/MsgRow";
import {StringVoidFun} from "../../../constants/CommonTypes";
import {getAlternateIsoFormRow} from "../search/AlternateIsoFormRow";
import {getNewPrimaryRow} from "../search/PrimaryRow";
import {AppState} from "../../App";

interface NewResultTableProps {
  state: AppState
}

function NewResultTable(props: NewResultTableProps) {
  const [isoFormGroupExpanded, setIsoFormGroupExpanded] = useState('')
  const [annotationExpanded, setAnnotationExpanded] = useState('')

  function toggleIsoFormGroup(key: string) {
    setIsoFormGroupExpanded(isoFormGroupExpanded === key ? '' : key);
  }

  function toggleAnnotation(key: string) {
    setAnnotationExpanded(annotationExpanded === key ? '' : key);
  }

  const tableRows = getTableRows(props.state.response, isoFormGroupExpanded, toggleIsoFormGroup, annotationExpanded, toggleAnnotation);
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
            tip="CADD (Combined Annotation Dependent Depletion) phred-like score. Colours are defined in the key at the bottom of the page. Source: PubMed PMID 30371827">CADD</Tool>
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
            tip="EVE (Evolutionary model of Variant Effects) score. Source: PubMed PMID 34707284">EVE</Tool>
      <th className="sticky">Click for details</th>
    </tr>
    </thead>
    <tbody>
      {tableRows}
    </tbody>
  </table>
}


const getTableRows = (data: PagedMappingResponse | null, isoFormGroupExpanded: string, toggleIsoFormGroup: StringVoidFun,
                      annotationExpanded: string, toggleAnnotation: StringVoidFun) => {
  const tableRows: Array<JSX.Element> = [];

  data?.content.messages.forEach((m, mIdx) => {
    //records.push(msgRow(-1, m))  // index -1 NOT TAKEN INTO ACCOUNT
    tableRows.push(<NewMsgRow key={'main-'+mIdx} msg={m} />)
  });
  const addGenMapping = (index: number, input: GenomicInput) => {
    input.mappings.forEach(mapping => {
      mapping.genes.forEach(gene => {
        gene.isoforms.forEach((isoform, isoformNo) => {
          const currentGroup = index + '-' + isoform.canonicalAccession + '-' + input.pos + '-' + input.alt;
          if (isoformNo === 0)
            tableRows.push(getNewPrimaryRow(index, input, gene, isoform, currentGroup, isoFormGroupExpanded, toggleIsoFormGroup, annotationExpanded,
              toggleAnnotation, gene.isoforms.length > 1))
          else if (currentGroup === isoFormGroupExpanded)
            tableRows.push(getAlternateIsoFormRow(index, input, gene, isoform))
        })
      })
    })
  }

  data?.content.inputs.forEach((input, inputIndex) => {

    input.messages.forEach((m,msgIdx) => {
      //records.push(msgRow(index, m, input))
      tableRows.push(<NewMsgRow key={'input'+inputIndex + '-' + msgIdx} msg={m} />)
    });

    if (input.type === INPUT_GEN && "mappings" in input) {
      //records.push(convertGenInputMappings(input, input, index))
      addGenMapping(inputIndex, input)
    }
    else if ((input.type === INPUT_PRO || input.type === INPUT_CDNA || input.type === INPUT_ID) && "derivedGenomicInputs" in input) {
      input.derivedGenomicInputs.forEach((gInput: GenomicInput, genIndex: number) => {
        gInput.messages.forEach((m, msgIdx) => {
          //records.push(msgRow(index, m, gInput))
          tableRows.push(<NewMsgRow key={'input'+inputIndex + '-gen-' + genIndex + '-' + msgIdx} msg={m} />)
        });
        //records.push(convertGenInputMappings(input, gInput, index))
        // IT SEEMS WE MAY NOT BE TAKING THE ORIGINAL AND DERIVED GEN INPUT
        // INTO ACCOUNT SOMEWHERE...
        addGenMapping(inputIndex, gInput)
      })
    }
  });
  return tableRows;
};

export default NewResultTable;