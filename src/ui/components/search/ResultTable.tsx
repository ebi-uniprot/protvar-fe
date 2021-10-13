import { useState, Fragment, lazy, Suspense } from "react"
import { CADD_INFO_URL, ENSEMBL_CHRM_URL, ENSEMBL_GENE_URL, ENSEMBL_VIEW_URL, UNIPROT_ACCESSION_URL } from "../../../constants/ExternalUrls";
import { getCaddCss, getTitle } from "./CaddHelper";
import ProteinReviewStatus from "./ProteinReviewStatus";
import InvalidTableRows from "./InvalidTableRows";
import { StringVoidFun } from "../../../constants/CommonTypes";
import ProteinIcon from '../../../images/proteins.svg';
import StructureIcon from '../../../images/structures-3d.svg';
import PopulationIcon from '../../../images/human.svg';
import { MappingRecord } from "../../../utills/Convertor";
import { ParsedInput } from "../../../types/MappingResponse";
import LoaderRow from "./LoaderRow";
import Spaces from "../../elements/Spaces";
import AlternateIsoFormRow, { aaChangeTip } from "./AlternateIsoFormRow";
import { EmptyElement } from "../../../constants/Const";
import { ALLELE, CONSEQUENCES, GENOMIC_COLS, INPUT_COLS, PROTEIN_COLS } from "../../../constants/SearchResultTable";
import { ReactComponent as ChevronDownIcon } from "../../../images/chevron-down.svg"
import { ReactComponent as ChevronUpIcon } from "../../../images/chevron-up.svg"
import Tool from "../../elements/Tool";

const StructuralDetail = lazy(() => import(/* webpackChunkName: "StructuralDetail" */ "../structure/StructuralDetail"));
const PopulationDetail = lazy(() => import(/* webpackChunkName: "PopulationDetail" */ "../population/PopulationDetail"));
const FunctionalDetail = lazy(() => import(/* webpackChunkName: "FunctionalDetail" */ "../function/FunctionalDetail"));

interface ResultTableProps {
  invalidInputs: Array<ParsedInput>
  mappings: Array<Array<Array<MappingRecord>>>
}

export function getProteinType(record: MappingRecord) {
  if (!record.isoform)
    return '';
  return record.canonical ? 'Swiss-Prot' : 'TrEMBL'
}

export function getProteinName(record: MappingRecord) {
  let proteinName = record.proteinName;
  if (record.proteinName && record.proteinName.length > 20) {
    proteinName = record.proteinName.substring(0, 20) + '..';
  }
  return proteinName
}

function isAlternateIsoForm(record: MappingRecord) {
  return !record.canonical && record.canonicalAccession;
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
      matchingIsoForms.forEach((isoform) => {
        const currentGroup = inputRecordIndex + '-' + isoform.canonicalAccession + '-' + isoform.position + '-' + isoform.altAllele;
        if (isoform.canonical || isoform.canonicalAccession === null || currentGroup === isoFormGroupExpanded) {
          const row = isAlternateIsoForm(isoform) ? <AlternateIsoFormRow record={isoform} toggleOpenGroup={currentGroup} />
            : getRow(isoform, currentGroup, isoFormGroupExpanded, toggleIsoFormGroup, annotationExpanded, toggleAnnotation);
          tableRows.push(row);
        }
      })
    })
  });
  return tableRows;
};

