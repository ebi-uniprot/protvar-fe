import './PrimaryRow.css';
import { Fragment, lazy, Suspense } from "react";
import { StringVoidFun } from "../../../constants/CommonTypes";
import {
  CADD_INFO_URL, AM_INFO_URL,
  CLINVAR_RCV_URL, CLINVAR_VCV_URL, COSMIC_URL,
  DBSNP_URL,
  ENSEMBL_GENE_URL,
  ENSEMBL_CHRM_URL,
  ENSEMBL_VIEW_URL,
  UNIPROT_ACCESSION_URL
} from "../../../constants/ExternalUrls";
import { CONSEQUENCES } from "../../../constants/SearchResultTable";
import Tool from "../../elements/Tool";
import { TextLink } from "../../components/common/Link";
import { caddScoreAttr, formatCaddScore } from "../../components/function/prediction/CaddScorePred";
import { amScoreAttr, formatAMScore } from "../../components/function/prediction/AlphaMissensePred";
import ProteinIcon from '../../../images/proteins.svg';
import StructureIcon from '../../../images/structures-3d.svg';
import PopulationIcon from '../../../images/human.svg';
import LoaderRow from "./LoaderRow";
import { ReactComponent as ChevronDownIcon } from "../../../images/chevron-down.svg";
import { ReactComponent as ChevronUpIcon } from "../../../images/chevron-up.svg";
import { EmptyElement } from "../../../constants/ConstElement";
import { aaChangeTip, CanonicalIcon, ConsequenceBadge, getProteinName } from "./AlternateIsoFormRow";
import { Gene, Isoform, VariantInput, GenomicVariant } from "../../../types/MappingResponse";

const StructureData   = lazy(() => import(/* webpackChunkName: "StructureData"   */ "../../components/structure/./StructureData"));
const PopulationData  = lazy(() => import(/* webpackChunkName: "PopulationData"  */ "../../components/population/./PopulationData"));
const FunctionalData  = lazy(() => import(/* webpackChunkName: "FunctionalData"  */ "../../components/function/./FunctionalData"));

export const getIdUrl = (id: string) => {
  if (id) {
    const lower = id.toLowerCase();
    const upper = id.toUpperCase();
    if (lower.startsWith("rs"))   return DBSNP_URL + id;
    if (upper.startsWith("RCV"))  return CLINVAR_RCV_URL + id;
    if (upper.startsWith("VCV"))  return CLINVAR_VCV_URL + id;
    if (upper.startsWith("COSV") || upper.startsWith("COSM") || upper.startsWith("COSN")) return COSMIC_URL + id;
  }
  return "";
};

export const aaChangeStr = (ref: string, alt: string) => `${ref}/${alt}`;

export const getEnsemblChrUrl  = (chr: string) => ENSEMBL_CHRM_URL + chr;
export const getEnsemblViewUrl = (chr: string, pos: number) => ENSEMBL_VIEW_URL + chr + ':' + pos + '-' + pos;

function AnnotationButton(props: {
  rowKey: string;
  label: 'FUN' | 'POP' | 'STR';
  canonical: boolean | undefined;
  annotationExpanded: string;
  toggleAnnotation: StringVoidFun;
}) {
  if (!props.canonical) return EmptyElement;

  const isActive = props.rowKey === props.annotationExpanded;
  const btnClass = isActive ? 'button click-icon-btn significance' : 'button click-icon-btn';

  let tip = "Click for functional information";
  let icon = <img src={ProteinIcon} className="click-icon" alt="protein icon" />;
  if (props.label === 'POP') {
    tip  = "Click for population observation";
    icon = <img src={PopulationIcon} className="click-icon" alt="population icon" />;
  } else if (props.label === 'STR') {
    tip  = "Click for 3D structure";
    icon = <img src={StructureIcon} className="click-icon" alt="structure icon" />;
  }

  return (
    <Tool el="button" tip={tip} pos="up-right"
      onClick={() => props.toggleAnnotation(props.rowKey)}
      className={btnClass}
    >
      {icon}
    </Tool>
  );
}

