import { useState, Fragment, lazy, Suspense } from "react"
import { CADD_INFO_URL, ENSEMBL_CHRM_URL, ENSEMBL_GENE_URL, ENSEMBL_VIEW_URL, UNIPROT_ACCESSION_URL } from "../../../constants/ExternalUrls";
import { getCaddCss, getTitle } from "./CaddHelper";
import ProteinReviewStatus from "./ProteinReviewStatus";
import InvalidTableRows from "./InvalidTableRows";
import Button from '../../elements/form/Button';
import { StringVoidFun } from "../../../constants/CommonTypes";
import ProteinIcon from '../../../images/proteins.svg';
import StructureIcon from '../../../images/structures-3d.svg';
import PopulationIcon from '../../../images/human.svg';
import { MappingRecord } from "../../../utills/Convertor";
import { ParsedInput } from "../../../types/MappingResponse";
import LoaderRow from "./LoaderRow";
import Spaces from "../../elements/Spaces";
import AlternateIsoFormRow from "./AlternateIsoFormRow";
import { EmptyElement } from "../../../constants/Const";
import { GENOMIC_COLS, INPUT_COLS, PROTEIN_COLS } from "../../../constants/SearchResultTable";

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
        <th colSpan={INPUT_COLS}>INPUT</th>
        <th colSpan={GENOMIC_COLS}>GENOMIC</th>
        <th colSpan={PROTEIN_COLS}>PROTEIN</th>
        <th>ANNOTATIONS</th>
      </tr>
      <tr>
        <th className="sticky">Chr</th>
        <th className="sticky">Coordinate</th>
        <th className="sticky">Id</th>
        <th className="sticky">Ref</th>
        <th className="sticky">Alt</th>
        <th className="sticky">Gene</th>
        <th className="sticky">Codon (Strand)</th>
        <th className="sticky">CADD</th>
        <th className="sticky">Show alt. iso forms</th>
        <th className="sticky">Isoform</th>
        <th className="sticky">Protein name</th>
        <th className="sticky">AA pos.</th>
        <th className="sticky">AA change</th>
        <th className="sticky">Consequences</th>
        <th className="sticky">Click buttons below for details</th>
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
        <a href={ENSEMBL_CHRM_URL + record.chromosome} target="_blank" rel="noopener noreferrer">
          {record.chromosome}
        </a>
      </td>
      <td>
        <a href={positionUrl} target="_blank" rel="noopener noreferrer">
          {record.position}
        </a>
      </td>
      <td>{record.id}</td>
      <td>{record.refAllele}</td>
      <td>
        {record.altAllele}
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
            <Spaces count={parseInt(record.CADD!) > 9 ? 0 : 2} />{isNaN(parseFloat(record.CADD!)) ? "" : parseFloat(record.CADD!).toFixed(1)}
          </a>
        </span>
      </td>
      {record.canonical ? (
        <td>
          <Button
            onClick={() => toggleIsoFormGroup(toggleOpenGroup)}
            className="button button--toggle-isoforms"
          >
            {isoFormGroupExpanded !== toggleOpenGroup ? '+' : '- '}
          </Button>
        </td>
      ) : (
        <td />
      )}

      <td>
        <ProteinReviewStatus type={getProteinType(record)} />
        <a href={UNIPROT_ACCESSION_URL + record.isoform} target="_blank" rel="noopener noreferrer">
          {record.isoform}
        </a>
      </td>
      <td>
        <span title={record.proteinName}>{getProteinName(record)}</span>
      </td>
      <td>{record.aaPos}</td>
      <td>{record.aaChange}</td>
      <td>{record.consequences}</td>
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

  var buttonTag = <img src={ProteinIcon} className="click-icon" alt="protein icon" title="Functional information" />;
  if (buttonLabel === 'POP')
    buttonTag = <img src={PopulationIcon} className="click-icon" alt="population icon" title="Population observation" />;
  else if (buttonLabel === 'STR')
    buttonTag = <img src={StructureIcon} className="click-icon" alt="structure icon" title="3D structure" />;
  return (
    <button
      onClick={() => toggleAnnotation(rowKey)}
      className={buttonCss}
      style={{ marginRight: "0.1rem" }}
    >
      {buttonTag}
    </button>
  );
}

export default ResultTable;