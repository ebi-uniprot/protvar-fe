import { useState, Fragment } from "react"
import { CADD_INFO_URL, ENSEMBL_CHRM_URL, ENSEMBL_GENE_URL, ENSEMBL_VIEW_URL, UNIPROT_ACCESSION_URL } from "../../../constants/ExternalUrls";
import { getCaddCss, getTitle } from "./CaddHelper";
import ProteinReviewStatus from "./ProteinReviewStatus";
import InvalidTableRows from "./InvalidTableRows";
import Button from '../../elements/form/Button';
import { StringVoidFun } from "../../../constants/CommonTypes";
import ProteinIcon from '../../../images/proteins.svg';
import StructureIcon from '../../../images/structures-3d.svg';
import PopulationIcon from '../../../images/human.svg';
import StructuralDetail from "../structure/StructuralDetail";
import PopulationDetail from "../population/PopulationDetail";
import FunctionalDetail from "../function/FunctionalDetail";
import { MappingRecord } from "../../../utills/Convertor";
import { ParsedInput } from "../../../types/MappingResponse";

interface ResultTableProps {
  invalidInputs: Array<ParsedInput>
  mappings: Array<Array<Array<MappingRecord>>>
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
        <th colSpan={5}>Input</th>
        <th colSpan={3}>Genomic</th>
        <th colSpan={6}>Protein</th>
        <th colSpan={5}>Annotations</th>
      </tr>
      <tr>
        <th>CHR</th>
        <th>Coordinate</th>
        <th>ID</th>
        <th>Ref</th>
        <th>Alt</th>
        <th>Gene</th>
        <th>Codon (Strand)</th>
        <th>CADD</th>
        <th>show alt. isoforms</th>
        <th>Isoform</th>
        <th>Protein Name</th>
        <th>AA Pos</th>
        <th>AA Change</th>
        <th>Consequences</th>
        <th>Functional</th>
        <th>Population Observation</th>
        <th>Structural</th>
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
  let tableRows: Array<JSX.Element> = [];
  mappings.forEach((mapping) => {
    mapping.forEach((matchingIsoForms) => {
      matchingIsoForms.forEach((isoform) => {
        let currentGroup = isoform.canonicalAccession + '-' + isoform.position + '-' + isoform.altAllele;
        if (currentGroup === isoFormGroupExpanded) {
          let row = getRow(isoform, isoFormGroupExpanded, toggleIsoFormGroup, annotationExpanded, toggleAnnotation);
          tableRows.push(row);
        } else if (isoform.canonical || isoform.canonicalAccession === null) {
          let row = getRow(isoform, isoFormGroupExpanded, toggleIsoFormGroup, annotationExpanded, toggleAnnotation);
          tableRows.push(row);
        }
      })
    })
  });
  return tableRows;
};

