import { UNIPROT_ACCESSION_URL } from "../../../constants/ExternalUrls";
import { ANNOTATION_COLS, CONSEQUENCES, GENOMIC_COLS } from "../../../constants/SearchResultTable";
import { MappingRecord } from "../../../utills/Convertor";
import { fullAminoAcidName } from "../../../utills/Util";
import Tool from "../../elements/Tool";
import { getProteinName } from "./ResultTable";
import Spaces from "../../elements/Spaces";
import { EmptyElement } from "../../../constants/Const";

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
interface AlternateIsoFormRowProps {
  record: MappingRecord,
  currStyle: object
}
function AlternateIsoFormRow(props: AlternateIsoFormRowProps) {
  const { record, currStyle } = props;
  return <tr style={currStyle}>
    <td colSpan={GENOMIC_COLS} />
    <td>
      <CanonicalIcon isCanonical={false} />
      <Spaces />
      <Tool tip="Click to see the UniProt page for this accession">
        <a href={UNIPROT_ACCESSION_URL + record.isoform} target="_blank" rel="noopener noreferrer">{record.isoform}</a>
      </Tool>
    </td>
    <td><Tool tip={record.proteinName}>{getProteinName(record)}</Tool></td>
    <td><Tool tip="The amino acid position in this isoform">{record.aaPos}</Tool></td>
    <td><Tool tip={aaChangeTip(record.aaChange)}>{record.aaChange}</Tool></td>
    <td><Tool tip={CONSEQUENCES.get(record.consequences!)} pos="up-right">{record.consequences}</Tool></td>
    <td colSpan={ANNOTATION_COLS+1}><br /><br /></td>
  </tr>
}
export default AlternateIsoFormRow;