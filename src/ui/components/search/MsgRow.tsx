import {TOTAL_COLS} from "../../../constants/SearchResultTable";
import { MappingRecord } from "../../../utills/Convertor";
import {ERROR, INFO, Message, WARN} from "../../../types/MappingResponse";

interface MsgRowProps {
  record: MappingRecord,
  currStyle: object
}

export const WARN_ICON = <><i className="msg-warn bi bi-exclamation-triangle-fill"></i>{' '}</>
export const ERROR_ICON = <><i className="msg-error bi bi-x-circle-fill"></i>{' '}</>
export const INFO_ICON = <><i className="msg-info bi bi-info-circle-fill"></i>{' '}</>

const getIcon = (m?: Message) => {
  if (m) {
    if (m.type === ERROR)
      return ERROR_ICON
    else if (m.type === WARN)
      return WARN_ICON
    else if (m.type === INFO)
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