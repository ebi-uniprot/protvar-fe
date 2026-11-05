import React from "react";
import { Link } from "react-router-dom";

interface LinkProps {
  url: string;
  title?: string;
  text?: string;
}

// Open something in ProtVar from within ProtVar: the compact ProtVar mark (logo P and V on the logo blue), same tab, scrolled to the top
// (an in-app route, not an external link, so no ↗). `url` is an app route, e.g. /search?q=rs334.
export const PVLink = ({ url,
                     title = "View in ProtVar"} : LinkProps) => {
  // a new result in the same page: start at its top (the router keeps the scroll position)
  return <Link to={url} className="protvar-link" title={title} aria-label={title}
               onClick={() => window.scrollTo({ top: 0 })}>
    <img src={`${process.env.PUBLIC_URL}/images/protvar-mark.svg`} alt="" width={22} height={16} />
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