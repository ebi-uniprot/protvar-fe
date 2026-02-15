interface ProtVarLinkProps {
  url: string;
  title?: string;
}

export const ProtVarLink = ({ url,
                     title = "View in ProtVar"} : ProtVarLinkProps) => {
  return <a href={url} className="protvar-link" title={title}>
  <span className="protvar-badge">
    <span className="p-letter">P</span>
    <span className="v-letter">V</span>
  </span>
    <i className="bi bi-box-arrow-up-right"></i>
  </a>
}

// TODO review ext-link and ext-pred-link-inline
//  consolidate into ext-link-generic
const ExtLink = ({url, title}: {url: string, title?: string}) => {
  return <a href={url} className="ext-link-generic" title={title}>
    <i className="bi bi-box-arrow-up-right"></i>
  </a>

}