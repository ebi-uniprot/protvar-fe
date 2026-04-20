import DefaultPageLayout from "../../layout/DefaultPageLayout";
import React, {useEffect, useState} from "react";
import {Link, useLocation} from 'react-router-dom';
import {TITLE} from "../../../constants/const";
import {HelpContent} from "../../components/help/HelpContent";
import {HELP} from "../../../constants/BrowserPaths";

interface HelpSection {
  label: string;
  icon: string;
  items: { name: string; title: string }[];
}

const HELP_SECTIONS: HelpSection[] = [
  {
    label: 'Getting Started',
    icon: 'bi-rocket-takeoff',
    items: [
      { name: 'annotate-variants',            title: 'Annotate Variants' },
      { name: 'supported-variant-format',    title: 'Supported Formats' },
      { name: 'genomic-assembly-detection',  title: 'Assembly Detection' },
    ],
  },
  {
    label: 'Understanding Results',
    icon: 'bi-table',
    items: [
      { name: 'results',                 title: 'Results' },
      { name: 'function-annotations',    title: 'Function' },
      { name: 'population-observations', title: 'Population' },
      { name: 'structure-annotations',   title: 'Structure' },
    ],
  },
  {
    label: 'Predictions & Tools',
    icon: 'bi-cpu',
    items: [
      { name: 'predictions', title: 'Predictions' },
      { name: 'alphafold',   title: 'AlphaFold' },
    ],
  },
  {
    label: 'Downloads',
    icon: 'bi-download',
    items: [
      { name: 'result-download',  title: 'Result Download' },
      { name: 'download-options', title: 'Download Panel' },
      { name: 'downloads-page',   title: 'Downloads Page' },
      { name: 'download-file',    title: 'Download File Format' },
    ],
  },
  {
    label: 'Advanced',
    icon: 'bi-gear',
    items: [
      { name: 'search-history',           title: 'Search History' },
      { name: 'protvar-links',            title: 'ProtVar Links' },
      { name: 'semantic-search',          title: 'Semantic Search' },
      { name: 'uniprot-feature-ranking',  title: 'UniProt Feature Ranking' },
      { name: 'api',                      title: 'API' },
      { name: 'further-info',             title: 'Further Information' },
    ],
  },
];

function HelpPageContent() {
  const location = useLocation();
  const [id, setId] = useState('');
  const [content, setContent] = useState<React.JSX.Element | null>(null);

  useEffect(() => {
    document.title = `Help | ${TITLE}`;
    const hash = location.hash.slice(1);
    const [section, subsection] = hash.split(':');
    setId(section);
    setContent(<HelpContent name={section} />);
    setTimeout(() => {
      if (subsection) {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 500);
  }, [location]);

  return (
    <div className="help-page">
      <aside className="help-nav">
        <h5 className="help-nav-title">Help Topics</h5>
        {HELP_SECTIONS.map((section) => (
          <div key={section.label} className="help-nav-section">
            <div className="help-nav-section-label">
              <i className={`bi ${section.icon}`} />
              {section.label}
            </div>
            <ul className="help-nav-items">
              {section.items.map((item) => (
                <li key={item.name}>
                  <Link
                    to={`${HELP}#${item.name}`}
                    className={`help-nav-item ${id === item.name ? 'active' : ''}`}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      <div className="help-main">
        {id ? (
          content
        ) : (
          <div className="help-welcome">
            <h5>ProtVar Help</h5>
            <p>Select a topic from the left to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function HelpPage() {
  return <DefaultPageLayout content={<HelpPageContent />} />;
}

export default HelpPage;
