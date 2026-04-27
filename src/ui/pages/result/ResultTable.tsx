import React, { useContext, useEffect, useState } from "react";
import { PagedMappingResponse } from "../../../types/PagedMappingResponse";
import { Message, GenomicVariant, Isoform } from "../../../types/MappingResponse";
import { StringVoidFun } from "../../../constants/CommonTypes";
import { getAlternateIsoFormRow } from "./AlternateIsoFormRow";
import { getNewPrimaryRow, AnnotationPanels, ToggleIsoformGroupFn } from "./PrimaryRow";
import { singleVariant } from "../../../services/ProtVarService";
import { AppContext } from "../../App";
import MsgRow from "./MsgRow";
import Tool from "../../elements/Tool";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  parseAnnotationParam,
  buildAnnotationKey,
  buildAnnotationParam,
  parseAnnotationKey,
  clearAnnotationSpecificParams
} from "./annotationUrl";

interface ResultTableProps {
  data: PagedMappingResponse | null;
  // True when the BE response only includes canonical isoforms (filter-only
  // browse). The chevron then triggers a single-variant lookup on first
  // expand to fetch the alt-isoform list on demand.
  lazyIsoforms?: boolean;
}

function ResultTable(props: ResultTableProps) {
  const stdColor = useContext(AppContext).stdColor;
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isoformGroupExpanded, setIsoformGroupExpanded] = useState('');
  const [annotationExpanded, setAnnotationExpanded] = useState('');
  // Lazy-fetched isoform lists, keyed "${gvStr}|${geneName}".
  // Replaces gene.isoforms during render when present. Network-level
  // dedup is handled by axios-cache-interceptor on singleVariant().
  const [fetchedIsoforms, setFetchedIsoforms] = useState<Record<string, Isoform[]>>({});
  // True while a single-variant fetch is in flight. Keyed by gvStr —
  // one request per genomic variant covers all genes at that position.
  const [loadingVariants, setLoadingVariants] = useState<Record<string, boolean>>({});

  // Reset on-demand state when the underlying data changes (page change,
  // new query). Axios still has the responses cached behind the scenes, so
  // re-expanding any unchanged variant on the new page is instant.
  useEffect(() => {
    setFetchedIsoforms({});
    setLoadingVariants({});
  }, [props.data]);

  useEffect(() => {
    const annotationParam = searchParams.get('annotation');
    if (!annotationParam) { setAnnotationExpanded(''); return; }
    const parsed = parseAnnotationParam(annotationParam);
    if (parsed) {
      const canonical = buildAnnotationParam(parsed.type, parsed.rowNumber, true);
      if (canonical !== annotationParam) {
        // Long form (e.g. "functional-row-1") → redirect to short canonical form ("fun")
        const newParams = new URLSearchParams(searchParams);
        newParams.set('annotation', canonical);
        navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
        return;
      }
      setAnnotationExpanded(buildAnnotationKey(parsed.type, parsed.rowNumber));
    } else {
      setAnnotationExpanded('');
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleIsoformGroup: ToggleIsoformGroupFn = (key, gvStr) => {
    const willExpand = isoformGroupExpanded !== key;

    // Lazy mode: kick off a single-variant fetch on first expand. Subsequent
    // expands of the same gvStr are skipped if we already have data in
    // local state; if not (e.g. genes that returned no isoforms), the call
    // is fired again and resolved instantly by the axios cache. The
    // expanded panel renders a "No other isoforms" hint in that case.
    if (willExpand && props.lazyIsoforms && gvStr && !loadingVariants[gvStr]) {
      const alreadyInState = Object.keys(fetchedIsoforms).some(k => k.startsWith(`${gvStr}|`));
      if (!alreadyInState) {
        setLoadingVariants(prev => ({ ...prev, [gvStr]: true }));
        singleVariant(gvStr)
          .then(response => {
            const next: Record<string, Isoform[]> = {};
            response.data.content?.inputs?.forEach(inp => {
              inp.derivedGenomicVariants?.forEach(gv => {
                const k = `${gv.chromosome}-${gv.position}-${gv.refBase}-${gv.altBase}`;
                if (k !== gvStr) return;
                gv.genes?.forEach(g => {
                  if (g.isoforms?.length) next[`${gvStr}|${g.geneName}`] = g.isoforms;
                });
              });
            });
            setFetchedIsoforms(prev => ({ ...prev, ...next }));
          })
          .catch(err => {
            console.error('Failed to fetch isoforms for', gvStr, err);
          })
          .finally(() => {
            setLoadingVariants(prev => {
              const { [gvStr]: _, ...rest } = prev;
              return rest;
            });
          });
      }
    }

    setIsoformGroupExpanded(willExpand ? key : '');
  };

  function toggleAnnotation(key: string) {
    const newAnnotation = annotationExpanded === key ? '' : key;
    const oldAnnotation = annotationExpanded;
    setAnnotationExpanded(newAnnotation);

    const newParams = new URLSearchParams(searchParams);
    if (newAnnotation) {
      const parsed = parseAnnotationKey(newAnnotation);
      if (parsed) {
        const param = buildAnnotationParam(parsed.type, parsed.rowNumber, true);
        newParams.set("annotation", param);
        const oldParsed = oldAnnotation ? parseAnnotationKey(oldAnnotation) : null;
        if (!oldParsed || parsed.type !== oldParsed.type || parsed.rowNumber !== oldParsed.rowNumber) {
          clearAnnotationSpecificParams(newParams, parsed.type);
        }
      }
    } else {
      newParams.delete("annotation");
      clearAnnotationSpecificParams(newParams, null);
    }

    const url = `${location.pathname}${newParams.size > 0 ? `?${newParams.toString()}` : ''}`;
    navigate(url, { replace: true });
  }

  if (!props.data) return null;

  const rows = getTableRows(
    props.data,
    isoformGroupExpanded,
    toggleIsoformGroup,
    annotationExpanded,
    toggleAnnotation,
    stdColor,
    !!props.lazyIsoforms,
    fetchedIsoforms,
    loadingVariants,
  );

  return (
    <div className="result-table">
      {/* ── Sticky two-row header ── */}
      <div className="result-header">
        <div className="result-group-header">
          <Tool el="span" tip="Gene and nucleotide level annotations">
            GENOMIC <span className="col-hints">· ID · position · gene · codon · CADD</span>
          </Tool>
          <Tool el="span" tip="Amino acid / protein level annotations">
            PROTEIN <span className="col-hints">· isoform · name · AA change · consequence · popEVE · AlphaMissense</span>
          </Tool>
          <Tool el="span" tip="Functional, population and structural annotations" pos="up-right">
            ANNOTATIONS
          </Tool>
        </div>
      </div>

      {/* ── Data rows ── */}
      <div className="result-body">
        {rows}
      </div>
    </div>
  );
}

const NO_MAPPING: Message = { type: 'ERROR', text: 'No mapping found' };

const getTableRows = (
  data: PagedMappingResponse | null,
  isoformGroupExpanded: string,
  toggleIsoformGroup: ToggleIsoformGroupFn,
  annotationExpanded: string,
  toggleAnnotation: StringVoidFun,
  stdColor: boolean,
  lazyIsoforms: boolean,
  fetchedIsoforms: Record<string, Isoform[]>,
  loadingVariants: Record<string, boolean>,
) => {
  const rows: Array<React.JSX.Element> = [];

  let primaryRow = 0;
  let altRow = 0;

  data?.content.inputs?.forEach((input, inputIndex) => {
    input.messages.forEach((message, i) => {
      rows.push(
        <MsgRow key={`input-${inputIndex}-message-${i}`} index={inputIndex} message={message} input={input} />
      );
    });

    input.derivedGenomicVariants.forEach((genomicVariant: GenomicVariant, genIndex: number) => {
      if (genomicVariant.genes.length === 0 && input.messages.length === 0) {
        rows.push(
          <MsgRow key={`input-${inputIndex}-${genIndex}-nomapping`} index={inputIndex} message={NO_MAPPING} input={input} genomicVariant={genomicVariant} />
        );
        return;
      }

      genomicVariant.genes.forEach((gene, geneIdx) => {
        const isoformGroupKey = `input-${inputIndex}-${genIndex}-gene-${geneIdx}-isoform`;
        const genomicVariantStr = `${genomicVariant.chromosome}-${genomicVariant.position}-${genomicVariant.refBase}-${genomicVariant.altBase}`;

        // Effective isoforms: prefer the lazy-fetched list when available,
        // otherwise the BE-pre-fetched list on gene.isoforms.
        const fetched = fetchedIsoforms[`${genomicVariantStr}|${gene.geneName}`];
        const effectiveIsoforms = fetched ?? gene.isoforms;
        const isLoadingIsoforms = !!loadingVariants[genomicVariantStr];
        // In lazy mode the chevron is always visible — clicking it triggers
        // a single-variant fetch (instant on cached repeats) and either
        // reveals alt isoforms or shows a "No other isoforms" hint.
        const hasAltIsoForm = effectiveIsoforms.length > 1 || lazyIsoforms;

        let primaryIsoform = effectiveIsoforms[0];
        let primaryKey = '';
        const geneRowEls: React.JSX.Element[] = [];

        effectiveIsoforms.forEach((isoform, isoformIdx) => {
          if (isoformIdx === 0) {
            primaryRow++;
            altRow = 0;
            primaryKey = `row-${primaryRow}`;
            primaryIsoform = isoform;
            geneRowEls.push(getNewPrimaryRow(
              primaryKey,
              isoformGroupKey,
              isoformGroupExpanded,
              inputIndex,
              genomicVariant,
              input,
              gene,
              isoform,
              toggleIsoformGroup,
              annotationExpanded,
              toggleAnnotation,
              hasAltIsoForm,
              stdColor,
              isoformGroupKey === isoformGroupExpanded ? effectiveIsoforms.slice(1) : [],
              isLoadingIsoforms,
            ));
          } else if (isoformGroupKey === isoformGroupExpanded) {
            altRow++;
            geneRowEls.push(getAlternateIsoFormRow(`row-${primaryRow}-${altRow}`, inputIndex, isoform));
          }
        });

        // Lazy mode + expanded + nothing more to show: render a hint so the
        // user understands the chevron resolved to "no other isoforms"
        // rather than appearing to do nothing. The hint is positioned at
        // the isoform column (col 6+) by the .no-alts-hint CSS rule,
        // aligning with where alt isoforms would normally appear.
        if (primaryKey && lazyIsoforms && !isLoadingIsoforms
            && isoformGroupKey === isoformGroupExpanded
            && effectiveIsoforms.length === 1) {
          geneRowEls.push(
            <div key={`row-${primaryRow}-no-alts`} className="result-row result-row-isoform result-row-no-alts">
              <span className="no-alts-hint">No other isoforms.</span>
            </div>
          );
        }

        if (primaryKey) {
          // Wrap in display:contents div — guarantees Primary → Alt Isoforms → Annotation Panel
          // order regardless of React reconciliation behaviour.
          rows.push(
            <div key={`group-${primaryKey}`} className="result-gene-group">
              {geneRowEls}
              <AnnotationPanels
                isoformKey={primaryKey}
                annotationExpanded={annotationExpanded}
                gene={gene}
                isoform={primaryIsoform}
                genomicVariantStr={genomicVariantStr}
              />
            </div>
          );
        }
      });
    });
  });

  return rows;
};

export const rowBg = (index: number) => {
  const rowColor    = { backgroundColor: "#F4F3F3" };
  const altRowColor = { backgroundColor: "#FFFFFF" };
  return (index % 2 === 0) ? altRowColor : rowColor;
};

export default ResultTable;
