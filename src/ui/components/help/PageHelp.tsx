import React, { useContext } from 'react';
import { BookOpen } from 'lucide-react';
import { AppContext } from '../../App';
import { HelpContent } from './HelpContent';

export interface HelpTopic {
  name: string;    // help page (public/markdown/<name>.md or a content component), as HelpContent takes it
  title: string;
  section?: string;   // open the page at this anchor
}

// "Help for this page": the help topics that matter here, each opening in the help drawer (no ?: the topic's
// name says what it explains). All of Help is in the sidebar.
const PageHelp: React.FC<{ topics: HelpTopic[] }> = ({ topics }) => {
  const state = useContext(AppContext);
  if (!topics.length) return null;
  return (
    <nav className="page-help" aria-label="Help for this page">
      <BookOpen size={15} strokeWidth={1.75} aria-hidden="true" />
      <span className="page-help-label">Help</span>
      {topics.map(t => (
        <button key={t.title} type="button" className="page-help-link"
                onClick={() => state.updateState('drawer', <HelpContent name={t.name} section={t.section} />)}>
          {t.title}
        </button>
      ))}
    </nav>
  );
};

export default PageHelp;
