import React from "react";

interface LinkProps {
  url: string;
  title?: string;
  text?: string;
}

export const PVLink = ({ url,
                     title = "View in ProtVar"} : LinkProps) => {
  return <a href={url} className="protvar-link" title={title}>
    <span className="protvar-label">
      <span className="p-letter">P</span>
      <span className="v-letter">V</span>
      <span className="pv-arrow">↗</span>
    </span>
  </a>
}

// External link with arrow icon
export const ExtLink = ({ url, title, text} : LinkProps) => {
  return <a
      href={url}
      title={title}
      target="_blank"
      rel="noopener noreferrer"
      className="ext-link"
    >{text && `${text} `}<span className="ext-arrow">↗</span>
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