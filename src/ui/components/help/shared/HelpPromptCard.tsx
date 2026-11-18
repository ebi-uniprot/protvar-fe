import React from 'react';
import { Icon } from '../../../elements/Icon';

// Left-bordered quote card for sample user prompts in help content (e.g. MCP
// example questions).
export const HelpPromptCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="help-prompt-card">
    <Icon name="chat-quote" className="help-prompt-card-icon" />
    <em>{children}</em>
  </div>
);
