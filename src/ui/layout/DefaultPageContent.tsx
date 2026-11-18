import React from "react";
import CiteSection from "./Footer/CiteSection";

const DefaultPageContent = (props: { children: React.JSX.Element }) => {
  return (
    <div className="page-content">
      <div className="main-content">
        {props.children}
      </div>
      <CiteSection />
    </div>
  )
}

export default DefaultPageContent
