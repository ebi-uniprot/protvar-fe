import React, {useContext, useState} from "react";
import {AppContext} from "../../App";

interface HelpBtnProps {
  title: string
  content: React.JSX.Element
}

export const HelpButton = (props: HelpBtnProps) => {
  const state = useContext(AppContext)
  const [mouseOver, setMouseOver] = useState(false);
  return <span onClick={_ => state.updateState("drawer", props.content)}
               onMouseEnter={_ => setMouseOver(true)}
               onMouseLeave={_ => setMouseOver(false)}
               className="help-btn">
    {props.title} <i className={`bi bi-info-circle${mouseOver ? `-fill` : ``}`}
                     style={{verticalAlign: 'super', fontSize: '13px'}}></i>
  </span>
}