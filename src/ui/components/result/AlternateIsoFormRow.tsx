import { UNIPROT_ACCESSION_URL } from "../../../constants/ExternalUrls";
import { ANNOTATION_COLS, CONSEQUENCES, GENOMIC_COLS } from "../../../constants/SearchResultTable";
import { fullAminoAcidName } from "../../../utills/Util";
import Tool from "../../elements/Tool";
import Spaces from "../../elements/Spaces";
import { EmptyElement } from "../../../constants/ConstElement";
import {Gene, GenomicInput, IsoFormMapping} from "../../../types/MappingResponse";
import {aaChangeStr} from "../search/PrimaryRow";
import {rowBg} from "./ResultTable";

export function aaChangeTip(change: string | undefined) {
  return "Amino acid change " + fullAminoAcidName(change?.split("/")[0]) + " -> " + fullAminoAcidName(change?.split("/")[1]);
}

export function CanonicalIcon(props: { isCanonical: boolean | undefined }) {
  if (props.isCanonical === undefined)
    return EmptyElement
  else if (props.isCanonical)
    return <Tool el="span" tip="Canonical isoform" className="protein-type-icon protein-type-icon--canonical">can</Tool>
  else
    return <Tool el="span" tip="Non canonical isoform" className="protein-type-icon protein-type-icon--isoform">iso</Tool>
}

export function getProteinName(proteinName?: string) {
  return <div style={{
    whiteSpace: 'nowrap',
    width: '120px',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }}>{proteinName}</div>
}

export function getAlternateIsoFormRow(isoformKey: string, index: number, input: GenomicInput, gene: Gene, isoform: IsoFormMapping) {
  let aaChange = aaChangeStr(isoform.refAA, isoform.variantAA)
  return <tr key={isoformKey} style={rowBg(index)}>
    <td colSpan={GENOMIC_COLS}/>
    <td>
      <CanonicalIcon isCanonical={false}/>
      <Spaces/>
      <Tool tip="Click to see the UniProt page for this accession">
        <a href={UNIPROT_ACCESSION_URL + isoform.accession} target="_blank" rel="noopener noreferrer">{isoform.accession}</a>
      </Tool>
    </td>
    <td><Tool tip={isoform.proteinName}>{getProteinName(isoform.proteinName)}</Tool></td>
    <td><Tool tip="The amino acid position in this isoform">{isoform.isoformPosition}</Tool></td>
    <td><Tool tip={aaChangeTip(aaChange)}>{aaChange}</Tool></td>
    <td><Tool tip={CONSEQUENCES.get(isoform.consequences!)} pos="up-right">{isoform.consequences}</Tool></td>
    <td colSpan={ANNOTATION_COLS + 1}><br/><br/></td>
  </tr>
}