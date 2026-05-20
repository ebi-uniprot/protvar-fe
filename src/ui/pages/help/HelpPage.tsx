import DefaultPageLayout from "../../layout/DefaultPageLayout";
import React, {useEffect, useState} from "react";
import {Link, useLocation} from 'react-router-dom';
import {TITLE} from "../../../constants/const";
import {HelpContent} from "../../components/help/HelpContent";
import {HELP} from "../../../constants/BrowserPaths";

interface HelpItem {
  name: string;
  title: string;
  children?: HelpItem[];
}

interface HelpSection {
  label: string;
  icon: string;
  items: HelpItem[];
}

export const HELP_SECTIONS: HelpSection[] = [
  {
    label: 'Getting Started',
    icon: 'bi-rocket-takeoff',
    items: [
      {
        name: 'annotate',
        title: 'Annotate Variants',
        children: [
          { name: 'input-formats',      title: 'Supported Formats' },
          { name: 'assembly-detection', title: 'Assembly Detection' },
        ],
      },
      { name: 'browse',          title: 'Browse by Identifier' },
      { name: 'semantic-search', title: 'Semantic Search' },
    ],
  },
  {
    label: 'Understanding Results',
    icon: 'bi-table',
    items: [
      { name: 'results',    title: 'Results' },
      { name: 'function',   title: 'Function' },
      { name: 'population', title: 'Population' },
      { name: 'structure',  title: 'Structure' },
    ],
  },
  {
    label: 'Predictions & Tools',
    icon: 'bi-cpu',
    items: [
      { name: 'predictions',     title: 'Predictions' },
      { name: 'alphafold',       title: 'AlphaFold' },
      { name: 'feature-ranking', title: 'UniProt Feature Ranking' },
    ],
  },
  {
    label: 'Downloads & Activity',
    icon: 'bi-download',
    items: [
      { name: 'download-panel',  title: 'Download Panel' },
      { name: 'download-format', title: 'Download File Format' },
      { name: 'activity',        title: 'Activity' },
    ],
  },
  {
    label: 'URL Linking & Sharing',
    icon: 'bi-link-45deg',
    items: [
      { name: 'protvar-links', title: 'ProtVar Links' },
    ],
  },
  {
    label: 'AI Access',
    icon: 'bi-robot',
    items: [
      { name: 'mcp', title: 'ProtVar MCP' },
    ],
  },
  {
    label: 'Reference',
    icon: 'bi-book',
    items: [
      { name: 'glossary',     title: 'Glossary' },
      { name: 'further-info', title: 'Further Information' },
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
    if (subsection) {
      // Wait for the new content to render, then scroll the subsection
      // anchor into view.
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    } else {
      // Top-level topic click — smooth-scroll back to the top so the user
      // lands at the start of the new content rather than wherever they
      // were scrolled in the previous one.
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
                  {item.children && (
                    <ul className="help-nav-items help-nav-children">
                      {item.children.map((child) => (
                        <li key={child.name}>
                          <Link
                            to={`${HELP}#${child.name}`}
                            className={`help-nav-item help-nav-child ${id === child.name ? 'active' : ''}`}
                          >
                            {child.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
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
