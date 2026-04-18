import React from 'react';
import { UNIPROT_ACCESSION_URL } from "../../../constants/ExternalUrls";
import { TextLink } from "../../components/common/Link";
import { CONSEQUENCES } from "../../../constants/SearchResultTable";
import { fullAminoAcidName } from "../../../utills/Util";
import Tool from "../../elements/Tool";
import { EmptyElement } from "../../../constants/ConstElement";
import { Isoform } from "../../../types/MappingResponse";
import { aaChangeStr } from "./PrimaryRow";

export function ConsequenceBadge({ consequence }: { consequence?: string }) {
  if (!consequence) return null;
  const lower = consequence.toLowerCase();
  if (lower.includes('missense'))   return <span className="consequence-badge conseq-miss">miss</span>;
  if (lower.includes('synonymous')) return <span className="consequence-badge conseq-syn">syn</span>;
  if (lower.includes('stop'))       return <span className="consequence-badge conseq-stop">stop</span>;
  return <span className="consequence-badge">{consequence}</span>;
}

export function aaChangeTip(change: string | undefined) {
  return "Amino acid change " + fullAminoAcidName(change?.split("/")[0]) + " -> " + fullAminoAcidName(change?.split("/")[1]);
}

export function CanonicalIcon(props: { isCanonical: boolean | undefined }) {
  if (props.isCanonical === undefined)
    return EmptyElement;
  else if (props.isCanonical)
    return <Tool el="span" tip="Canonical isoform" className="protein-type-icon protein-type-icon--canonical">can</Tool>;
  else
    return <Tool el="span" tip="Non canonical isoform" className="protein-type-icon protein-type-icon--isoform">iso</Tool>;
}

export function getProteinName(proteinName?: string) {
  return <span className="protein-name-cell" title={proteinName}>{proteinName}</span>;
}

export function getAlternateIsoFormRow(isoformKey: string, index: number, isoform: Isoform) {
  const aaChange = aaChangeStr(isoform.refAA, isoform.variantAA);
  const aaChangeFormatted = `${isoform.refAA}${isoform.isoformPosition}${isoform.variantAA}`;

  return (
    <div key={isoformKey} className={`result-row result-row-isoform ${index % 2 === 0 ? 'row-even' : 'row-odd'}`}>
      {/* Genomic columns — empty */}
      <span className="cell-genomic" />
      <span className="cell-genomic" />
      <span className="cell-genomic" />
      <span className="cell-genomic" />

      {/* Protein columns */}
      <span data-label="Isoform" className="isoform-cell">
        <CanonicalIcon isCanonical={false} />
        <Tool tip="Click to see the UniProt page for this accession">
          <TextLink url={UNIPROT_ACCESSION_URL + isoform.accession} text={isoform.accession} />
        </Tool>
      </span>
      <span data-label="Protein name">{getProteinName(isoform.proteinName)}</span>
      <span data-label="AA Change"><Tool tip={aaChangeTip(aaChange)}>{aaChangeFormatted}</Tool></span>
      <span data-label="Consequence"><Tool tip={CONSEQUENCES.get(isoform.consequences!)} pos="up-right"><ConsequenceBadge consequence={isoform.consequences} /></Tool></span>

      {/* Score / detail columns — empty for alt isoforms */}
      <span data-label="popEVE" />
      <span data-label="AlphaMissense" />
      <span data-label="Details" />
    </div>
  );
}
