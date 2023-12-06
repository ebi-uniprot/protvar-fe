import {TOTAL_COLS} from "../../../constants/SearchResultTable";
import { MappingRecord } from "../../../utills/Convertor";
import {ERROR, INFO, Message, WARN} from "../../../types/MappingResponse";

interface MsgRowProps {
  record: MappingRecord,
  currStyle: object
}

export const WARN_ICON = <span className="msg-warn" title="Warning">!</span>
export const ERROR_ICON = <span className="msg-error" title="Error">X</span>
export const INFO_ICON = <span className="msg-info" title="Info">i</span>

const getIcon = (m?: Message) => {
  if (m) {
    if (m.type == ERROR)
      return ERROR_ICON
    else if (m.type == WARN)
      return WARN_ICON
    else if (m.type == INFO)
      return INFO_ICON
  }
}

const MsgRow = (props: MsgRowProps) => {
  const { record, currStyle } = props;
  return <tr style={currStyle}>
    <td colSpan={TOTAL_COLS}>
      {getIcon(record.msg)}
      <b>{record.input}</b> {record.msg?.text}
    </td>
  </tr>
};

export default MsgRow;