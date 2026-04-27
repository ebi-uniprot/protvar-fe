import React, { useEffect, useState } from 'react';
import { useMarkdown } from '../../../context/MarkdownContext';
import { ActivityHelp } from './content/ActivityHelp';
import { AlphaFoldHelp } from './content/AlphaFoldHelp';
import { PredictionsHelp } from './content/PredictionsHelp';

interface HelpContentProps {
  name: string;
}

// Main HelpContent component
export const HelpContent: React.FC<HelpContentProps> = ({ name }) => {
  const { getMarkdownContent } = useMarkdown();
  const [content, setContent] = useState<React.JSX.Element | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      switch (name) {
        case 'activity':
        case 'search-history':   // backward compat
        case 'result-download':  // backward compat
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
          setContent(markdown);
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
