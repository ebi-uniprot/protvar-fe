interface SpaceProps {
  hide?: boolean
  count?: number
}
function Spaces({ hide, count = 1 }: SpaceProps) {
  if (hide)
    return <></>

  const spaces: JSX.Element[] = []
  for (let index = 0; index < count; index++) {
    spaces.push(<span className="space" />)
  }
  return <>{spaces}</>
}
export default Spaces;