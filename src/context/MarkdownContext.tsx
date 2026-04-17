import React, { createContext, useContext, useState } from 'react';
import { HELP } from '../constants/BrowserPaths';
import { marked } from 'marked';

interface MarkdownMap {
  [fileName: string]: React.JSX.Element | null;
}

interface MarkdownContextType {
  markdownMap: MarkdownMap;
  getMarkdownContent: (fileName: string) => Promise<React.JSX.Element | null>;
}

const MarkdownContext = createContext<MarkdownContextType | undefined>(undefined);

export const useMarkdown = (): MarkdownContextType => {
  const context = useContext(MarkdownContext);
  if (!context) throw new Error('useMarkdown must be used within a MarkdownProvider');
  return context;
};

const filePath = 'markdown/';
const fileExt = '.md';

// Create a custom renderer
const renderer = new marked.Renderer();

// Override link rendering
renderer.link = (href, title, text) => {
  // Internal anchor links: prefix with /help so they navigate to the right section
  if (href && href.startsWith('#')) {
    href = `${process.env.PUBLIC_URL}${HELP}${href}`;
    const titleAttr = title ? ` title="${title}"` : '';
    return `<a href="${href}"${titleAttr}>${text}</a>`;
  }
  // All other links (internal example links and external URLs) open in a new tab
  const titleAttr = title ? ` title="${title}"` : '';
  return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
};

export const MarkdownProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [markdownMap, setMarkdownMap] = useState<MarkdownMap>({});

  const getMarkdownContent = async (fileName: string): Promise<React.JSX.Element | null> => {
    if (markdownMap[fileName]) return markdownMap[fileName];

    try {
      const response = await fetch(filePath + fileName + fileExt);
      const text = await response.text();
      if (!text) return null;

      // Fix internal anchor links to include /help#
      //const processedText = text.replace(/href="#/g, `href="${HELP}#`);

      const html = marked.parse(text, { gfm: true, breaks: true, renderer });

      // Wrap in help-content for isolated styling
      const markdownElement = (
        <div className="help-content" dangerouslySetInnerHTML={{ __html: html }} />
      );

      setMarkdownMap(prev => ({ ...prev, [fileName]: markdownElement }));

      return markdownElement;
    } catch (error) {
      console.error('Error fetching markdown file:', error);
      return <div className="help-content"><p>Help content not available.</p></div>;
    }
  };

  return (
    <MarkdownContext.Provider value={{ markdownMap, getMarkdownContent }}>
      {children}
    </MarkdownContext.Provider>
  );
};
