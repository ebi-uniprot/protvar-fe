import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMarkdown } from '../../../context/MarkdownContext';
import { HELP } from '../../../constants/BrowserPaths';
import { ActivityHelp } from './content/ActivityHelp';
import { AlphaFoldHelp } from './content/AlphaFoldHelp';
import { PredictionsHelp } from './content/PredictionsHelp';

interface HelpContentProps {
  name: string;
}

const HelpNotFound: React.FC<{ name: string }> = ({ name }) => (
  <div className="help-content">
    <h1>Topic not found</h1>
    <p>
      We couldn't find a help topic called <code>{name}</code>.{' '}
      <Link to={HELP}>See all help topics</Link>.
    </p>
  </div>
);

export const HelpContent: React.FC<HelpContentProps> = ({ name }) => {
  const { getMarkdownContent } = useMarkdown();
  const [content, setContent] = useState<React.JSX.Element | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      switch (name) {
        case 'activity':
          setContent(<ActivityHelp />);
          break;
        case 'alphafold':
          setContent(<AlphaFoldHelp />);
          break;
        case 'predictions':
          setContent(<PredictionsHelp />);
          break;
        default:
          const markdown = await getMarkdownContent(name);
          setContent(markdown ?? <HelpNotFound name={name} />);
      }
      setLoading(false);
    };
    loadContent();
  }, [name, getMarkdownContent]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {content}
    </div>
  );
};
