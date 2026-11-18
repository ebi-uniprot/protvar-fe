// SearchBox.tsx
import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HELP, SEARCH } from '../../../constants/BrowserPaths';
import { resolveIdentifier, singleIdPath } from '../../../utills/InputTypeResolver';
import { IdentifierType } from '../../../types/InputType';
import { Icon } from '../../elements/Icon';

interface SearchBoxProps {
  placeholder?: string;
  minLength?: number;
  className?: string;
}

// One of each kind the box takes; picked to be recognisable (sickle cell, a splice defect, BRCA2)
const EXAMPLES = ['rs334', 'NM_000249.4:c.543C>T', 'VAR_005932', 'P68871', 'BRCA2'];

// Variant IDs (dbSNP, ClinVar, COSMIC, UniProt): single words that would otherwise look like gene symbols
const VARIANT_ID = /^(rs\d+|[RV]CV\d+(\.\d+)?|COS[VMN]\d+|VAR_\d+)$/i;
// A gene symbol: one word, starts with a letter, 2-20 letters/digits/hyphen/underscore (BRCA2, HLA-A, NKX2-1),
// as the backend's InputTypeResolver.GENE_REGEX; plus no long numbers, which only variants have
const GENE_SYMBOL = /^[A-Za-z][A-Za-z0-9\-_]{1,19}$/;

const ID_LABEL: Partial<Record<IdentifierType, string>> = {
  uniprot: 'protein', ensembl: 'Ensembl ID', refseq: 'RefSeq ID', pdb: 'structure', gene: 'gene',
};

// What the input is: an identifier to browse, or else one variant to look up
function classify(raw: string): IdentifierType | null {
  const value = raw.trim();
  const idType = resolveIdentifier(value);
  if (idType && idType !== 'gene') return idType;
  // Single-word gene symbols browse their gene; anything else (variant ID, genomic, HGVS, protein) is a variant
  if (!VARIANT_ID.test(value) && GENE_SYMBOL.test(value) && !/\d{5,}/.test(value)) return 'gene';
  return null;
}

function buildUrl(raw: string): string {
  const value = raw.trim();
  const idType = classify(value);
  // An identifier opens its own browse page, as the home Browse tab does (titled Gene / Ensembl / UniProt …)
  return idType
    ? singleIdPath(idType, encodeURIComponent(value))
    : `${SEARCH}?q=${encodeURIComponent(value)}`;
}

const SearchBox: React.FC<SearchBoxProps> = ({
                                               placeholder = "Search a variant, gene or protein",
                                               minLength = 3,
                                               className = ""
                                             }) => {
  const [searchInput, setSearchInput] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const trimmed = searchInput.trim();
  const isSubmittable = trimmed.length >= minLength;
  const idType = isSubmittable ? classify(trimmed) : null;

  const go = (value: string) => {
    if (value.trim().length < minLength) return;
    setOpen(false);
    inputRef.current?.blur();
    navigate(buildUrl(value));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      go(searchInput);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div
      className={`search-box ${className}`}
      // Close when focus leaves the box and its panel (not when moving between them)
      onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false); }}
    >
      <Icon name="search" className="search-box-icon" aria-hidden="true" />
      <input
        ref={inputRef}
        type="text"
        title="Enter a variant (any supported format), or a gene, protein, Ensembl, RefSeq or PDB identifier"
        placeholder={placeholder}
        value={searchInput}
        onChange={(e) => { setSearchInput(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className="search-input"
        aria-label="Search ProtVar"
      />
      <button
        type="button"
        onClick={() => go(searchInput)}
        className="search-submit"
        disabled={!isSubmittable}
      >
        Search
      </button>

      {open && (
        <div className="search-box-panel">
          {isSubmittable && (
            <button type="button" className="search-box-panel-go" onClick={() => go(searchInput)}>
              <Icon name={idType ? 'card-list' : 'search'} />
              <span>
                {idType ? `Browse ${ID_LABEL[idType]} ` : 'Look up variant '}
                <strong>{trimmed}</strong>
              </span>
              <kbd>Enter</kbd>
            </button>
          )}
          <div className="search-box-panel-try">
            <span className="search-box-panel-label">Try</span>
            {EXAMPLES.map(ex => (
              <button key={ex} type="button" className="search-box-panel-chip" onClick={() => go(ex)}>{ex}</button>
            ))}
          </div>
          <p className="search-box-panel-hint">
            A variant in any <Link to={`${HELP}#input-formats`} onClick={() => setOpen(false)}>supported format</Link>,
            {' '}or a gene, UniProt, Ensembl, RefSeq or PDB ID to browse its variants.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBox;
