import React from 'react';
import { FC, AllHTMLAttributes } from 'react';
import 'balloon-css';
import './tool.scss'

type Props = {
  pos?: string;
  tip?: string;
  tSize?: string;
  el?: string;
};

const Tool: FC<Props & AllHTMLAttributes<HTMLElement>> = (props) => {
  const { pos, tip, tSize, el, ...html } = props
  const htmlElement = el ? el : "span"
  const newProps = { ...html, ...tipProps(tip, pos, tSize) }
  return React.createElement(htmlElement, newProps)
};

const tipProps = (val: string | undefined, position: string = "up", size = "") => {
  if (!val)
    return {}
  const defaultRet = {
    "data-balloon-pos": position,
    "aria-label": val,
    //no animation - instant show
    "data-balloon-blunt": "",
    //remove tooltip after clicking on the button
    //https://github.com/kazzkiq/balloon.css/issues/135
    "data-balloon-nofocus": ""
  }

  if (size)
    return { ...defaultRet, "data-balloon-length": size }
  return defaultRet;
}

export default Tool;