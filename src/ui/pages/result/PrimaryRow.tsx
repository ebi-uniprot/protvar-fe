import './PrimaryRow.css';
import {Fragment, lazy, Suspense} from "react";
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
import Spaces from "../../elements/Spaces";
import Tool from "../../elements/Tool";
import {caddScoreAttr, formatCaddScore} from "../../components/function/prediction/CaddScorePred";
import {amScoreAttr, formatAMScore} from "../../components/function/prediction/AlphaMissensePred";
import ProteinIcon from '../../../images/proteins.svg';
import StructureIcon from '../../../images/structures-3d.svg';
import PopulationIcon from '../../../images/human.svg';
import LoaderRow from "./LoaderRow";
import { ReactComponent as ChevronDownIcon } from "../../../images/chevron-down.svg"
import { ReactComponent as ChevronUpIcon } from "../../../images/chevron-up.svg"
import { EmptyElement } from "../../../constants/ConstElement";
import {aaChangeTip, CanonicalIcon, getProteinName} from "./AlternateIsoFormRow";
import {
  Gene,
  Isoform,
  VariantInput, GenomicVariant
} from "../../../types/MappingResponse";
import {rowBg} from "./ResultTable";

const StructuralDetail = lazy(() => import(/* webpackChunkName: "StructuralDetail" */ "../../components/structure/StructuralDetail"));
const PopulationDetail = lazy(() => import(/* webpackChunkName: "PopulationDetail" */ "../../components/population/PopulationDetail"));
const FunctionalDetail = lazy(() => import(/* webpackChunkName: "FunctionalDetail" */ "../../components/function/FunctionalDetail"));

