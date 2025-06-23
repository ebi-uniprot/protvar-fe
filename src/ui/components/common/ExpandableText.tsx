import React, { useState } from 'react';

interface ExpandableTextProps {
  text: string;
  charLimit?: number;
}

export const ExpandableText: React.FC<ExpandableTextProps> = ({ text, charLimit = 300 }) => {
  const [expanded, setExpanded] = useState(false);

  // Convert PubMed references to links
  const convertPubMedLinks = (input: string): (string | React.JSX.Element)[] => {
    const regex = /PubMed:(\d+)/g;
    const parts: (string | React.JSX.Element)[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(input)) !== null) {
      const before = input.substring(lastIndex, match.index);
      const pubmedId = match[1];
      parts.push(before + 'PubMed:');
      parts.push(<a
          key={match.index}
          href={`https://pubmed.ncbi.nlm.nih.gov/${pubmedId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {pubmedId}
        </a>
      );
      lastIndex = regex.lastIndex;
    }

    parts.push(input.substring(lastIndex)); // Add the rest of the string
    return parts;
  };

  const isTruncated = text.length > charLimit;

  const displayedText = expanded || !isTruncated ? text : text.substring(0, charLimit) + '...';

  return (
    <div className="text-sm text-gray-800">
      <span>{convertPubMedLinks(displayedText)}</span>
      {isTruncated && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-2 text-primary border-0 bg-transparent p-0 align-baseline"
          title={expanded ? 'Show less' : 'Show more'}
        >
          <i className={`bi ${expanded ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
        </button>
      )}
    </div>
  );
};