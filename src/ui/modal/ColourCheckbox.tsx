import {AppState} from "../App";

export const ColourCheckbox = (props: {state: AppState}) => {
  const toggleStdColor = () => {
    props.state.updateState("stdColor", props.state.stdColor ? false: true)
  }

  return <label title="Uncheck to use original source colours">
    <input type="checkbox" checked={props.state.stdColor} onChange={toggleStdColor} />
    ProtVar standardised colours
  </label>

}