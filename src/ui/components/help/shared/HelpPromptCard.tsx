import React from 'react';

// Left-bordered quote card for sample user prompts in help content (e.g. MCP
// example questions).
export const HelpPromptCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="help-prompt-card">
    <i className="bi bi-chat-quote help-prompt-card-icon" />
    <em>{children}</em>
  </div>
);
