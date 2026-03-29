import React from "react";

interface LinkProps {
  url: string;
  title?: string;
  text?: string;
}

export const PVLink = ({ url,
                     title = "View in ProtVar"} : LinkProps) => {
  return <a href={url} className="protvar-link" title={title}>
  <span className="protvar-badge">
    <span className="p-letter">P</span>
    <span className="v-letter">V</span>
  </span>
    <i className="bi bi-box-arrow-up-right"></i>
  </a>
}

export const ExtLink = ({ url,
                   title, text} : LinkProps) => {
  return <a
      href={url}
      title={title}
      target="_blank"
      rel="noopener noreferrer"
      className="ext-link"
    >{text && `${text} `}<i className="bi bi-box-arrow-up-right"></i>
  </a>
}