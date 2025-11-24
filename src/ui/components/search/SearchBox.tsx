// SearchBox.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QUERY } from '../../../constants/BrowserPaths';
import './SearchBox.css';

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmedInput = searchInput.trim();
      if (trimmedInput.length >= minLength) {
        navigate(QUERY + '?search=' + encodeURIComponent(trimmedInput));
      }
    }
  };

  const handleSubmit = () => {
    const trimmedInput = searchInput.trim();
    if (trimmedInput.length >= minLength) {
      navigate(QUERY + '?search=' + encodeURIComponent(trimmedInput));
    }
  };

  const isSubmittable = searchInput.trim().length >= minLength;

  return (
    <div className={`search-box ${className}`}>
      <input
        type="text"
        title="Enter a variant, protein, gene..."
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