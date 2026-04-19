import React from "react";

interface BannerProps {
  text: React.ReactNode;
  onDismiss: () => void;
}

const DefaultPageContent = (props: { children: React.JSX.Element; banner: BannerProps | null }) => {
  return (
    <div className="page-content">
      {props.banner && (
        <div className="banner">
          <button className="dismiss-button" onClick={props.banner.onDismiss} aria-label="Dismiss">
            <i className="bi bi-x" />
          </button>
          <div className="banner-content">{props.banner.text}</div>
        </div>
      )}
      <div className="main-content">
        {props.children}
      </div>
    </div>
  )
}

export default DefaultPageContent
