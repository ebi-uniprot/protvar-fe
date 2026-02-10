import React, { useEffect, useState } from 'react';
import { useMarkdown } from '../../../context/MarkdownContext';
import { SearchHistoryHelp } from './content/SearchHistoryHelp';
import { ResultDownloadHelp } from './content/ResultDownloadHelp';
import { AlphaFoldHelp } from './content/AlphaFoldHelp';

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
        case 'search-history':
          setContent(<SearchHistoryHelp />);
          break;
        case 'result-download':
          setContent(<ResultDownloadHelp />);
          break;
        case 'alphafold':
          setContent(<AlphaFoldHelp />);
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
