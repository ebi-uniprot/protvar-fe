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
  const [content, setContent] = useState<JSX.Element | null>(null);

  useEffect(() => {
    document.title = 'Help - ' + TITLE;
    const hash = location.hash.slice(1); // Remove the '#'
    const [id] = hash.split(':');
    setContent(<HelpContent name={id} />);
    // Scroll to the subsection if it exists
    setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 500);
  }, [location]);

  return <div className="container">
      <h5>ProtVar Help</h5>
      <TableOfContent />
      {content}
    </div>
}

const TableOfContent = () => {
  return (
    <div className="grid-container">
      {HELP_FILES.map((f) => (
        <Link key={`help-file-${f.name}`} to={`${HELP}#${f.name}`} className="grid-item">
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