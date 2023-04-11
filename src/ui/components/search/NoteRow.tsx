import { ENSEMBL_CHRM_URL, ENSEMBL_VIEW_URL } from "../../../constants/ExternalUrls";
import {ALLELE, ANNOTATION_COLS, GENOMIC_COLS, PROTEIN_COLS, TOTAL_COLS} from "../../../constants/SearchResultTable";
import { MappingRecord } from "../../../utills/Convertor";
import Tool from "../../elements/Tool";
import {INPUT_GEN, INPUT_PRO} from "../../../types/MappingResponse";

interface NoteRowProps {
  record: MappingRecord,
  currStyle: object
}

const NoteRow = (props: NoteRowProps) => {
  const { record, currStyle } = props;
  return <tr style={currStyle}>
    <td colSpan={TOTAL_COLS}>
      <b>{record.input}</b> {record.note}
    </td>
  </tr>
};

export default NoteRow;