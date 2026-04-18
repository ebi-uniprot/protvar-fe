import React, { useContext, useEffect, useState } from "react";
import { PagedMappingResponse } from "../../../types/PagedMappingResponse";
import { Message, GenomicVariant } from "../../../types/MappingResponse";
import { StringVoidFun } from "../../../constants/CommonTypes";
import { getAlternateIsoFormRow } from "./AlternateIsoFormRow";
import { getNewPrimaryRow, AnnotationPanels } from "./PrimaryRow";
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

function ResultTable(props: { data: PagedMappingResponse | null }) {
  const stdColor = useContext(AppContext).stdColor;
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isoformGroupExpanded, setIsoformGroupExpanded] = useState('');
  const [annotationExpanded, setAnnotationExpanded] = useState('');

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

  function toggleIsoformGroup(key: string) {
    setIsoformGroupExpanded(isoformGroupExpanded === key ? '' : key);
  }

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
  );

  return (
    <div className="result-table">
      {/* ── Sticky two-row header ── */}
      <div className="result-header">
        <div className="result-group-header">
          <Tool el="span" tip="Gene and nucleotide level annotations">Genomic</Tool>
          <Tool el="span" tip="Amino acid / protein level annotations">Protein</Tool>
          <Tool el="span" tip="Functional, population and structural annotations" pos="up-right">Annotations</Tool>
        </div>
        <div className="result-col-header">
          <Tool el="span" tip="Variant identifier supplied by the user">ID</Tool>
          <Tool el="span" tip="Genomic position: chromosome-coordinate-ref-alt">Genomic position</Tool>
          <Tool el="span" tip="Change of the codon containing the variant nucleotide; strand in parentheses">Codon (strand)</Tool>
          <Tool el="span" tip="CADD phred-like score (v1.7). Source: PubMed PMID 30371827">CADD v1.7</Tool>
          <Tool el="span" tip="UniProt canonical or alternate isoform the variant is mapped to" tSize="xlarge">Isoform</Tool>
          <Tool el="span" tip="Full protein name from UniProt">Protein name</Tool>
          <Tool el="span" tip="Amino acid change in three-letter code format (e.g. Ala205Pro)">AA Change</Tool>
          <Tool el="span" tip="Consequence of the variant at the protein level">Consequence(s)</Tool>
          <Tool el="span" tip="popEVE score — population-informed variant effect prediction">popEVE</Tool>
          <Tool el="span" tip="AlphaMissense pathogenicity prediction. Source: PubMed PMID 37733863">AlphaMissense</Tool>
          <span>Click for details</span>
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
  toggleIsoformGroup: StringVoidFun,
  annotationExpanded: string,
  toggleAnnotation: StringVoidFun,
  stdColor: boolean,
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
        let primaryIsoform = gene.isoforms[0];
        let primaryKey = '';
        const geneRowEls: React.JSX.Element[] = [];

        gene.isoforms.forEach((isoform, isoformIdx) => {
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
              gene.isoforms.length > 1,
              stdColor,
              isoformGroupKey === isoformGroupExpanded ? gene.isoforms.slice(1) : [],
            ));
          } else if (isoformGroupKey === isoformGroupExpanded) {
            altRow++;
            geneRowEls.push(getAlternateIsoFormRow(`row-${primaryRow}-${altRow}`, inputIndex, isoform));
          }
        });

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
