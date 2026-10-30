import React, { useContext, useEffect, useState } from "react";
import { PagedMappingResponse } from "../../../types/PagedMappingResponse";
import { Message, GenomicVariant, Isoform, VariantInput } from "../../../types/MappingResponse";
import { StringVoidFun } from "../../../constants/CommonTypes";
import { getAlternateIsoFormRow } from "./AlternateIsoFormRow";
import { getNewPrimaryRow, AnnotationPanels, ToggleIsoformGroupFn } from "./PrimaryRow";
import { singleVariant } from "../../../services/ProtVarService";
import { AppContext } from "../../App";
import MsgRow from "./MsgRow";
import { NoteCounts, NoteMarker, NoteRow, NotesBar } from "./RowNotes";
import { inGroup, ResultColumn, visibleColumns } from "../../../constants/resultColumns";
import { useResultColumns } from "./useResultColumns";
import Tool from "../../elements/Tooltip";
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
  const { ids: columnIds } = useResultColumns();
  // Notes on inputs with result rows: opened one by one (by input index), or all at once.
  // "Show all" is kept across pages; single opens reset with the data.
  const [openNotes, setOpenNotes] = useState<Set<number>>(new Set());
  const [showAllNotes, setShowAllNotes] = useState(false);

  // Reset on-demand state when the underlying data changes (page change,
  // new query). Axios still has the responses cached behind the scenes, so
  // re-expanding any unchanged variant on the new page is instant.
  useEffect(() => {
    setFetchedIsoforms({});
    setLoadingVariants({});
    setOpenNotes(new Set());
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

  function toggleNote(i: number) {
    if (showAllNotes) {
      // closing one while all are shown: keep the others open
      setShowAllNotes(false);
      setOpenNotes(new Set(notedInputs(props.data).filter(j => j !== i)));
      return;
    }
    const next = new Set(openNotes);
    if (next.has(i)) next.delete(i); else next.add(i);
    setOpenNotes(next);
  }

  if (!props.data) return null;

  const cols = visibleColumns(columnIds);
  const genomic = inGroup(cols, 'genomic');
  const protein = inGroup(cols, 'protein');
  const hints = (group: ResultColumn[]) => group.map(c => c.label);

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
    cols,
    { isOpen: (i: number) => showAllNotes || openNotes.has(i), toggle: toggleNote },
  );

  return (
    <>
    <NotesBar counts={noteCounts(props.data)} showAll={showAllNotes}
              onToggle={() => { setShowAllNotes(!showAllNotes); setOpenNotes(new Set()); }} />
    <div className="result-table" style={{ gridTemplateColumns: `repeat(${cols.length}, auto)` }}>
      {/* ── Sticky two-row header ── */}
      <div className="result-header">
        <div className="result-group-header">
          <Tool el="span" style={{ gridColumn: `span ${genomic.length}` }}
                tip={`Gene- and nucleotide-level columns: ${hints(genomic).join(', ')}`}>
            GENOMIC <span className="col-hints">{'· ' + hints(genomic).join(' · ')}</span>
          </Tool>
          <Tool el="span" style={{ gridColumn: `span ${protein.length}` }}
                tip={`Amino-acid / protein-level columns: ${hints(protein).join(', ')}`}>
            PROTEIN <span className="col-hints">{'· ' + hints(protein).join(' · ')}</span>
          </Tool>
          <Tool el="span" style={{ gridColumn: `span ${inGroup(cols, 'annotations').length}` }}
                tip="Functional, population and structural annotations — click an icon to expand" pos="up-right">
            ANNOTATIONS
          </Tool>
        </div>
      </div>

      {/* ── Data rows ── */}
      <div className="result-body">
        {rows}
      </div>
    </div>
    </>
  );
}

// An input "has rows" when any of its genomic variants mapped to a gene; its notes then go on a
// corner marker. Inputs without rows (invalid, not mapped) show their messages as rows instead.
const hasRows = (input: VariantInput) => input.derivedGenomicVariants.some(gv => gv.genes.length > 0);

const notedInputs = (data: PagedMappingResponse | null): number[] =>
  (data?.content.inputs ?? []).flatMap((input, i) => hasRows(input) && input.messages.length > 0 ? [i] : []);

const noteCounts = (data: PagedMappingResponse | null): NoteCounts => {
  const counts: NoteCounts = { warn: 0, info: 0, notMapped: 0 };
  data?.content.inputs?.forEach(input => {
    if (!hasRows(input)) { counts.notMapped++; return; }
    input.messages.forEach(m => {
      if (m.type === 'INFO') counts.info++; else counts.warn++;
    });
  });
  return counts;
};

interface RowNoteState {
  isOpen: (inputIndex: number) => boolean;
  toggle: (inputIndex: number) => void;
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
  cols: ResultColumn[],
  notes: RowNoteState,
) => {
  const rows: Array<React.JSX.Element> = [];

  let primaryRow = 0;
  let altRow = 0;

  data?.content.inputs?.forEach((input, inputIndex) => {
    const inputHasRows = hasRows(input);
    if (!inputHasRows) {
      input.messages.forEach((message, i) => {
        rows.push(
          <MsgRow key={`input-${inputIndex}-message-${i}`} index={inputIndex} message={message} input={input} />
        );
      });
    }
    // the input's notes go on its first result row
    let notePlaced = !inputHasRows || input.messages.length === 0;

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
            const noteMarker = notePlaced ? undefined
              : <NoteMarker messages={input.messages} open={notes.isOpen(inputIndex)}
                            onToggle={() => notes.toggle(inputIndex)} />;
            const noteOpen = !notePlaced && notes.isOpen(inputIndex);
            notePlaced = true;
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
              cols,
              noteMarker,
            ));
            if (noteMarker && noteOpen) {
              geneRowEls.push(<NoteRow key={`row-${primaryRow}-note`} messages={input.messages} />);
            }

          } else if (isoformGroupKey === isoformGroupExpanded) {
            altRow++;
            geneRowEls.push(getAlternateIsoFormRow(`row-${primaryRow}-${altRow}`, inputIndex, isoform, cols));
          }
        });

        // Lazy mode + expanded + nothing more to show: render a hint so the
        // user understands the chevron resolved to "no other isoforms"
        // rather than appearing to do nothing. The hint starts at the
        // isoform column (first protein column), aligning with where alt
        // isoforms would normally appear.
        if (primaryKey && lazyIsoforms && !isLoadingIsoforms
            && isoformGroupKey === isoformGroupExpanded
            && effectiveIsoforms.length === 1) {
          geneRowEls.push(
            <div key={`row-${primaryRow}-no-alts`} className="result-row result-row-isoform result-row-no-alts">
              <span className="no-alts-hint" style={{ gridColumn: `${inGroup(cols, 'genomic').length + 1} / -1` }}>No other isoforms.</span>
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
