import React from 'react';
import { HelpCopyButton } from './HelpCopyButton';

// Monospaced command block with an absolute-positioned copy button. Used in
// help content for shell commands or URLs the user is meant to copy.
export const HelpCommandBlock: React.FC<{ cmd: string }> = ({ cmd }) => (
  <div className="help-cmd-block">
    <code>{cmd}</code>
    <HelpCopyButton text={cmd} />
  </div>
);
