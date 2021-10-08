import { UNIPROT_ACCESSION_URL } from "../../../constants/ExternalUrls";
import { ANNOTATION_COLS, GENOMIC_COLS, INPUT_COLS } from "../../../constants/SearchResultTable";
import { MappingRecord } from "../../../utills/Convertor";
import ProteinReviewStatus from "./ProteinReviewStatus";
import { getProteinName, getProteinType } from "./ResultTable";

interface AlternateIsoFormRowProps {
  record: MappingRecord
  toggleOpenGroup: string
}
function AlternateIsoFormRow(props: AlternateIsoFormRowProps) {
  const { record, toggleOpenGroup } = props;
  return <tr key={`${toggleOpenGroup}-${record.isoform}`}>
    <td colSpan={INPUT_COLS + GENOMIC_COLS} />
    <td>
      <ProteinReviewStatus type={getProteinType(record)} />
      <a href={UNIPROT_ACCESSION_URL + record.isoform} target="_blank" rel="noopener noreferrer">
        {record.isoform}
      </a>
    </td>
    <td>
      <span title={record.proteinName}>{getProteinName(record)}</span>
    </td>
    <td>{record.aaPos}</td>
    <td>{record.aaChange}</td>
    <td>{record.consequences}</td>
    <td colSpan={ANNOTATION_COLS} />
  </tr>
}
export default AlternateIsoFormRow;