import React from 'react';
import { UNIPROT_ACCESSION_URL } from "../../../constants/ExternalUrls";
import { TextLink } from "../../components/common/Link";
import { CONSEQUENCES } from "../../../constants/SearchResultTable";
import { fullAminoAcidName } from "../../../utills/Util";
import Tool from "../../elements/Tooltip";
import { EmptyElement } from "../../../constants/ConstElement";
import { Isoform } from "../../../types/MappingResponse";
import { aaChangeStr } from "./PrimaryRow";
import { ColumnId, inGroup, ResultColumn, visibleColumns } from "../../../constants/resultColumns";

export function ConsequenceBadge({ consequence }: { consequence?: string }) {
  if (!consequence) return null;
  const lower = consequence.toLowerCase();
  if (lower.includes('missense'))   return <span className="consequence-badge conseq-miss">miss</span>;
  if (lower.includes('synonymous')) return <span className="consequence-badge conseq-syn">syn</span>;
  if (lower.includes('stop'))       return <span className="consequence-badge conseq-stop">stop</span>;
  return <span className="consequence-badge">{consequence}</span>;
}

export function aaChangeTip(change: string | undefined) {
  return "Amino acid change: " + fullAminoAcidName(change?.split("/")[0]) + " → " + fullAminoAcidName(change?.split("/")[1]);
}

export function getConsequenceFullName(consequence?: string): string {
  if (!consequence) return '';
  const lower = consequence.toLowerCase();
  if (lower.includes('missense'))   return 'Missense variant';
  if (lower.includes('synonymous')) return 'Synonymous variant';
  if (lower.includes('stop'))       return 'Stop gained';
  return consequence;
}

// Only reviewed (Swiss-Prot) entries have -N isoforms; any other non-canonical accession is an unreviewed entry.
const REVIEWED_ISOFORM = /-\d+$/;

export function CanonicalIcon(props: { isCanonical: boolean | undefined, accession?: string }) {
  if (props.isCanonical === undefined)
    return EmptyElement;
  else if (props.isCanonical)
    return <Tool el="span" tip="Canonical isoform" className="protein-type-icon protein-type-icon--canonical">can</Tool>;
  else if (!props.accession || REVIEWED_ISOFORM.test(props.accession))
    return <Tool el="span" tip="Isoform of a reviewed entry" className="protein-type-icon protein-type-icon--isoform">iso</Tool>;
  else
    return <Tool el="span" tip="Unreviewed entry (TrEMBL), not an isoform of a reviewed protein"
                 className="protein-type-icon protein-type-icon--unreviewed">unr</Tool>;
}

export function getProteinName(proteinName?: string) {
  return <span className="protein-name-cell" title={proteinName}>{proteinName}</span>;
}

export function getAlternateIsoFormRow(isoformKey: string, index: number, isoform: Isoform,
                                       cols: ResultColumn[] = visibleColumns()) {
  const aaChange = aaChangeStr(isoform.refAA, isoform.variantAA);
  const aaChangeFormatted = `${isoform.refAA}${isoform.isoformPosition}${isoform.variantAA}`;

  // Alt isoforms only fill these protein columns; every other visible column gets an empty placeholder.
  const cells: Partial<Record<ColumnId, React.ReactNode>> = {
    isoform: <span key="isoform" className="isoform-cell">
      <CanonicalIcon isCanonical={false} accession={isoform.accession} />
      <Tool tip="Click to see the UniProt page for this accession">
        <TextLink url={UNIPROT_ACCESSION_URL + isoform.accession} text={isoform.accession} />
      </Tool>
    </span>,
    protein: <span key="protein" className="card-sep cell-protein-name">{getProteinName(isoform.proteinName)}</span>,
    aaChange: <span key="aaChange" className="card-sep"><Tool tip={aaChangeTip(aaChange)}>{aaChangeFormatted}</Tool></span>,
    consequence: <span key="consequence" className="card-sep cell-consequence"><Tool tip={CONSEQUENCES.get(isoform.consequences!)} pos="up-right"><ConsequenceBadge consequence={isoform.consequences} /></Tool></span>,
    popeve: <span key="popeve" className="cell-popeve" />,
  };

  return (
    <div key={isoformKey} className={`result-row result-row-isoform ${index % 2 === 0 ? 'row-even' : 'row-odd'}`}>
      {/* Card row 1: genomic — empty/hidden for alt isoforms */}
      <div className="card-row card-row-genomic">
        {inGroup(cols, 'genomic').map(c => <span key={c.id} className="cell-genomic" />)}
      </div>

      {/* Card row 2: protein + scores */}
      <div className="card-row card-row-protein">
        {inGroup(cols, 'protein').map(c => cells[c.id] ?? <span key={c.id} />)}
      </div>

      {/* Card row 3: detail buttons — empty for alt isoforms */}
      <div className="card-row card-row-details">
        {inGroup(cols, 'annotations').map(c => <span key={c.id} />)}
      </div>
    </div>
  );
}
