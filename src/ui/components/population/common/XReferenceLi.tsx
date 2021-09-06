interface XReferenceLiProps {
  id: string
  url: string
}
function XReferenceLi(props: XReferenceLiProps) {
  if (props.id && (props.id.startsWith('COS') || props.id.startsWith('RCV') || props.id.startsWith('rs')))
    return <li><a href={props.url} target="_blank" rel="noreferrer">{props.id}</a></li>
  else
    return <></>;
}
export default XReferenceLi;