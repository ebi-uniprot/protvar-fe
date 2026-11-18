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
import { Icon } from '../../elements/Icon';
import { buildAnnotationParam, parseAnnotationKey, setAnnotationParam } from '../../pages/result/annotationUrl';

interface ShareLinkProps {
  shareUrl: string,
  title: string
}

/*
enum ShareType {
  Link, Download, Annotation
}
*/

export const ShareLink = (props: {url: string, linkText?: string, disabled?: boolean, className?: string}) => {
  const state = useContext(AppContext)
  return <button type="button" className={props.className ?? 'icon-btn'} title="Copy a link to share"
            disabled={props.disabled}
            onClick={() => {
          navigator.clipboard?.writeText(props.url).catch(() => {});   // the panel shows the link anyway
          state.updateState("drawer", <ShareContent shareUrl={props.url} title={``} />)
        }}><Icon name="share" />{props.linkText && ` ${props.linkText}`}</button>
}

export const ShareAnnotationIcon = (props: {annotation: string, withText?: boolean}) => {
  const state = useContext(AppContext)
  const location = useLocation();
  let [searchParams,] = useSearchParams();

  return <button title="Share Annotation" onClick={() => {
    // the short URL form (?ann=fun, str-2…), not the internal row key
    const parsed = parseAnnotationKey(props.annotation);
    if (parsed) setAnnotationParam(searchParams, buildAnnotationParam(parsed.type, parsed.rowNumber, true));
    const shareUrl = `${APP_URL}${location.pathname}?${searchParams.toString()}`
    navigator.clipboard?.writeText(shareUrl).catch(() => {});
    state.updateState("drawer", <ShareContent shareUrl={shareUrl} title={``} />)
  }} className={props.withText ? 'annotation-share' : 'icon-btn'}><Icon name="share" />{props.withText && ' Share'}</button>
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