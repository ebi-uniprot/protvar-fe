import { lazy, Suspense } from "react";
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
import Tool from "../../elements/Tool";
import { TextLink } from "../../components/common/Link";
import { caddScoreAttr, formatCaddScore } from "../../components/function/prediction/CaddScorePred";
import { amScoreAttr, formatAMScore } from "../../components/function/prediction/AlphaMissensePred";
import { formatPopEveScore, getPopEveColor, getPopEveClass, POPEVE_SCORE_ATTR } from "../../components/function/prediction/PopEvePred";
import ProteinIcon from '../../../images/proteins.svg';
import StructureIcon from '../../../images/structures-3d.svg';
import PopulationIcon from '../../../images/human.svg';
import LoaderRow from "./LoaderRow";
import { ReactComponent as ChevronDownIcon } from "../../../images/chevron-down.svg";
import { ReactComponent as ChevronUpIcon } from "../../../images/chevron-up.svg";
import { EmptyElement } from "../../../constants/ConstElement";
import { aaChangeTip, CanonicalIcon, ConsequenceBadge, getProteinName, getConsequenceFullName } from "./AlternateIsoFormRow";
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
  altIsoforms: Isoform[] = [],
) => {
  const caddAttr = caddScoreAttr(gene.caddScore?.toString());
  const amAttr   = amScoreAttr(isoform.amScore?.amClass);

  // Combined genomic position: chr-pos-ref-alt
  const genomicPos = `${genomicVariant.chromosome}-${genomicVariant.position}-${genomicVariant.refBase}-${genomicVariant.altBase}`;

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

  const idValue = getIdValue(input);
  const rowClass = `result-row ${index % 2 === 0 ? 'row-even' : 'row-odd'}`;

  return (
    <div key={isoformKey} className={rowClass}>

      {/* Card row 1 — genomic (cols 1–4: ID, genomic-pos, codon, CADD) */}
      <div className="card-row card-row-genomic">
        {/* 1: User ID */}
        <span className={isIdInput ? 'cell-id-input' : ''}>
          {idValue && (
            <Tool tip="Variant ID provided by the user">
              <TextLink url={getIdUrl(idValue)} text={idValue} />
            </Tool>
          )}
        </span>

        {/* 2: Genomic position (chr-pos-ref-alt) */}
        <span className={`cell-genomic${isGenomicInput ? ' cell-genomic-input' : ''}`} title={`Input: ${input.inputStr}`}>
          <Tool tip="Click to see region detail from Ensembl" pos="up-left">
            {isGenomicInput && 'isLiftedFrom37' in input && input.isLiftedFrom37 && (
              <span className="h37">37&rarr;38</span>
            )}
            <TextLink url={getEnsemblViewUrl(genomicVariant.chromosome, genomicVariant.position)} text={genomicPos} />
          </Tool>
        </span>

        {/* 3: Codon (strand) — card-sep adds dot separator before it in mobile */}
        <span className="card-sep">
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
        <span data-card-label="CADD">
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
      </div>

      {/* Card row 2 — protein + scores (cols 5–10: isoform, name, aa-change, conseq, popEVE, AM) */}
      <div className="card-row card-row-protein">
        {/* 5: Isoform — toggle chevron + canonical icon + accession */}
        <span className={`isoform-cell ${isProteinInput ? 'cell-protein-input' : ''}`}>
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
          <CanonicalIcon isCanonical={isoform.canonical} />
          <Tool tip="Click to see the UniProt page for this accession">
            <TextLink url={UNIPROT_ACCESSION_URL + isoform.accession} text={isoform.accession} />
          </Tool>
        </span>

        {/* 6: Protein name */}
        <span className="card-sep">
          <Tool tip={isoform.proteinName}>{getProteinName(isoform.proteinName)}</Tool>
        </span>

        {/* 7: AA Change — card-sep adds dot separator before it in mobile */}
        <span className={`card-sep cell-aa-change${isProteinInput ? ' cell-protein-input' : ''}`}>
          <Tool tip={aaChangeTip(aaChange)}>{aaChangeFormatted}</Tool>
        </span>

        {/* 8: Consequence(s) */}
        <span className="card-sep cell-consequence">
          <Tool tip={getConsequenceFullName(isoform.consequences)} pos="up-right"><ConsequenceBadge consequence={isoform.consequences} /></Tool>
        </span>

        {/* 9: popEVE */}
        <span className="cell-popeve" data-card-label="popEVE">
          {isoform.popEveScore && (
            <Tool
              className="score-box"
              style={{
                backgroundColor: stdColor
                  ? POPEVE_SCORE_ATTR[getPopEveClass(isoform.popEveScore.popeve)].stdColor
                  : getPopEveColor(isoform.popEveScore.popeve)
              }}
              tip={`${formatPopEveScore(isoform.popEveScore)} popEVE`}
            >
              {formatPopEveScore(isoform.popEveScore)}
            </Tool>
          )}
        </span>

        {/* 10: AlphaMissense */}
        <span data-card-label="AM">
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
      </div>

      {/* Mobile-only: alt isoform rows inline between protein and buttons.
          Desktop uses separate result-row-isoform elements; these are hidden there. */}
      {altIsoforms.map((altIso) => {
        const altAaChange = aaChangeStr(altIso.refAA, altIso.variantAA);
        const altAaFormatted = `${altIso.refAA}${altIso.isoformPosition}${altIso.variantAA}`;
        return (
          <div key={altIso.accession} className="card-isoform-inline">
            <span className="isoform-cell">
              <CanonicalIcon isCanonical={false} />
              <Tool tip="Click to see the UniProt page for this accession">
                <TextLink url={UNIPROT_ACCESSION_URL + altIso.accession} text={altIso.accession} />
              </Tool>
            </span>
            <span className="card-sep">{getProteinName(altIso.proteinName)}</span>
            <span className="card-sep">
              <Tool tip={aaChangeTip(altAaChange)}>{altAaFormatted}</Tool>
            </span>
            <span className="card-sep cell-consequence">
              <Tool tip={getConsequenceFullName(altIso.consequences)} pos="up-right">
                <ConsequenceBadge consequence={altIso.consequences} />
              </Tool>
            </span>
          </div>
        );
      })}

      {/* Card row 3 — annotation buttons (col 11) */}
      <div className="card-row card-row-details">
        {/* 11: Annotation buttons */}
        <span className="details-cell">
          <AnnotationButton rowKey={functionalKey}  label="FUN" canonical={isoform.canonical} annotationExpanded={annotationExpanded} toggleAnnotation={toggleAnnotation} />
          <AnnotationButton rowKey={populationKey}  label="POP" canonical={isoform.canonical} annotationExpanded={annotationExpanded} toggleAnnotation={toggleAnnotation} />
          <AnnotationButton rowKey={structuralKey}  label="STR" canonical={isoform.canonical} annotationExpanded={annotationExpanded} toggleAnnotation={toggleAnnotation} />
        </span>
      </div>

    </div>
  );
};

export function AnnotationPanels({
  isoformKey,
  annotationExpanded,
  gene,
  isoform,
  genomicVariantStr,
}: {
  isoformKey: string;
  annotationExpanded: string;
  gene: Gene;
  isoform: Isoform;
  genomicVariantStr: string;
}) {
  const functionalKey  = 'functional-'  + isoformKey;
  const structuralKey  = 'structural-'  + isoformKey;
  const populationKey  = 'population-'  + isoformKey;

  const enspMap = new Map<string, string[]>();
  isoform.transcripts?.forEach(({ ensp, enst }) => {
    if (!enspMap.has(ensp)) enspMap.set(ensp, []);
    enspMap.get(ensp)!.push(enst);
  });
  const ensp = Array.from(enspMap.entries()).map(([ensp, ensts]) => ({ ensp, ensts: ensts.join(',') }));

  return (
    <>
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
    </>
  );
}

export const getIdValue = (input?: VariantInput) => {
  let val: string | null | undefined = null;
  if (input?.type === "VARIANT_ID") val = input.inputStr;
  else if (input?.type === "GENOMIC" && 'id' in input) val = input.id as string;
  return val && val !== '.' ? val : null;
};