export const getIdUrl = (id:string) => {
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

function getSignificancesButton(rowKey: string, buttonLabel: string, canonical: boolean | undefined,
  annotationExpanded: string, toggleAnnotation: StringVoidFun) {
  if (!canonical) return EmptyElement;
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

export const aaChangeStr = (ref: string, alt: string) => {
  return `${ref}/${alt}`
}

export const getEnsemblChrUrl = (chr: string) => {
  return ENSEMBL_CHRM_URL + chr;
}

export const getEnsemblViewUrl = (chr: string, pos: number) => {
  return ENSEMBL_VIEW_URL + chr + ':' + pos + '-' + pos;
}

export const getNewPrimaryRow = (isoformKey: string, isoformGroup: string, isoformGroupExpanded: string,
                                 index: number, genomicVariant: GenomicVariant, input: VariantInput,
                                 gene: Gene, isoform: Isoform,
                                 toggleIsoFormGroup: StringVoidFun,
                                 annotationExpanded: string, toggleAnnotation: StringVoidFun,
                                 hasAltIsoForm: boolean, stdColor: boolean) => {

  const caddAttr = caddScoreAttr(gene.caddScore?.toString())
  const amAttr = amScoreAttr(isoform.amScore?.amClass)
  const genomicVariantStr = `${genomicVariant.chromosome}-${genomicVariant.position}-${genomicVariant.refBase}-${genomicVariant.altBase}`

  let strand = gene.reverseStrand ? '(-)' : '(+)';
  let codon = isoform.refCodon + '/' + isoform.variantCodon;
  if (!codon) {
    strand = '';
  }

  const highlightColor = "#F8EDF0";
  const genomicStyle = { backgroundColor: input.type === "GENOMIC" ? highlightColor : "" };
  const proteinStyle = { backgroundColor: (input.type === "PROTEIN" || input.type === "CODING_DNA") ? highlightColor : "" };
  const idStyle = { backgroundColor: input.type === "VARIANT_ID" ? highlightColor : "" };

  const functionalKey = 'functional-' + isoformKey;
  const structuralKey = 'structural-' + isoformKey;
  const populationKey = 'population-' + isoformKey;

  let aaChange = aaChangeStr(isoform.refAA, isoform.variantAA)

  const enspMap = new Map<string, string[]>();

  isoform.transcripts?.forEach(({ ensp, enst }) => {
    if (!enspMap.has(ensp)) {
      enspMap.set(ensp, []);
    }
    enspMap.get(ensp)!.push(enst);
  });

  const ensp = Array.from(enspMap.entries()).map(([ensp, ensts]) => ({
    ensp,
    ensts: ensts.join(','),
  }));

  const idValue = getIdValue(input);

  return <Fragment key={isoformKey}>
    <tr style={rowBg(index)} title={'Input: ' + input.inputStr}>
      <td style={genomicStyle}>
        <Tool tip="Click to see the a summary for this chromosome from Ensembl" pos="up-left">
          <a href={getEnsemblChrUrl(genomicVariant.chromosome)} target="_blank" rel="noopener noreferrer">
            {genomicVariant.chromosome}
          </a>
        </Tool>
      </td>
      <td style={genomicStyle}>
        <Tool tip="Click to see the region detail for this genomic coordinate from Ensembl" pos="up-left">
          {(input.type === "GENOMIC" && 'isLiftedFrom37' in input && input.isLiftedFrom37) && <span className="h37">37&rarr;38</span>}
          <a href={getEnsemblViewUrl(genomicVariant.chromosome, genomicVariant.position)} target="_blank" rel="noopener noreferrer">
            {genomicVariant.position}
          </a>
        </Tool>
      </td>
      <td style={idStyle}><Tool tip="Variant ID provided by the user">
        { idValue && <a href={getIdUrl(idValue)} target="_blank" rel="noopener noreferrer">
          {idValue}
        </a>
      }
      </Tool></td>
      <td><Tool tip={ALLELE.get(genomicVariant.refBase)}>{genomicVariant.refBase}</Tool></td>
      <td><Tool tip={ALLELE.get(gene.altAllele)}>{gene.altAllele}</Tool></td>
      <td>
        <Tool tip="Click here for gene information from Ensembl">
          <a href={ENSEMBL_GENE_URL + gene.geneName} target="_blank" rel="noopener noreferrer">{gene.geneName}</a>
        </Tool>
      </td>
      <td>
        <div className="flex">
          {codon}<Spaces /><Tool tip={"Codon change in " + (strand === "(+)" ? " positive" : "negative") + "-sense strand gene"}>{strand}</Tool>
        </div>
      </td>
      <td>
        <Tool className="score-box" style={{ backgroundColor: (stdColor ? caddAttr?.stdColor : caddAttr?.color) }} tip={`${caddAttr?.range} ${caddAttr?.text}`}>
          <a href={CADD_INFO_URL} target="_blank" rel="noopener noreferrer" style={{color: 'white'}}>
            {formatCaddScore(gene.caddScore?.toString())}
          </a>
        </Tool>
      </td>
      <td style={proteinStyle}>
        <div className="flex">
          <CanonicalIcon isCanonical={isoform.canonical}/>
          <Spaces/>
          <Tool tip="Click to see the UniProt page for this accession">
            <a href={UNIPROT_ACCESSION_URL + isoform.accession} target="_blank"
               rel="noopener noreferrer">{isoform.accession}</a>
          </Tool>
          {hasAltIsoForm && <>
            <Spaces/>
            <Tool
              el="button"
              onClick={() => toggleIsoFormGroup(isoformGroup) }
              className="button button--toggle-isoforms"
              tip={isoformGroupExpanded !== isoformGroup ? "Show more isoforms" : "Hide isoforms"}
            >
              {isoformGroupExpanded !== isoformGroup ?
                <ChevronDownIcon className="toggle-isoforms"/> : <ChevronUpIcon className="toggle-isoforms"/>}
            </Tool>
          </>}
        </div>
      </td>
      <td>
        <Tool tip={isoform.proteinName}>{getProteinName(isoform.proteinName)}</Tool>
      </td>
      <td style={proteinStyle}><Tool tip="The amino acid position in this isoform">{isoform.isoformPosition}</Tool></td>
      <td><Tool tip={aaChangeTip(aaChange)}>{aaChange}</Tool></td>
      <td><Tool tip={CONSEQUENCES.get(isoform.consequences!)} pos="up-right">{isoform.consequences}</Tool></td>
      <td>
        <Tool className="score-box" style={{ backgroundColor: (stdColor ? amAttr?.stdColor : amAttr?.color) }} tip={`${isoform.amScore?.amPathogenicity} ${amAttr?.text}`}>
          <a href={AM_INFO_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
            {formatAMScore(isoform.amScore)}
          </a>
        </Tool>
      </td>
      <td>
        <div className="flex">
          {!isoform.canonical && <><br/><br/></>}
          {getSignificancesButton(functionalKey, 'FUN', isoform.canonical, annotationExpanded, toggleAnnotation)}
          {getSignificancesButton(populationKey, 'POP', isoform.canonical, annotationExpanded, toggleAnnotation)}
          {getSignificancesButton(structuralKey, 'STR', isoform.canonical, annotationExpanded, toggleAnnotation)}
        </div>
      </td>
    </tr>

    {populationKey === annotationExpanded &&
      <Suspense fallback={<LoaderRow />}>
        <PopulationDetail annotation={annotationExpanded} populationObservationsUri={isoform.populationObservationsUri!} variantAA={isoform.variantAA!} genomicVariant={genomicVariantStr} />
      </Suspense>
    }
    {structuralKey === annotationExpanded &&
      <Suspense fallback={<LoaderRow />}>
        <StructuralDetail annotation={annotationExpanded} isoFormAccession={isoform.accession!} aaPosition={isoform.isoformPosition!} variantAA={isoform.variantAA!} proteinStructureUri={isoform.proteinStructureUri!}/>
      </Suspense>
    }
    {functionalKey === annotationExpanded &&
      <Suspense fallback={<LoaderRow />}>
        <FunctionalDetail
          annotation={annotationExpanded}
          caddScore={gene.caddScore?.toString()}
          amScore={isoform.amScore}
          refAA={isoform.refAA!} variantAA={isoform.variantAA!}
          ensg={gene.ensg!} ensp={ensp!} referenceFunctionUri={isoform.referenceFunctionUri!} />
      </Suspense>
    }

  </Fragment>
};

export const getIdValue = (input?: VariantInput) => {
  if (input?.type === "VARIANT_ID") return input.inputStr;
  if (input?.type === "GENOMIC" && 'id' in input) return input.id;
  return null;
};
/*
export const hasIdValue = (input?: VariantInput) => {
  if (!input) return false;
  return (input?.type === "VARIANT_ID" || (input?.type === "GENOMIC" && 'id' in input));
};*/