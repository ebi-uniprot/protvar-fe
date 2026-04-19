import React from "react";

const DefaultPageContent = (props: { children: React.JSX.Element }) => {
  return (
    <div className="page-content">
      <div className="main-content">
        {props.children}
      </div>
    </div>
  )
}

export default DefaultPageContent
