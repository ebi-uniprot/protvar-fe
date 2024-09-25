import React, {useContext} from "react";
import {AppContext} from "../../App";

interface HelpBtnProps {
  title: string
  content: JSX.Element
}

export const HelpButton = (props: HelpBtnProps) => {
  const state = useContext(AppContext)
  return <span onClick={_ => state.updateState("drawer", props.content)}>
      {props.title} <i className="bi bi-info-circle help-btn"></i>
  </span>
}