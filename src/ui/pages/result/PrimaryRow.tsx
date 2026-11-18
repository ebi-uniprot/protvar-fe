import React, { lazy, Suspense, useContext, useState } from "react";
import { Activity, BookOpen, Box, Users } from 'lucide-react';
import { AppContext } from '../../App';
import { HelpContent } from '../../components/help/HelpContent';
import { ShareAnnotationIcon } from '../../components/common/ShareLink';
import { Icon } from '../../elements/Icon';
import { StringVoidFun } from "../../../constants/CommonTypes";
import {
  CADD_INFO_URL, AM_INFO_URL,
  CLINVAR_RCV_URL, CLINVAR_VCV_URL, COSMIC_URL, UNIPROT_VAR_URL,
  DBSNP_URL,
  getEnsemblIdUrl,
  getEnsemblViewUrl,
  UNIPROT_ACCESSION_URL
} from "../../../constants/ExternalUrls";
import Tool from "../../elements/Tooltip";
import { TextLink } from "../../components/common/Link";
import { caddScoreAttr, formatCaddScore } from "../../components/function/prediction/CaddScorePred";
import { aviScoreAttr, AVI_SCORE_ATTR, genomeWideRank } from "../../components/function/prediction/AviScorePred";
import { pangolinAttr, pangolinDetail, PANGOLIN_SCORE_ATTR } from "../../components/function/prediction/PangolinPred";
import { amScoreAttr, formatAMScore } from "../../components/function/prediction/AlphaMissensePred";
import { formatPopEveScore, getPopEveColor, getPopEveClass, POPEVE_SCORE_ATTR } from "../../components/function/prediction/PopEvePred";
import LoaderRow from "./LoaderRow";
import { ReactComponent as ChevronDownIcon } from "../../../images/chevron-down.svg";
import { ReactComponent as ChevronUpIcon } from "../../../images/chevron-up.svg";
import { EmptyElement } from "../../../constants/ConstElement";
import { aaChangeTip, CanonicalIcon, ConsequenceBadge, getProteinName, getConsequenceFullName } from "./AlternateIsoFormRow";
import { Gene, Isoform, VariantInput, GenomicVariant } from "../../../types/MappingResponse";
import { ColumnGroup, ColumnId, inGroup, ResultColumn, visibleColumns } from "../../../constants/resultColumns";

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
    if (upper.startsWith("VAR_")) return UNIPROT_VAR_URL + upper + ".html";
  }
  return "";
};

// the alt is unknown (no readable codon, PV-113): shown as "?"
export const aaChangeStr = (ref: string, alt?: string) => `${ref}/${alt ?? '?'}`;

// The three annotation panels, in order. In the row they're icon buttons (their names in the tooltip, the first-row
// hint and the open panel's tabs, so Population and Structure are discoverable)
const ANNOTATIONS = {
  FUN: { name: 'Function', tip: 'Functional annotations', Icon: Activity, help: 'function',
         moreHelp: [{ name: 'predictions', title: 'Predictions' }, { name: 'feature-ranking', title: 'Feature ranking' }] },
  POP: { name: 'Population', tip: 'Population observations', Icon: Users, help: 'population', moreHelp: [] },
  STR: { name: 'Structure', tip: '3D structure', Icon: Box, help: 'structure',
         moreHelp: [{ name: 'predictions', section: 'predictions:structure', title: 'Predictions' }] },
} as const;
type AnnotationType = keyof typeof ANNOTATIONS;

function AnnotationButton(props: {
  rowKey: string;
  label: AnnotationType;
  canonical: boolean | undefined;
  annotationExpanded: string;
  toggleAnnotation: StringVoidFun;
}) {
  if (!props.canonical) return EmptyElement;

  const isActive = props.rowKey === props.annotationExpanded;
  const { name, tip, Icon: AnnIcon } = ANNOTATIONS[props.label];

  return (
    <Tool el="button" tip={`${name}: ${tip.toLowerCase()} (click to ${isActive ? 'close' : 'open'})`} pos="up-right"
      onClick={() => props.toggleAnnotation(props.rowKey)}
      className={`annotation-btn${isActive ? ' active' : ''}`}
      aria-pressed={isActive} aria-label={name}
    >
      <AnnIcon size={18} strokeWidth={1.75} aria-hidden="true" />
    </Tool>
  );
}

