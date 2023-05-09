import {TOTAL_COLS} from "../../../constants/SearchResultTable";
import { MappingRecord } from "../../../utills/Convertor";

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