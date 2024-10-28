import React, { createContext, useState, useContext} from 'react';
import ReactMarkdown, {uriTransformer} from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import {HELP} from "../constants/BrowserPaths";

// Define the interface for your markdown map
interface MarkdownMap {
  [key: string]: JSX.Element | null; // Update to allow null values initially
}

// Define the shape of the context
interface MarkdownContextType {
  markdownMap: MarkdownMap;
  getMarkdownContent: (fileName: string) => Promise<JSX.Element | null>; // Update to return a Promise
}

// Create the context with an empty default value
const MarkdownContext = createContext<MarkdownContextType | undefined>(undefined);

// Hook for easy access to the context
export const useMarkdown = (): MarkdownContextType => {
  const context = useContext(MarkdownContext);
  if (!context) {
    throw new Error('useMarkdown must be used within a MarkdownProvider');
  }
  return context;
};

const filePath = "markdown/"
const fileExt = ".md"

// Provider component to wrap the app and provide the markdown data
export const MarkdownProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [markdownMap, setMarkdownMap] = useState<MarkdownMap>({});

  const addHelpPrefix = function (uri: string) {
    if (uri.startsWith('#'))
      return "/ProtVar" + HELP + uri //window.location.pathname + uri
    return uriTransformer(uri)
  }

  // Function to retrieve markdown content
  const getMarkdownContent = async (fileName: string): Promise<JSX.Element | null> => {
    // Check if the markdown file is already loaded
    if (markdownMap[fileName]) {
      return markdownMap[fileName]; // Return the cached content
    }

    // Load the markdown file if it's not already loaded
    try {
      const response = await fetch(filePath + fileName + fileExt);
      const text = await response.text();

      if (text) {
        const markdownElement = (
          <div className="help">
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              transformLinkUri={addHelpPrefix}
              remarkPlugins={[remarkGfm]}
            >
              {text}
            </ReactMarkdown>
          </div>
        );

        // Update the markdown map with the newly loaded content
        setMarkdownMap((prevMap) => ({
          ...prevMap,
          [fileName]: markdownElement,
        }));

        return markdownElement;
      }
    } catch (error) {
      console.error('Error fetching markdown file:', error);
    }

    return null; // Return null if the file could not be loaded
  };

  return (
    <MarkdownContext.Provider value={{ markdownMap, getMarkdownContent }}>
      {children}
    </MarkdownContext.Provider>
  );
};