import './PrimaryRow.css';
import { Fragment, lazy, Suspense } from "react";
import { StringVoidFun } from "../../../constants/CommonTypes";
import {
  CADD_INFO_URL, AM_INFO_URL,
  CLINVAR_RCV_URL, CLINVAR_VCV_URL, COSMIC_URL,
  DBSNP_URL,
  ENSEMBL_CHRM_URL,
  ENSEMBL_GENE_URL,
  ENSEMBL_VIEW_URL,
  UNIPROT_ACCESSION_URL
} from "../../../constants/ExternalUrls";
import { ALLELE, CONSEQUENCES } from "../../../constants/SearchResultTable";
import { MappingRecord } from "../../../utills/Convertor";
import Spaces from "../../elements/Spaces";
import Tool from "../../elements/Tool";
import {caddScoreAttr} from "./CaddScorePred";
import {amScoreAttr} from "../function/prediction/AlphaMissensePred";
import { getProteinName } from "./ResultTable";
import ProteinIcon from '../../../images/proteins.svg';
import StructureIcon from '../../../images/structures-3d.svg';
import PopulationIcon from '../../../images/human.svg';
import LoaderRow from "./LoaderRow";
import { ReactComponent as ChevronDownIcon } from "../../../images/chevron-down.svg"
import { ReactComponent as ChevronUpIcon } from "../../../images/chevron-up.svg"
import { EmptyElement } from "../../../constants/ConstElement";
import { aaChangeTip, CanonicalIcon } from "./AlternateIsoFormRow";
import {INPUT_GEN, INPUT_PRO, INPUT_ID, INPUT_CDNA} from "../../../types/MappingResponse";

const StructuralDetail = lazy(() => import(/* webpackChunkName: "StructuralDetail" */ "../structure/StructuralDetail"));
const PopulationDetail = lazy(() => import(/* webpackChunkName: "PopulationDetail" */ "../population/PopulationDetail"));
const FunctionalDetail = lazy(() => import(/* webpackChunkName: "FunctionalDetail" */ "../function/FunctionalDetail"));

const getPrimaryRow = (record: MappingRecord, toggleOpenGroup: string, isoFormGroupExpanded: string, toggleIsoFormGroup: StringVoidFun,
  annotationExpanded: string, toggleAnnotation: StringVoidFun, hasAltIsoForm: boolean, currStyle: object) => {

  const caddAttr = caddScoreAttr(record.cadd)
  const amAttr = amScoreAttr(record.amScore?.amClass)

  let strand = record.strand ? '(-)' : '(+)';
  if (!record.codon) {
    strand = '';
  }
  let inputStyle = {
    gen: {
      backgroundColor: record.type === INPUT_GEN ? "#F8EDF0" : ""
    },
    pro: {
      backgroundColor: (record.type === INPUT_PRO || record.type === INPUT_CDNA)? "#F8EDF0" : ""
    },
    rs: {
      backgroundColor: record.type === INPUT_ID ? "#F8EDF0" : ""
    }
  }

  const getUrl = (id:string) => {
    if (id) {
      let idLowerCase = id.toLowerCase()
      let idUpperCase = id.toUpperCase()
      if (idLowerCase.startsWith("rs")) {
        return DBSNP_URL + id;
      } else if (idUpperCase.startsWith("RCV")) {
        return CLINVAR_RCV_URL + id;
      } else if (idUpperCase.startsWith("VCV")) {
        return CLINVAR_VCV_URL + id;
      } else if (idUpperCase.startsWith("COSV") || idUpperCase.startsWith("COSM") || idUpperCase.startsWith("COSN")) {
        return COSMIC_URL + id;
      }
    }
    return "";
  }

  const positionUrl = ENSEMBL_VIEW_URL + record.chromosome + ':' + record.position + '-' + record.position;
  const expandedGroup = record.isoform + '-' + record.position + '-' + record.altAllele;
  const functionalKey = 'functional-' + expandedGroup;
  const structuralKey = 'structural-' + expandedGroup;
  const populationKey = 'population-' + expandedGroup;

  return <Fragment key={`${toggleOpenGroup}-${record.isoform}`}>
    <tr style={currStyle} title={'Input: ' + record.input} >
      <td style={inputStyle.gen}>
        <Tool tip="Click to see the a summary for this chromosome from Ensembl" pos="up-left">
          <a href={ENSEMBL_CHRM_URL + record.chromosome} target="_blank" rel="noopener noreferrer">
            {record.chromosome}
          </a>
        </Tool>
      </td>
      <td style={inputStyle.gen}>
        <Tool tip="Click to see the region detail for this genomic coordinate from Ensembl" pos="up-left">
          {record.converted && <span className="h37">37&rarr;38</span>}
          <a href={positionUrl} target="_blank" rel="noopener noreferrer">
            {record.position}
          </a>
        </Tool>
      </td>
      <td style={inputStyle.rs}><Tool tip="Variant ID provided by the user">
        <a href={getUrl(record.id)} target="_blank" rel="noopener noreferrer">{record.id}</a>
      </Tool></td>
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
        <Tool className="score-box" style={{ backgroundColor: caddAttr?.color }} tip={caddAttr?.title}>
          <a href={CADD_INFO_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
            <Spaces count={parseInt(record.cadd!) > 9 ? 0 : 2} />{isNaN(parseFloat(record.cadd!)) ? "" : parseFloat(record.cadd!).toFixed(1)}
          </a>
        </Tool>
      </td>
      <td style={inputStyle.pro}>
        <div className="flex">
          <CanonicalIcon isCanonical={record.canonical} />
          <Spaces />
          <Tool tip="Click to see the UniProt page for this accession">
            <a href={UNIPROT_ACCESSION_URL + record.isoform} target="_blank" rel="noopener noreferrer">{record.isoform}</a>
          </Tool>
          {hasAltIsoForm && <>
            <Spaces />
            <Tool
              el="button"
              onClick={() => toggleIsoFormGroup(toggleOpenGroup)}
              className="button button--toggle-isoforms"
              tip={isoFormGroupExpanded !== toggleOpenGroup ? "Show more isoforms" : "Hide isoforms"}
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
      <td style={inputStyle.pro}><Tool tip="The amino acid position in this isoform">{record.aaPos}</Tool></td>
      <td><Tool tip={aaChangeTip(record.aaChange)}>{record.aaChange}</Tool></td>
      <td><Tool tip={CONSEQUENCES.get(record.consequences!)} pos="up-right">{record.consequences}</Tool></td>
      <td>
        <Tool className="score-box" style={{ backgroundColor: amAttr?.color }} tip={`${record.amScore?.amPathogenicity} ${amAttr?.title}`}>
          <a href={AM_INFO_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
            {record.amScore?.amPathogenicity.toString().substring(0,4)}
          </a>
        </Tool>
      </td>
      <td>
        <div className="flex">
          {!record.canonical && <><br/><br/></>}
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
        <StructuralDetail isoFormAccession={record.isoform!} aaPosition={record.aaPos!} variantAA={record.variantAA!} proteinStructureUri={record.proteinStructureUri!}/>
      </Suspense>
    }
    {functionalKey === annotationExpanded &&
      <Suspense fallback={<LoaderRow />}>
        <FunctionalDetail record={record} referenceFunctionUri={record.referenceFunctionUri!} />
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

export default getPrimaryRow;