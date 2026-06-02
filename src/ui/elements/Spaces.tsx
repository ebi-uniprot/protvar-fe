import React from "react";

interface SpaceProps {
  hide?: boolean
  count?: number
}
function Spaces({ hide, count = 1 }: SpaceProps) {
  if (hide)
    return <></>

  const spaces: React.JSX.Element[] = []
  for (let index = 0; index < count; index++) {
    spaces.push(<span className="space" key={index}/>)
  }
  return <>{spaces}</>
}
export default Spaces;