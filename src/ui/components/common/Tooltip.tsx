import "./Tooltip.css"

type TooltipProps = {
  children?: React.ReactNode
  text?: string
  tip?: string
};

/*
example:
  <Tooltip text="Hover here" tip="Hover here tooltip"></Tooltip>
  <Tooltip tip="Another text tooltip">
    Another text
  </Tooltip>
  <Tooltip tip="A link example tooltip">
    <a href="#" target="_blank" rel="noopener noreferrer">
      A link example
    </a>
  </Tooltip>
 */
export const Tooltip = ({children, tip, text}: TooltipProps) => {
  const hoverTextOrElem = text ? text : children
  return (
    tip ?
    <div className="hover-text" title={tip}>{hoverTextOrElem}
    <span className="info-icon">i</span>
  </div> :
      <div>{hoverTextOrElem}</div>);
}