/**
 * Toggle handler for the isoform-group chevron. The optional gvStr lets the
 * parent ResultTable kick off a single-variant lookup on first expand when
 * isoforms weren't pre-fetched (filter-only browse).
 */
export type ToggleIsoformGroupFn = (key: string, gvStr?: string) => void;

export const getNewPrimaryRow = (
  isoformKey: string,
  isoformGroup: string,
  isoformGroupExpanded: string,
  index: number,
  genomicVariant: GenomicVariant,
  input: VariantInput,
  gene: Gene,
  isoform: Isoform,
  toggleIsoFormGroup: ToggleIsoformGroupFn,
  annotationExpanded: string,
  toggleAnnotation: StringVoidFun,
  hasAltIsoForm: boolean,
  stdColor: boolean,
  altIsoforms: Isoform[] = [],
  isLoadingIsoforms: boolean = false,
  cols: ResultColumn[] = visibleColumns(),
  noteMarker?: React.ReactNode, // corner marker for the input's notes (first row of the input only)
  altCount?: number,            // other isoforms, when known (filter-only browse loads them on demand)
) => {
  const caddAttr = caddScoreAttr(gene.caddScore?.toString());
  const amAttr   = amScoreAttr(isoform.amScore?.amClass);

  // Combined genomic position: chr-pos-ref-alt
  const genomicPos = `${genomicVariant.chromosome}-${genomicVariant.position}-${genomicVariant.refBase}-${genomicVariant.altBase}`;

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
  const aaChangeFormatted = `${isoform.refAA}${isoform.isoformPosition}${isoform.variantAA ?? '?'}`;

  const idValue = getIdValue(input);
  const rowClass = `result-row ${index % 2 === 0 ? 'row-even' : 'row-odd'}${noteMarker ? ' has-note' : ''}`;

  const cells: Record<ColumnId, React.ReactNode> = {
        // User ID
        id: <span key="id" className={isIdInput ? 'cell-id-input' : ''}>
          {idValue && (
            <Tool tip="Variant ID provided by the user">
              <TextLink url={getIdUrl(idValue)} text={idValue} />
            </Tool>
          )}
        </span>,

        // Genomic position (chr-pos-ref-alt)
        position: <span key="position" className={`cell-genomic${isGenomicInput ? ' cell-genomic-input' : ''}`}>
          {isGenomicInput && 'isLiftedFrom37' in input && input.isLiftedFrom37 && (
            <Tool el="span" tip={`Converted from GRCh37: you entered "${input.inputStr}"`} className="lift-badge">37&rarr;38</Tool>
          )}
          <Tool tip={`Genomic coordinate (chr-pos-ref-alt) for input "${input.inputStr}" — click to view the region in Ensembl`}>
            <TextLink url={getEnsemblViewUrl(genomicVariant.chromosome, genomicVariant.position)} text={genomicPos} />
          </Tool>
        </span>,

        // Gene (linked to Ensembl when ensg available)
        gene: <span key="gene" className="card-sep cell-gene">
          {gene.geneName && (
            gene.ensg
              ? <Tool tip="Gene — click to view in Ensembl"><TextLink url={getEnsemblIdUrl(gene.ensg)} text={gene.geneName} /></Tool>
              : <span>{gene.geneName}</span>
          )}
        </span>,

        // codon (mRNA / coding strand) + strand. card-sep adds dot separator before it in mobile.
        codon: <span key="codon" className="card-sep cell-codon">
          {codon && (
            <div className="flex">
              <span className="cell-mono">{codon}</span>
              <Tool tip={`mRNA codon change ${codon} on the ${gene.reverseStrand ? 'negative' : 'positive'}-sense strand`}>
                <span className="strand-badge">{gene.reverseStrand ? '−' : '+'}</span>
              </Tool>
            </div>
          )}
        </span>,

        // CADD v1.7 — empty span when no score lets the .na-badge:empty::after rule render the NA pill
        cadd: <span key="cadd" data-card-label="CADD" className="cell-cadd na-badge">
          {caddAttr && (
            <Tool
              className="score-box"
              style={{ backgroundColor: stdColor ? caddAttr.stdColor : caddAttr.color }}
              tip={`CADD ${formatCaddScore(gene.caddScore?.toString())} — ${caddAttr.text} (${caddAttr.range})`}
            >
              <a href={CADD_INFO_URL} target="_blank" rel="noopener noreferrer">
                {formatCaddScore(gene.caddScore?.toString())}
              </a>
            </Tool>
          )}
        </span>,

        // AlphaGenome Variant Impact (AVI): band by genome-wide rank (no published categories; see AviScorePred)
        avi: <span key="avi" data-card-label="AVI" className="cell-avi na-badge">
          {gene.aviScore != null && (() => {
            const attr = aviScoreAttr(gene.aviScore);
            return <Tool className="score-box"
                         style={{ backgroundColor: stdColor ? attr.stdColor : attr.color,
                                  color: !stdColor && attr === AVI_SCORE_ATTR[0] ? '#2e2257' : undefined }}
                         tip={`AVI ${gene.aviScore.toFixed(1)} — ${genomeWideRank(gene.aviScore)} (${attr.range})`}>
              {gene.aviScore.toFixed(1)}
            </Tool>;
          })()}
        </span>,

        // Pangolin splice prediction for this gene: max(gain, |loss|), coloured by the BE label (see PangolinPred)
        pangolin: <span key="pangolin" data-card-label="Pangolin" className="cell-pangolin na-badge">
          {gene.pangolin && (() => {
            const p = gene.pangolin;
            const attr = pangolinAttr(p);
            return <Tool className="score-box"
                         style={{ backgroundColor: stdColor ? attr.stdColor : attr.color,
                                  color: !stdColor && attr === PANGOLIN_SCORE_ATTR[0] ? '#0b3d39' : undefined }}
                         tip={`Pangolin ${p.score.toFixed(2)} — ${attr.text}${pangolinDetail(p) ? ` (${pangolinDetail(p)})` : ''}`}>
              {p.score.toFixed(2)}
            </Tool>;
          })()}
        </span>,

        // Isoform — toggle chevron + canonical icon + accession
        isoform: <span key="isoform" className={`isoform-cell ${isProteinInput ? 'cell-protein-input' : ''}`}>
          <CanonicalIcon isCanonical={isoform.canonical} accession={isoform.accession} sameAs={isoform.sameAs} />
          <Tool tip="Click to see the UniProt page for this accession">
            <TextLink url={UNIPROT_ACCESSION_URL + isoform.accession} text={isoform.accession} />
          </Tool>
          {hasAltIsoForm && (
            <Tool
              el="button"
              onClick={() => toggleIsoFormGroup(isoformGroup, genomicPos)}
              className="button button--toggle-isoforms"
              disabled={isLoadingIsoforms}
              tip={isLoadingIsoforms
                ? "Loading isoforms…"
                : (isoformGroupExpanded !== isoformGroup ? "Show more isoforms" : "Hide isoforms")}
            >
              {altCount ? `+${altCount}` : null}
              {isLoadingIsoforms
                ? <span className="toggle-isoforms-loading" aria-label="loading" />
                : (isoformGroupExpanded !== isoformGroup
                    ? <ChevronDownIcon className="toggle-isoforms" />
                    : <ChevronUpIcon  className="toggle-isoforms" />)}
            </Tool>
          )}
        </span>,

        // Protein name
        protein: <span key="protein" className="card-sep cell-protein-name">
          <Tool tip={isoform.proteinName}>{getProteinName(isoform.proteinName)}</Tool>
        </span>,

        // AA Change — card-sep adds dot separator before it in mobile
        aaChange: <span key="aaChange" className={`card-sep cell-mono cell-aa-change${isProteinInput ? ' cell-protein-input' : ''}`}>
          <Tool tip={aaChangeTip(aaChange)}>{aaChangeFormatted}</Tool>
        </span>,

        // Consequence(s)
        consequence: <span key="consequence" className="card-sep cell-consequence">
          <Tool tip={getConsequenceFullName(isoform.consequences)} pos="up-right"><ConsequenceBadge consequence={isoform.consequences} /></Tool>
        </span>,

        // popEVE
        popeve: <span key="popeve" className="cell-popeve na-badge" data-card-label="popEVE">
          {isoform.popEveScore && (
            <Tool
              className="score-box"
              style={{
                backgroundColor: stdColor
                  ? POPEVE_SCORE_ATTR[getPopEveClass(isoform.popEveScore.popeve)].stdColor
                  : getPopEveColor(isoform.popEveScore.popeve)
              }}
              tip={`popEVE ${formatPopEveScore(isoform.popEveScore)}`}
            >
              {formatPopEveScore(isoform.popEveScore)}
            </Tool>
          )}
        </span>,

        // AlphaMissense — same NA pattern as CADD
        am: <span key="am" data-card-label="AM" className="cell-am na-badge">
          {amAttr && (
            <Tool
              className="score-box"
              style={{ backgroundColor: stdColor ? amAttr.stdColor : amAttr.color }}
              tip={`AlphaMissense ${isoform.amScore?.amPathogenicity} — ${amAttr.text}`}
            >
              <a href={AM_INFO_URL} target="_blank" rel="noopener noreferrer">
                {formatAMScore(isoform.amScore)}
              </a>
            </Tool>
          )}
        </span>,

        // Annotation buttons
        details: <span key="details" className="details-cell">
          <AnnotationButton rowKey={functionalKey}  label="FUN" canonical={isoform.canonical} annotationExpanded={annotationExpanded} toggleAnnotation={toggleAnnotation} />
          <AnnotationButton rowKey={populationKey}  label="POP" canonical={isoform.canonical} annotationExpanded={annotationExpanded} toggleAnnotation={toggleAnnotation} />
          <AnnotationButton rowKey={structuralKey}  label="STR" canonical={isoform.canonical} annotationExpanded={annotationExpanded} toggleAnnotation={toggleAnnotation} />
        </span>,
  };
  const render = (group: ColumnGroup) => inGroup(cols, group).map(c => cells[c.id]);

  return (
    <div key={isoformKey} className={rowClass}>
      {noteMarker}

      {/* Card row 1 — genomic columns */}
      <div className="card-row card-row-genomic">
        {render('genomic')}
      </div>

      {/* Card row 2 — protein + scores */}
      <div className="card-row card-row-protein">
        {render('protein')}
      </div>

      {/* Mobile-only: alt isoform rows inline between protein and buttons.
          Desktop uses separate result-row-isoform elements; these are hidden there. */}
      {altIsoforms.map((altIso) => {
        const altAaChange = aaChangeStr(altIso.refAA, altIso.variantAA);
        const altAaFormatted = `${altIso.refAA}${altIso.isoformPosition}${altIso.variantAA ?? '?'}`;
        return (
          <div key={altIso.accession} className="card-isoform-inline">
            <span className="isoform-cell">
              <CanonicalIcon isCanonical={false} accession={altIso.accession} />
              <Tool tip="Click to see the UniProt page for this accession">
                <TextLink url={UNIPROT_ACCESSION_URL + altIso.accession} text={altIso.accession} />
              </Tool>
            </span>
            <span className="card-sep cell-protein-name">{getProteinName(altIso.proteinName)}</span>
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

      {/* Card row 3 — annotation buttons */}
      <div className="card-row card-row-details">
        {render('annotations')}
      </div>

    </div>
  );
};

export function AnnotationPanels({
  isoformKey,
  annotationExpanded,
  toggleAnnotation,
  showHint = false,
  gene,
  isoform,
  genomicVariantStr,
}: {
  isoformKey: string;
  annotationExpanded: string;
  toggleAnnotation: StringVoidFun;
  showHint?: boolean;   // the page's first row: point out the three annotations while none is open
  gene: Gene;
  isoform: Isoform;
  genomicVariantStr: string;
}) {
  const functionalKey  = 'functional-'  + isoformKey;
  const structuralKey  = 'structural-'  + isoformKey;
  const populationKey  = 'population-'  + isoformKey;
  const tabKeys: [AnnotationType, string][] = [['FUN', functionalKey], ['POP', populationKey], ['STR', structuralKey]];
  const isOpen = tabKeys.some(([, key]) => key === annotationExpanded);
  const openType = tabKeys.find(([, key]) => key === annotationExpanded)?.[0];

  // First-row hint: on every results page; dismissing hides it on this page only
  const [hintDismissed, setHintDismissed] = useState(false);
  const appState = useContext(AppContext);
  const dismissHint = () => setHintDismissed(true);

  const enspMap = new Map<string, string[]>();
  isoform.transcripts?.forEach(({ ensp, enst }) => {
    if (!enspMap.has(ensp)) enspMap.set(ensp, []);
    enspMap.get(ensp)!.push(enst);
  });
  const ensp = Array.from(enspMap.entries()).map(([ensp, ensts]) => ({ ensp, ensts: ensts.join(',') }));

  return (
    <>
      {/* One panel at a time, full width under the row: its tab bar (switch to another annotation of this variant,
          or close), then the open annotation */}
      {showHint && !isOpen && !hintDismissed && isoform.canonical && (
        <div className="explore-hint" role="note">
          <span>Explore variant:</span>
          {tabKeys.map(([type, key]) => {
            const { name, Icon: AnnIcon } = ANNOTATIONS[type];
            return (
              <button key={type} type="button" className="explore-hint-link" onClick={() => toggleAnnotation(key)}>
                <AnnIcon size={14} strokeWidth={1.75} aria-hidden="true" /> {name}
              </button>
            );
          })}
          <button type="button" className="explore-hint-close" onClick={dismissHint} aria-label="Dismiss" title="Dismiss">
            <Icon name="x" />
          </button>
        </div>
      )}
      {isOpen && (
        <div className="result-annotation">
          <div className="annotation-tabs">
            <div role="tablist" aria-label="Annotations" className="annotation-tablist">
              {tabKeys.map(([type, key]) => {
                const { name, Icon: AnnIcon } = ANNOTATIONS[type];
                return (
                  <button key={type} type="button" role="tab" aria-selected={key === annotationExpanded}
                          className={`annotation-tab${key === annotationExpanded ? ' active' : ''}`}
                          onClick={() => key !== annotationExpanded && toggleAnnotation(key)}>
                    <AnnIcon size={16} strokeWidth={1.75} aria-hidden="true" /> {name}
                  </button>
                );
              })}
            </div>
            <div className="annotation-tabs-actions">
              {openType && (
                <button type="button" className="annotation-help" title={`Help: ${ANNOTATIONS[openType].name}`}
                        onClick={() => appState.updateState('drawer', <HelpContent name={ANNOTATIONS[openType].help} />)}>
                  <BookOpen size={15} strokeWidth={1.75} aria-hidden="true" /> Help
                </button>
              )}
              {/* the tab's other help topics (Function: Predictions, Feature ranking; Structure: Predictions) */}
              {openType && ANNOTATIONS[openType].moreHelp.map((t: { name: string; section?: string; title: string }) => (
                <button key={t.title} type="button" className="annotation-help-link"
                        onClick={() => appState.updateState('drawer', <HelpContent name={t.name} section={t.section} />)}>
                  {t.title}
                </button>
              ))}
              <ShareAnnotationIcon annotation={annotationExpanded} withText />
              <button type="button" className="annotation-tabs-close" onClick={() => toggleAnnotation(annotationExpanded)}
                      aria-label="Close annotations">
                <Icon name="x" /> Close
              </button>
            </div>
          </div>
          <Suspense fallback={<LoaderRow />}>
            {populationKey === annotationExpanded && (
              <PopulationData
                annotation={annotationExpanded}
                populationObservationsUri={isoform.populationObservationsUri!}
                variantAA={isoform.variantAA!}
                genomicVariant={genomicVariantStr}
              />
            )}
            {structuralKey === annotationExpanded && (
              <StructureData
                annotation={annotationExpanded}
                isoFormAccession={isoform.accession!}
                aaPosition={isoform.isoformPosition!}
                variantAA={isoform.variantAA!}
                proteinStructureUri={isoform.proteinStructureUri!}
              />
            )}
            {functionalKey === annotationExpanded && (
              <FunctionalData
                annotation={annotationExpanded}
                caddScore={gene.caddScore?.toString()}
                aviScore={gene.aviScore?.toString()}
                pangolin={gene.pangolin}
                amScore={isoform.amScore}
                refAA={isoform.refAA!}
                variantAA={isoform.variantAA!}
                ensg={gene.ensg!}
                ensp={ensp!}
                referenceFunctionUri={isoform.referenceFunctionUri!}
                referencePredictionUri={isoform.referencePredictionUri}
              />
            )}
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
