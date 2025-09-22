import React from "react";

const DefaultPageContent = (props: {
  children: React.JSX.Element;
  isDocked?: boolean;
}) => {
  const { children, isDocked = false } = props

  return (
    <div className={`page-content ${isDocked ? 'with-docked-sidebar' : ''}`}>
      <div className="main-content">
        {children}
      </div>
    </div>
  )
}

export default DefaultPageContent