const getRow = (record: MappingRecord, toggleOpenGroup: string, isoFormGroupExpanded: string, toggleIsoFormGroup: StringVoidFun,
  annotationExpanded: string, toggleAnnotation: StringVoidFun) => {
  let caddCss = getCaddCss(record.CADD);
  let caddTitle = getTitle(record.CADD);
  let strand = record.strand ? '(-)' : '(+)';
  if (!record.codon) {
    strand = '';
  }

  const positionUrl = ENSEMBL_VIEW_URL + record.chromosome + ':' + record.position + '-' + record.position;
  const expandedGroup = record.isoform + '-' + record.position + '-' + record.altAllele;
  const functionalKey = 'functional-' + expandedGroup;
  const structuralKey = 'structural-' + expandedGroup;
  const populationKey = 'population-' + expandedGroup;

  return <Fragment key={`${toggleOpenGroup}-${record.isoform}`}>
    <tr >
      <td>
        <Tool tip="Click to see the a summary for this chromosome from Ensembl" pos="up-left">
          <a href={ENSEMBL_CHRM_URL + record.chromosome} target="_blank" rel="noopener noreferrer">
            {record.chromosome}
          </a>
        </Tool>
      </td>
      <td>
        <Tool tip="Click to see the region detail for this genomic coordinate from Ensembl" pos="up-left">
          <a href={positionUrl} target="_blank" rel="noopener noreferrer">
            {record.position}
          </a>
        </Tool>
      </td>
      <td><Tool tip="Variant ID provided by the user">{record.id}</Tool></td>
      <td><Tool tip={ALLELE.get(record.refAllele)}>{record.refAllele}</Tool></td>
      <td><Tool tip={ALLELE.get(record.altAllele)}>{record.altAllele}</Tool></td>
      <td>
        <Tool tip="Click here for gene information from Ensembl">
          <a href={ENSEMBL_GENE_URL + record.geneName} target="_blank" rel="noopener noreferrer">{record.geneName}</a>
        </Tool>
      </td>
      <td>
        <div className="flex">
          {record.codon}<Spaces /><Tool tip={"Codon change in " + (strand === "(+)" ? " positive" : "negative") + "-sense strand gene"}>{strand}</Tool>
        </div>
      </td>
      <td>
        <Tool className={caddCss} tip={caddTitle}>
          <a href={CADD_INFO_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
            <Spaces count={parseInt(record.CADD!) > 9 ? 0 : 2} />{isNaN(parseFloat(record.CADD!)) ? "" : parseFloat(record.CADD!).toFixed(1)}
          </a>
        </Tool>
      </td>
      <td>
        <div className="flex">
          <ProteinReviewStatus type={getProteinType(record)} />
          <Tool tip="Click to see the UniProt page for this accession">
            <a href={UNIPROT_ACCESSION_URL + record.isoform} target="_blank" rel="noopener noreferrer">{record.isoform}</a>
          </Tool>
          {record.canonical && <>
            <Spaces />
            <Tool
              el="button"
              onClick={() => toggleIsoFormGroup(toggleOpenGroup)}
              className="button button--toggle-isoforms"
              tip={isoFormGroupExpanded !== toggleOpenGroup ? "Show alternative isoforms" : "Hide alternative isoforms"}
            >
              {isoFormGroupExpanded !== toggleOpenGroup ?
                <ChevronDownIcon className="toggle-isoforms" /> : <ChevronUpIcon className="toggle-isoforms" />}
            </Tool>
          </>}
        </div>
      </td>
      <td>
        <Tool tip={record.proteinName}>{getProteinName(record)}</Tool>
      </td>
      <td><Tool tip="The amino acid position in this isoform">{record.aaPos}</Tool></td>
      <td><Tool tip={aaChangeTip(record.aaChange)}>{record.aaChange}</Tool></td>
      <td><Tool tip={CONSEQUENCES.get(record.consequences!)} pos="up-right">{record.consequences}</Tool></td>
      <td >
        <div className="flex">
          {getSignificancesButton(functionalKey, 'FUN', record, annotationExpanded, toggleAnnotation)}
          {getSignificancesButton(populationKey, 'POP', record, annotationExpanded, toggleAnnotation)}
          {getSignificancesButton(structuralKey, 'STR', record, annotationExpanded, toggleAnnotation)}
        </div>
      </td>
    </tr>

    {populationKey === annotationExpanded &&
      <Suspense fallback={<LoaderRow />}>
        <PopulationDetail populationObservationsUri={record.populationObservationsUri!} variantAA={record.variantAA!} />
      </Suspense>
    }
    {structuralKey === annotationExpanded &&
      <Suspense fallback={<LoaderRow />}>
        <StructuralDetail isoFormAccession={record.isoform!} aaPosition={record.aaPos!} />
      </Suspense>
    }
    {functionalKey === annotationExpanded &&
      <Suspense fallback={<LoaderRow />}>
        <FunctionalDetail refAA={record.refAA!} variantAA={record.variantAA!}
          ensg={record.ensg!} ensp={record.ensp!} referenceFunctionUri={record.referenceFunctionUri!} />
      </Suspense>
    }
  </Fragment>
};

function getSignificancesButton(rowKey: string, buttonLabel: string, accession: MappingRecord,
  annotationExpanded: string, toggleAnnotation: StringVoidFun) {
  if (!accession.canonical) return EmptyElement;
  const buttonCss = rowKey === annotationExpanded ? 'button significance' : 'button';
  var toolTip = "Click for functional information"
  var buttonTag = <img src={ProteinIcon} className="click-icon" alt="protein icon" />
  if (buttonLabel === 'POP') {
    buttonTag = <img src={PopulationIcon} className="click-icon" alt="population icon" />
    toolTip = "Click for population observation"
  }
  else if (buttonLabel === 'STR') {
    buttonTag = <img src={StructureIcon} className="click-icon" alt="structure icon" />
    toolTip = "Click for 3D structure"
  }
  return (
    <Tool el="button" tip={toolTip} pos="up-right"
      onClick={() => toggleAnnotation(rowKey)}
      className={buttonCss}
      style={{ marginRight: "0.1rem" }}
    >
      {buttonTag}
    </Tool>
  );
}

export default ResultTable;