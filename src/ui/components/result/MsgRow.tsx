import {TOTAL_COLS} from "../../../constants/SearchResultTable";
import {ERROR, INFO, CustomInput, Message, WARN} from "../../../types/MappingResponse";
import {rowBg} from "./ResultTable";

export const WARN_ICON = <><i className="msg-warn bi bi-exclamation-triangle-fill"></i>{' '}</>
export const ERROR_ICON = <><i className="msg-error bi bi-x-circle-fill"></i>{' '}</>
export const INFO_ICON = <><i className="msg-info bi bi-info-circle-fill"></i>{' '}</>

export const NO_MAPPING: Message = {type: 'ERROR', text: 'No mapping found' }

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

interface MsgRowProps {
  msg: Message,
  input?: CustomInput // null for request-level messages
  index?:number     // null for request-level messages
}

const MsgRow = (props: MsgRowProps) => {
  return <tr style={rowBg(props.index?? -1)} title={props.input ? `Input: ${props.input.inputStr}` : ``}>
    <td colSpan={TOTAL_COLS}>
      {getIcon(props.msg)}
      <b>{props.input && props.input.inputStr}</b> {props.msg.text}
    </td>
  </tr>
};

export default MsgRow;