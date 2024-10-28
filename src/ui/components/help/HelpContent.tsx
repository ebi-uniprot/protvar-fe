import React, {useEffect, useState} from "react";
import {ResultDownloadHelp} from "./content/ResultDownloadHelp";
import {SearchHistoryHelp} from "./content/SearchHistoryHelp";
import {useMarkdown} from "../../../context/MarkdownContext";
import {HELP_FILES} from "../../../constants/Help";
import {AlphaFoldHelp} from "./content/AlphaFoldHelp";

interface HelpContentProps {
  name: string
}

// Main HelpContent component
export const HelpContent = (props: HelpContentProps) => {
  // Markdown help
  const { getMarkdownContent } = useMarkdown(); // Use the context to get the content
  const [content, setContent] = useState<JSX.Element | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Start loading by default

  useEffect(() => {
    const loadContent = async () => {
      const helpFile = HELP_FILES.find(file => file.name === props.name);
      if (helpFile) {
        if (helpFile.md) {
          const markdownContent = await getMarkdownContent(props.name); // Fetch the markdown content
          setContent(markdownContent); // Set the markdown content
        } else {
          // Return the custom component for non-markdown help files
          setContent(<NonMarkdownHelp name={props.name} />);
        }
      }
      setLoading(false); // Stop loading
    };

    loadContent(); // Call the loading function when the component mounts
  }, [props.name, getMarkdownContent]); // Dependencies array

  return (
    <div>
      {loading && <p>Loading...</p>} {/* Display loading message */}
      {content} {/* Render the loaded content */}
    </div>
  );
}

// Separate component for fallback content
const NonMarkdownHelp = (props: { name: string }) => {
  switch (props.name) {
    case 'search-history':
      return <SearchHistoryHelp />;
    case 'result-download':
      return <ResultDownloadHelp />;
    case 'alphafold':
      return <AlphaFoldHelp />;
    default:
      return null;
  }
};