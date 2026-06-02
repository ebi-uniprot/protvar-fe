import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton, LinkedinIcon,
  LinkedinShareButton,
  TwitterShareButton,
  XIcon
} from "react-share"
import React, {useContext} from "react";
import {APP_URL, AppContext} from "../../App";
import {useLocation, useSearchParams} from "react-router-dom";

interface ShareLinkProps {
  shareUrl: string,
  title: string
}

/*
enum ShareType {
  Link, Download, Annotation
}
*/

export const ShareLink = (props: {url: string, linkText?: string, disabled?: boolean}) => {
  const state = useContext(AppContext)
  return <i className="bi bi-share icon-btn" title="Share"
            onClick={() => {
          navigator.clipboard.writeText(props.url);
          state.updateState("drawer", <ShareContent shareUrl={props.url} title={``} />)
        }}>{props.linkText && ` ${props.linkText}`}</i>
}

export const ShareAnnotationIcon = (props: {annotation: string}) => {
  const state = useContext(AppContext)
  const location = useLocation();
  let [searchParams,] = useSearchParams();

  return <button title="Share Annotation" onClick={() => {
    if (props.annotation) {
      searchParams.set("annotation", props.annotation);
    }
    const shareUrl = `${APP_URL}${location.pathname}?${searchParams.toString()}`
    navigator.clipboard.writeText(shareUrl);
    state.updateState("drawer", <ShareContent shareUrl={shareUrl} title={``} />)
  }} className="bi bi-share icon-btn"></button>
}

const ShareContent = (props: ShareLinkProps) => {
  return <>
    <h5>Share Link</h5>
    <p>
      URL copied to clipboard
      <br/>
      <code>
      {props.shareUrl}
    </code>
    </p>
    <p>Share on<br/>
      <EmailShareButton url={props.shareUrl}
                        subject={props.title}>
        <EmailIcon size={28} round/>
      </EmailShareButton> <TwitterShareButton
        url={props.shareUrl}
        title={props.title}>
        <XIcon size={28} round/>
      </TwitterShareButton> <FacebookShareButton url={props.shareUrl}>
        <FacebookIcon size={28} round/>
      </FacebookShareButton> <LinkedinShareButton url={props.shareUrl}>
        <LinkedinIcon size={28} round/>
      </LinkedinShareButton>
    </p>
  </>

}