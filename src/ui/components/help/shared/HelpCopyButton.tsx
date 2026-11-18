import React, { useState } from 'react';
import { Icon } from '../../../elements/Icon';

// Inline "copy to clipboard" button used inside help content (e.g. next to a
// command in HelpCommandBlock). Styles live in components/help-content.css.
export const HelpCopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      title="Copy to clipboard"
      className={`help-copy-btn${copied ? ' help-copy-btn--copied' : ''}`}
      onClick={() => {
        navigator.clipboard?.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      <Icon name={copied ? 'check2' : 'clipboard'} />
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
};
