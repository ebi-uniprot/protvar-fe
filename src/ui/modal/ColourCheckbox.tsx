import {Tooltip} from "../components/common/Tooltip";

export const ColourCheckbox = (props: {stdColor: boolean, toggleStdColor:() => void}) => {
  return <label>
    <input type="checkbox" checked={props.stdColor} onChange={props.toggleStdColor} />
    <Tooltip tip="Uncheck to use original source colours">ProtVar standardised colours</Tooltip>
  </label>

}