export const getNewPrimaryRow = (
  isoformKey: string,
  isoformGroup: string,
  isoformGroupExpanded: string,
  index: number,
  genomicVariant: GenomicVariant,
  input: VariantInput,
  gene: Gene,
  isoform: Isoform,
  toggleIsoFormGroup: StringVoidFun,
  annotationExpanded: string,
  toggleAnnotation: StringVoidFun,
  hasAltIsoForm: boolean,
  stdColor: boolean,
) => {
  const caddAttr = caddScoreAttr(gene.caddScore?.toString());
  const amAttr   = amScoreAttr(isoform.amScore?.amClass);

  // Combined genomic position: chr-pos-ref-alt
  const genomicPos = `${genomicVariant.chromosome}-${genomicVariant.position}-${genomicVariant.refBase}-${genomicVariant.altBase}`;
  const genomicVariantStr = genomicPos; // reused for annotation URIs

  const strand = gene.reverseStrand ? '(-)' : '(+)';
  const codon  = isoform.refCodon && isoform.variantCodon
    ? `${isoform.refCodon}/${isoform.variantCodon}`
    : '';

  // Input type highlighting
  const isGenomicInput  = input.type === "GENOMIC";
  const isProteinInput  = input.type === "PROTEIN" || input.type === "CODING_DNA";
  const isIdInput       = input.type === "VARIANT_ID";

  const functionalKey  = 'functional-'  + isoformKey;
  const structuralKey  = 'structural-'  + isoformKey;
  const populationKey  = 'population-'  + isoformKey;

  // AA change in Ala205Pro format
  const aaChange = aaChangeStr(isoform.refAA, isoform.variantAA);
  const aaChangeFormatted = `${isoform.refAA}${isoform.isoformPosition}${isoform.variantAA}`;

  const enspMap = new Map<string, string[]>();
  isoform.transcripts?.forEach(({ ensp, enst }) => {
    if (!enspMap.has(ensp)) enspMap.set(ensp, []);
    enspMap.get(ensp)!.push(enst);
  });
  const ensp = Array.from(enspMap.entries()).map(([ensp, ensts]) => ({ ensp, ensts: ensts.join(',') }));

  const idValue = getIdValue(input);
  const rowClass = `result-row ${index % 2 === 0 ? 'row-even' : 'row-odd'}`;

  return (
    <Fragment key={isoformKey}>
      <div className={rowClass} title={`Input: ${input.inputStr}`}>

        {/* 1: User ID */}
        <span data-label="ID" className={isIdInput ? 'cell-id-input' : ''}>
          <Tool tip="Variant ID provided by the user">
            {idValue && <TextLink url={getIdUrl(idValue)} text={idValue} />}
          </Tool>
        </span>

        {/* 2: Genomic position (chr-pos-ref-alt) */}
        <span data-label="Genomic position" className={isGenomicInput ? 'cell-genomic-input' : ''}>
          <Tool tip="Click to see region detail from Ensembl" pos="up-left">
            {isGenomicInput && 'isLiftedFrom37' in input && input.isLiftedFrom37 && (
              <span className="h37">37&rarr;38</span>
            )}
            <TextLink url={getEnsemblViewUrl(genomicVariant.chromosome, genomicVariant.position)} text={genomicPos} />
          </Tool>
        </span>

        {/* 3: Codon (strand) */}
        <span data-label="Codon">
          {codon && (
            <div className="flex">
              {codon}&nbsp;
              <Tool tip={`Codon change in ${strand === '(+)' ? 'positive' : 'negative'}-sense strand gene`}>
                {strand}
              </Tool>
            </div>
          )}
        </span>

        {/* 4: CADD v1.7 */}
        <span data-label="CADD">
          <Tool
            className="score-box"
            style={{ backgroundColor: stdColor ? caddAttr?.stdColor : caddAttr?.color }}
            tip={`${caddAttr?.range} ${caddAttr?.text}`}
          >
            <a href={CADD_INFO_URL} target="_blank" rel="noopener noreferrer">
              {formatCaddScore(gene.caddScore?.toString())}
            </a>
          </Tool>
        </span>

        {/* 5: Isoform */}
        <span data-label="Isoform" className={`isoform-cell ${isProteinInput ? 'cell-protein-input' : ''}`}>
          <CanonicalIcon isCanonical={isoform.canonical} />
          <Tool tip="Click to see the UniProt page for this accession">
            <TextLink url={UNIPROT_ACCESSION_URL + isoform.accession} text={isoform.accession} />
          </Tool>
          {hasAltIsoForm && (
            <Tool
              el="button"
              onClick={() => toggleIsoFormGroup(isoformGroup)}
              className="button button--toggle-isoforms"
              tip={isoformGroupExpanded !== isoformGroup ? "Show more isoforms" : "Hide isoforms"}
            >
              {isoformGroupExpanded !== isoformGroup
                ? <ChevronDownIcon className="toggle-isoforms" />
                : <ChevronUpIcon  className="toggle-isoforms" />}
            </Tool>
          )}
        </span>

        {/* 6: Protein name */}
        <span data-label="Protein name">
          <Tool tip={isoform.proteinName}>{getProteinName(isoform.proteinName)}</Tool>
        </span>

        {/* 7: AA Change (Ala205Pro format) */}
        <span data-label="AA Change" className={isProteinInput ? 'cell-protein-input' : ''}>
          <Tool tip={aaChangeTip(aaChange)}>{aaChangeFormatted}</Tool>
        </span>

        {/* 8: Consequence(s) */}
        <span data-label="Consequence">
          <Tool tip={CONSEQUENCES.get(isoform.consequences!)} pos="up-right"><ConsequenceBadge consequence={isoform.consequences} /></Tool>
        </span>

        {/* 9: popEVE — empty until API provides this field */}
        <span data-label="popEVE"></span>

        {/* 10: AlphaMissense */}
        <span data-label="AlphaMissense">
          <Tool
            className="score-box"
            style={{ backgroundColor: stdColor ? amAttr?.stdColor : amAttr?.color }}
            tip={`${isoform.amScore?.amPathogenicity} ${amAttr?.text}`}
          >
            <a href={AM_INFO_URL} target="_blank" rel="noopener noreferrer">
              {formatAMScore(isoform.amScore)}
            </a>
          </Tool>
        </span>

        {/* 11: Click for details */}
        <span data-label="Details" className="details-cell">
          <AnnotationButton rowKey={functionalKey}  label="FUN" canonical={isoform.canonical} annotationExpanded={annotationExpanded} toggleAnnotation={toggleAnnotation} />
          <AnnotationButton rowKey={populationKey}  label="POP" canonical={isoform.canonical} annotationExpanded={annotationExpanded} toggleAnnotation={toggleAnnotation} />
          <AnnotationButton rowKey={structuralKey}  label="STR" canonical={isoform.canonical} annotationExpanded={annotationExpanded} toggleAnnotation={toggleAnnotation} />
        </span>

      </div>

      {/* Annotation panels — full width below the row */}
      {populationKey === annotationExpanded && (
        <div className="result-annotation">
          <Suspense fallback={<LoaderRow />}>
            <PopulationData
              annotation={annotationExpanded}
              populationObservationsUri={isoform.populationObservationsUri!}
              variantAA={isoform.variantAA!}
              genomicVariant={genomicVariantStr}
            />
          </Suspense>
        </div>
      )}
      {structuralKey === annotationExpanded && (
        <div className="result-annotation">
          <Suspense fallback={<LoaderRow />}>
            <StructureData
              annotation={annotationExpanded}
              isoFormAccession={isoform.accession!}
              aaPosition={isoform.isoformPosition!}
              variantAA={isoform.variantAA!}
              proteinStructureUri={isoform.proteinStructureUri!}
            />
          </Suspense>
        </div>
      )}
      {functionalKey === annotationExpanded && (
        <div className="result-annotation">
          <Suspense fallback={<LoaderRow />}>
            <FunctionalData
              annotation={annotationExpanded}
              caddScore={gene.caddScore?.toString()}
              amScore={isoform.amScore}
              refAA={isoform.refAA!}
              variantAA={isoform.variantAA!}
              ensg={gene.ensg!}
              ensp={ensp!}
              referenceFunctionUri={isoform.referenceFunctionUri!}
            />
          </Suspense>
        </div>
      )}
    </Fragment>
  );
};

export const getIdValue = (input?: VariantInput) => {
  let val: string | null | undefined = null;
  if (input?.type === "VARIANT_ID") val = input.inputStr;
  else if (input?.type === "GENOMIC" && 'id' in input) val = input.id as string;
  return val && val !== '.' ? val : null;
};
