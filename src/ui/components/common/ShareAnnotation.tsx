import {useLocation, useSearchParams} from "react-router-dom";
import React from "react";
import {APP_URL} from "../../App";

function ShareAnnotation(props: {annotation: string}) {
  const location = useLocation();
  let [searchParams,] = useSearchParams();

  return <button title="Share" onClick={() => {
    if (props.annotation) {
      searchParams.set("annotation", props.annotation);
    }
    const shareUrl = `${APP_URL}${location.pathname}?${searchParams.toString()}`
    navigator.clipboard.writeText(shareUrl);
    alert(`URL copied: ${shareUrl}`)
  }} className="bi bi-share ann-share-btn"></button>

}

export default ShareAnnotation;