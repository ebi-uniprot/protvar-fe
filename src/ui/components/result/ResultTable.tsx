import {GENOMIC_COLS, PROTEIN_COLS} from "../../../constants/SearchResultTable";
import Tool from "../../elements/Tool";
import {useContext, useState} from "react";
import {PagedMappingResponse} from "../../../types/PagedMappingResponse";
import {
  GenomicInput,
  INPUT_CDNA,
  INPUT_GEN,
  INPUT_ID,
  INPUT_PRO, InputType
} from "../../../types/MappingResponse";
import {StringVoidFun} from "../../../constants/CommonTypes";
import {getAlternateIsoFormRow} from "./AlternateIsoFormRow";
import {getNewPrimaryRow} from "../search/PrimaryRow";
import {AppContext} from "../../App";
import Loader from "../../elements/Loader";
import MsgRow from "./MsgRow";

function ResultTable(props: {loading: boolean, data: PagedMappingResponse | null}) {
  const stdColor = useContext(AppContext).stdColor
  const [isoformGroupExpanded, setIsoformGroupExpanded] = useState('')
  const [annotationExpanded, setAnnotationExpanded] = useState('')

  function toggleIsoformGroup(key: string) {
    setIsoformGroupExpanded(isoformGroupExpanded === key ? '' : key);
  }

  function toggleAnnotation(key: string) {
    setAnnotationExpanded(annotationExpanded === key ? '' : key);
  }

  // if loading and no data -> show loader
  // if not loading and no data -> No result found.
  // if loading and data -> show (curr) data & Prev/Next -> Loading
  // if not loading and data -> show data
  if (props.loading && !props.data)
    return <Loader />
  if (!props.loading && !props.data)
    return <div><h5>No result found</h5> Try another link or searching for variants again.</div>

  const tableRows = getTableRows(props.data, isoformGroupExpanded, toggleIsoformGroup, annotationExpanded, toggleAnnotation, stdColor);
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
      <Tool el="th" className="sticky" tip="CADD (Combined Annotation Dependent Depletion) phred-like score. Colours are defined in the legends. Source: PubMed PMID 30371827">CADD</Tool>
      <Tool el="th" className="sticky" tip="The protein isoform the variant is mapped to.
        By default this is the UniProt canonical isoform, however other isoforms are shown if necessary.
        Alternative isoforms can be shown by expanding the arrow to the right of the isoform" tSize="xlarge">Isoform</Tool>
      <Tool el="th" className="sticky" tip="Full protein name from UniProt">Protein name</Tool>
      <Tool el="th" className="sticky" tip="Position of the amino acid containing the variant in the displayed isoform">AA pos.</Tool>
      <Tool el="th" className="sticky" tip="Three letter amino acid code for the reference and alternative alleles">AA change</Tool>
      <Tool el="th" className="sticky" tip="A description of the consequence of the variant">Consequence(s)</Tool>
      <Tool el="th" className="sticky" tip="AlphaMissense prediction. Colours are defined in the legends. Source: PubMed PMID 37733863">AlphaMiss. pred.</Tool>
      <th className="sticky">Click for details</th>
    </tr>
    </thead>
    <tbody>
    {tableRows}
    </tbody>
  </table>
}


const getTableRows = (data: PagedMappingResponse | null, isoformGroupExpanded: string, toggleIsoformGroup: StringVoidFun,
                      annotationExpanded: string, toggleAnnotation: StringVoidFun, stdColor: boolean) => {
  const tableRows: Array<JSX.Element> = [];

  data?.content.messages?.forEach((m, mIdx) => {
    //records.push(msgRow(-1, m))  // index -1 NOT TAKEN INTO ACCOUNT
    tableRows.push(<MsgRow key={`content-message-${mIdx}`} msg={m} />)
  });
  let rowCount = 0 // to ensure similar or duplicate inputs do not lead to conflicting key
  const addGenMapping = (index: number, genIndex: number, input: GenomicInput, originalInput: InputType) => {
    input.mappings.forEach((mapping, mappingIdx) => {
      mapping.genes.forEach((gene, geneIdx) => {
        const isoformGroupKey = `input-${index}-genInput-${genIndex}-mapping-${mappingIdx}-gene-${geneIdx}-isoform`
        gene.isoforms.forEach((isoform, isoformIdx) => {
          rowCount++;
          const isoformKey = `${isoformGroupKey}-${isoformIdx}-row-${rowCount}`
          if (isoformIdx === 0) {
            tableRows.push(getNewPrimaryRow(isoformKey, isoformGroupKey, isoformGroupExpanded, index, input, originalInput, gene, isoform,
              toggleIsoformGroup, annotationExpanded, toggleAnnotation, gene.isoforms.length > 1, stdColor))
          }
          else if (isoformGroupKey === isoformGroupExpanded) {
            tableRows.push(getAlternateIsoFormRow(isoformKey, index, input, gene, isoform))
          }
        })
      })
    })
  }

  data?.content.inputs?.forEach((input, inputIndex) => {

    input.messages.forEach((m,msgIdx) => {
      //records.push(msgRow(index, m, input))
      tableRows.push(<MsgRow key={`input-${inputIndex}-message-${msgIdx}`} msg={m} input={input} />)
    });

    if (input.type === INPUT_GEN && "mappings" in input) {
      //records.push(convertGenInputMappings(input, input, index))
      addGenMapping(inputIndex, 0, input, input)
    }
    else if ((input.type === INPUT_PRO || input.type === INPUT_CDNA || input.type === INPUT_ID) && "derivedGenomicInputs" in input) {
      input.derivedGenomicInputs.forEach((gInput: GenomicInput, genIndex: number) => {
        gInput.messages.forEach((m, msgIdx) => {
          //records.push(msgRow(index, m, gInput))
          tableRows.push(<MsgRow key={`input-${inputIndex}-genInput-${genIndex}-message-${msgIdx}`} msg={m} />)
        });
        //records.push(convertGenInputMappings(input, gInput, index))
        // IT SEEMS WE MAY NOT BE TAKING THE ORIGINAL AND DERIVED GEN INPUT
        // INTO ACCOUNT SOMEWHERE...
        addGenMapping(inputIndex, genIndex, gInput, input)
      })
    }
  });
  return tableRows;
};

export default ResultTable;