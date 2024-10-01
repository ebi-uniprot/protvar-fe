import DefaultPageLayout from "../../layout/DefaultPageLayout";
import "./HelpPage.css";
import React, {useEffect, useState} from "react";
import {Link, useLocation} from 'react-router-dom';
import {TITLE} from "../../../constants/const";
import {HelpContent} from "../../components/help/HelpContent";
import {HELP} from "../../../constants/BrowserPaths";
import {HELP_FILES} from "../../../constants/Help";

function HelpPageContent() {
  const location = useLocation();
  const [id, setId] = useState('')
  const [content, setContent] = useState<JSX.Element | null>(null);

  useEffect(() => {
    document.title = `Help - ${TITLE}`
    const hash = location.hash.slice(1); // Remove the '#'
    const [section, subsection] = hash.split(':');
    setId(section)
    setContent(<HelpContent name={section}/>);
    // Scroll to the subsection if it exists
    setTimeout(() => {
      if (subsection) {
        document.getElementById(hash)?.scrollIntoView({behavior: 'smooth', block: 'start'})
      }
    }, 500);
  }, [location]);

  return <div className="container">
      <h5>ProtVar Help</h5>
      <TableOfContent id={id} />
      {content}
    </div>
}

const TableOfContent = (props: {id: string}) => {
  return (
    <div className="grid-container">
      {HELP_FILES.map((f) => (
        <Link key={`help-file-${f.name}`} to={`${HELP}#${f.name}`} className={`grid-item ${props.id === f.name ? `grid-item-selected` : ``}`}>
          {f.title}
        </Link>
      ))}
    </div>
  );
};

function HelpPage() {
  return <DefaultPageLayout content={<HelpPageContent/>}/>
}

export default HelpPage;