// SearchBox.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEARCH } from '../../../constants/BrowserPaths';
import { resolveIdentifier } from '../../../utills/InputTypeResolver';

interface SearchBoxProps {
  placeholder?: string;
  minLength?: number;
  className?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
                                               placeholder = "Search variant, protein, gene...",
                                               minLength = 3,
                                               className = ""
                                             }) => {
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  const buildUrl = (raw: string): string => {
    const trimmed = raw.trim();
    // Detect unambiguous biological identifiers — route to ID browse page
    const idType = resolveIdentifier(trimmed);
    if (idType && idType !== 'gene') {
      // gene is too ambiguous (could also be part of a variant description)
      return `${SEARCH}?id=${idType}:${encodeURIComponent(trimmed)}`;
    }
    return `${SEARCH}?q=${encodeURIComponent(trimmed)}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmedInput = searchInput.trim();
      if (trimmedInput.length >= minLength) {
        navigate(buildUrl(trimmedInput));
      }
    }
  };

  const handleSubmit = () => {
    const trimmedInput = searchInput.trim();
    if (trimmedInput.length >= minLength) {
      navigate(buildUrl(trimmedInput));
    }
  };

  const isSubmittable = searchInput.trim().length >= minLength;

  return (
    <div className={`search-box ${className}`}>
      <input
        type="text"
        title="Enter a supported variant format or identifier to browse..."
        placeholder={placeholder}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="search-input"
      />
      <button
        type="button"
        onClick={handleSubmit}
        className="search-icon-button"
        disabled={!isSubmittable}
      >
        <i className="bi bi-search search-icon"></i>
      </button>
    </div>
  );
};

export default SearchBox;
