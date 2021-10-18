import { UNIPROT_ACCESSION_URL } from "../../../constants/ExternalUrls";
import { ANNOTATION_COLS, CONSEQUENCES, GENOMIC_COLS, INPUT_COLS } from "../../../constants/SearchResultTable";
import { MappingRecord } from "../../../utills/Convertor";
import { fullAminoAcidName } from "../../../utills/Util";
import Tool from "../../elements/Tool";
import { getProteinName } from "./ResultTable";
import { ReactComponent as NonCanonical } from '../../../images/book-line.svg';
import Spaces from "../../elements/Spaces";

export function aaChangeTip(change: string | undefined) {
  return "Amino acid change " + fullAminoAcidName(change?.split("/")[0]) + " -> " + fullAminoAcidName(change?.split("/")[1]);
}

export function NonCanonicalIcon() {
  return <Tool tip="Non canonical isoform">
    <NonCanonical className="isoform-icon" />
  </Tool>
}
interface AlternateIsoFormRowProps {
  record: MappingRecord
  toggleOpenGroup: string
}
function AlternateIsoFormRow(props: AlternateIsoFormRowProps) {
  const { record, toggleOpenGroup } = props;
  return <tr key={`${toggleOpenGroup}-${record.isoform}`}>
    <td colSpan={INPUT_COLS + GENOMIC_COLS} />
    <td>
      <NonCanonicalIcon />
      <Spaces />
      <Tool tip="Click to see the UniProt page for this accession">
        <a href={UNIPROT_ACCESSION_URL + record.isoform} target="_blank" rel="noopener noreferrer">{record.isoform}</a>
      </Tool>
    </td>
    <td><Tool tip={record.proteinName}>{getProteinName(record)}</Tool></td>
    <td><Tool tip="The amino acid position in this isoform">{record.aaPos}</Tool></td>
    <td><Tool tip={aaChangeTip(record.aaChange)}>{record.aaChange}</Tool></td>
    <td><Tool tip={CONSEQUENCES.get(record.consequences!)} pos="up-right">{record.consequences}</Tool></td>
    <td colSpan={ANNOTATION_COLS} />
  </tr>
}
export default AlternateIsoFormRow;