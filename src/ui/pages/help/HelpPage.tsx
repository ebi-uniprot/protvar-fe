import DefaultPageLayout from "../../layout/DefaultPageLayout";
import "./HelpPage.css";
import React, {Fragment, useEffect, useState} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import rehypeRaw from "rehype-raw";
import {uriTransformer} from "react-markdown";
import {useLocation} from 'react-router-dom';
import {TITLE} from "../../../constants/const";
import {ReactComponent as ChevronDownIcon} from "../../../images/chevron-down.svg"

interface HelpSection {
  title: string
  content: string
}

let sections: HelpSection[] = [
  {title: 'Website', content: ''},
  {title: 'Download File', content: ''},
  {title: 'API', content: ''},
  {title: 'Direct Variant Link', content: ''}
]

const markdowns = ['website.md', 'download.md', 'api.md', 'directlink.md'];
const fetchPromises = markdowns.map(url => fetch(url).then(response => response.text()));


function loadContent() {
  Promise.all(fetchPromises)
    .then(responses => {
      responses.map((response, index) => sections[index]["content"] = response);
    })
}

function HelpPageContent() {
  const [expandedRowKey, setExpandedRowKey] = useState('')
  function toggleRow(key: string) {
    setExpandedRowKey(expandedRowKey === key ? '' : key)
  }

  useEffect(() => {
    document.title = 'Help - ' + TITLE;
    loadContent();
  }, []);

  const addHelpPrefix = function (uri: string) {
    if (uri.startsWith('#'))
      return window.location.pathname + uri
    return uriTransformer(uri)
  }

  const {hash} = useLocation();
  useEffect(() => {
    // if not a hash link, scroll to top
    if (hash === '') {
      window.scrollTo(0, 0);
    } else { // else scroll to id
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView();
        }
      }, 0);
    }
  }, [hash]); // do this on route change

  return <div className="container help">
    <h4>Help</h4>
    {
      Object.values(sections).map((s: HelpSection, index: number) => {
        let key = `help#sec-${index + 1}`
        return <Fragment key={key}>
          <button type="button" className="collapsible" onClick={(e) => toggleRow(key)}>
              {`${index+1}. ${s.title}`}
            <ChevronDownIcon className="chevronicon"/>
          </button>
          {(key === expandedRowKey) && <div style={{padding: '20px'}}>
            <ReactMarkdown rehypePlugins={[rehypeRaw]} transformLinkUri={addHelpPrefix}
                           remarkPlugins={[remarkGfm]}>{s.content}</ReactMarkdown>
          </div>
          }
        </Fragment>
      })
    }
  </div>
}

function HelpPage() {
  return <DefaultPageLayout content={<HelpPageContent/>}/>
}

export default HelpPage;