import React, { useState, useMemo } from 'react';
import './ExpandableText.css';

interface ExpandableTextProps {
  text: string;
  charLimit?: number;
}

export const ExpandableText: React.FC<ExpandableTextProps> = ({
                                                                text,
                                                                charLimit = 300
                                                              }) => {
  const [expanded, setExpanded] = useState(false);

  // Helper function to convert PubMed references to links
  const convertPubMedLinks = (input: string): (string | React.JSX.Element)[] => {
    const regex = /PubMed:(\d+)/g;
    const parts: (string | React.JSX.Element)[] = [];
    let lastIndex = 0;
    let match;
    let keyCounter = 0;

    while ((match = regex.exec(input)) !== null) {
      if (match.index > lastIndex) {
        parts.push(input.substring(lastIndex, match.index));
      }

      parts.push('PubMed:');
      parts.push(
      <a
      key={`pubmed-${match[1]}-${keyCounter++}`}
      href={`https://pubmed.ncbi.nlm.nih.gov/${match[1]}`}
      target="_blank"
      rel="noopener noreferrer"
      className="pubmed-link"
        >
        {match[1]}
    </a>
    );

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < input.length) {
      parts.push(input.substring(lastIndex));
    }

    return parts;
  };

  const displayContent = useMemo(() => {
    const isTruncated = text.length > charLimit;

    // Determine text to display
    let displayText = text;
    if (!expanded && isTruncated) {
      displayText = text.substring(0, charLimit);
      const lastSpaceIndex = displayText.lastIndexOf(' ');
      if (lastSpaceIndex > charLimit - 20) {
        displayText = displayText.substring(0, lastSpaceIndex);
      }
      displayText += '...';
    }

    return convertPubMedLinks(displayText);
  }, [text, charLimit, expanded]);

  const isTruncated = text.length > charLimit;

  return (
    <div className="expandable-text">
      <span className="expandable-text-content">{displayContent}</span>
      {isTruncated && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="expandable-text-toggle"
          aria-label={expanded ? 'Show less' : 'Show more'}
          title={expanded ? 'Show less' : 'Show more'}
        >
          <i className={`bi bi-${expanded ? 'dash-square-dotted' : 'plus-square-dotted'}`}></i>
        </button>
      )}
    </div>
  );
};