import React from "react";
import { Link } from "react-router-dom";

interface LinkProps {
  url: string;
  title?: string;
  text?: string;
}

// Open something in ProtVar from within ProtVar: the logo ring + variant atom, drawn inline with no tile so it
// takes its colours from the theme (--pv-mark-*), same tab, scrolled to the top (an in-app route, so no ↗).
// `url` is an app route, e.g. /search?q=rs334. Other sites use the tiled public/images/protvar-mark.svg.
export const PVLink = ({ url,
                     title = "View in ProtVar"} : LinkProps) => {
  // a new result in the same page: start at its top (the router keeps the scroll position)
  return <Link to={url} className="protvar-link" title={title} aria-label={title}
               onClick={() => window.scrollTo({ top: 0 })}>
    <svg className="pv-mark" viewBox="0 0 16 16" width={16} height={16} aria-hidden="true" focusable="false">
      <g fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <polyline className="pv-mark-ring" points="3.67,3.55 1.49,10.25 7.20,14.40 12.91,10.25" />
        <polyline className="pv-mark-var" points="3.67,3.55 10.73,3.55 12.91,10.25" />
      </g>
      <circle className="pv-mark-atom" cx={12.91} cy={10.25} r={2.3} />
    </svg>
  </Link>
}

// External link with arrow icon
export const ExtLink = ({ url, title, text} : LinkProps) => {
  return <a href={url} className="ext-link"
      title={title}
      target="_blank" rel="noopener noreferrer">
    {text && `${text} `}
    <span className="ext-arrow">↗</span>
  </a>
}

// External link with plain text, no icon — for inline or table cell use
export const TextLink = ({ url, title, text} : LinkProps) => {
  return <a
      href={url}
      title={title}
      target="_blank"
      rel="noopener noreferrer"
      className="text-link"
    >{text}
  </a>
}