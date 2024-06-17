import {Tooltip} from "../components/common/Tooltip";
import {AppState} from "../App";

export const ColourCheckbox = (props: {state: AppState}) => {
  const toggleStdColor = () => {
    props.state.updateState("stdColor", props.state.stdColor ? false: true)
  }

  return <label>
    <input type="checkbox" checked={props.state.stdColor} onChange={toggleStdColor} />
    <Tooltip tip="Uncheck to use original source colours">ProtVar standardised colours</Tooltip>
  </label>

}