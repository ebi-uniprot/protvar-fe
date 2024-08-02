import React, {useContext} from "react";
import {AppContext} from "../../App";

interface HelpBtnProps {
  title: string
  content: JSX.Element
}

export const HelpBtn = (props: HelpBtnProps) => {
  const state = useContext(AppContext)
  return <button className="bi bi-info-circle help-btn"
                 onClick={_ => state.updateState("drawer", props.content)}>{' '}
    {props.title}
  </button>
}