const getRow = (record: MappingRecord, isoFormGroupExpanded: string, toggleIsoFormGroup: StringVoidFun,
  annotationExpanded: string, toggleAnnotation: StringVoidFun) => {
  let caddCss = getCaddCss(record.CADD);
  let caddTitle = getTitle(record.CADD);
  let strand = '(+)';
  if (record.strand === true) strand = '(-)';
  if (record.codon === undefined || record.codon === null) {
    strand = '';
  }
  let proteinName = record.proteinName;
  let proteinType = record.canonical ? 'Swiss-Prot' : 'TrEMBL';
  if (record.isoform === undefined) proteinType = '';
  if (record.proteinName && record.proteinName.length > 20) {
    proteinName = record.proteinName.substring(0, 20) + '..';
  }

  const positionUrl = ENSEMBL_VIEW_URL + record.chromosome + ':' + record.position + '-' + record.position;
  const toggleOpenGroup = record.canonicalAccession + '-' + record.position + '-' + record.altAllele;
  const expandedGroup = record.isoform + '-' + record.position + '-' + record.altAllele;
  const functionalKey = 'functional-' + expandedGroup;
  const structuralKey = 'structural-' + expandedGroup;
  const populationKey = 'population-' + expandedGroup;

  function displayVal(data: string | number) {
    if (record.canonical) return data;
    if (!record.canonicalAccession) return data;
    return '';
  }

  return <Fragment key={`${record.isoform}-${record.position}-${record.altAllele}`}>
    <tr >
      <td>
        <a href={ENSEMBL_CHRM_URL + record.chromosome} target="_blank" rel="noopener noreferrer">
          {record.chromosome}
        </a>
      </td>
      <td>
        <a href={positionUrl} target="_blank" rel="noopener noreferrer">
          {displayVal(record.position)}
        </a>
      </td>
      <td>{record.id}</td>
      <td>{record.refAllele}</td>
      <td>
        {displayVal(record.altAllele)}
      </td>
      <td>
        <a href={ENSEMBL_GENE_URL + record.geneName} target="_blank" rel="noopener noreferrer">
          {record.geneName}
        </a>
      </td>
      <td>
        {record.codon} {strand}
      </td>
      <td>
        <span className={caddCss} title={caddTitle}>
          <a href={CADD_INFO_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
            {isNaN(parseFloat(record.CADD!)) ? "" : parseFloat(record.CADD!).toFixed(1)}
          </a>
        </span>
      </td>
      {record.canonical ? (
        <td>
          <Button
            onClick={() => toggleIsoFormGroup(toggleOpenGroup)}
            className="button button--toggle-isoforms"
          >
            {isoFormGroupExpanded !== toggleOpenGroup ? '+' : null}
            {isoFormGroupExpanded === toggleOpenGroup ? '- ' : null}
          </Button>
        </td>
      ) : (
        <td />
      )}

      <td>
        <ProteinReviewStatus type={proteinType} />
        <a href={UNIPROT_ACCESSION_URL + record.isoform} target="_blank" rel="noopener noreferrer">
          {record.isoform}
        </a>
      </td>
      <td>
        <span title={record.proteinName}>{proteinName}</span>
      </td>
      <td>{record.aaPos}</td>
      <td>{record.aaChange}</td>
      <td>{record.consequences}</td>
      {getSignificancesButton(functionalKey, 'FUN', record, annotationExpanded, toggleAnnotation)}
      {getSignificancesButton(populationKey, 'POP', record, annotationExpanded, toggleAnnotation)}
      {getSignificancesButton(structuralKey, 'STR', record, annotationExpanded, toggleAnnotation)}
    </tr>

    {populationKey === annotationExpanded && <PopulationDetail populationObservationsUri={record.populationObservationsUri!} variantAA={record.variantAA!} />}
    {structuralKey === annotationExpanded && <StructuralDetail isoFormAccession={record.isoform!} aaPosition={record.aaPos!} />}
    {functionalKey === annotationExpanded && <FunctionalDetail refAA={record.refAA!} variantAA={record.variantAA!}
      ensg={record.ensg!} ensp={record.ensp!} referenceFunctionUri={record.referenceFunctionUri!}
    />
    }
  </Fragment>
};

function getSignificancesButton(rowKey: string, buttonLabel: string, accession: MappingRecord,
  annotationExpanded: string, toggleAnnotation: StringVoidFun) {
  if (!accession.canonical) return <td />;
  let buttonCss = 'button--significances  button-new';
  let columnCss = 'fit';
  if (rowKey === annotationExpanded) {
    buttonCss = 'button--significances-clicked  button-new';
    columnCss = 'fit-clicked';
  }
  var buttonTag = <img src={ProteinIcon} className="button-icon" alt="protein icon" />;
  if (buttonLabel === 'POP') buttonTag = <img src={PopulationIcon} className="button-icon" alt="population icon" />;
  else if (buttonLabel === 'STR') buttonTag = <img src={StructureIcon} className="button-icon" alt="structure icon" />;
  return (
    <td className={columnCss}>
      <button
        onClick={() => toggleAnnotation(rowKey)}
        className={buttonCss}
      >
        <b>{buttonTag}</b>
      </button>
    </td>
  );
}

export default ResultTable;