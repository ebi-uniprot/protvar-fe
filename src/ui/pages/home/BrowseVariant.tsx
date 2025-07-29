import React, {useState} from 'react'
import "./BrowseVariant.css"
import {useNavigate} from "react-router-dom";
//import {resolve, normalize} from "../../../utills/InputTypeResolver";
import {InputType, INPUT_TYPE_LABELS, INPUT_TYPE_EXAMPLES} from "../../../types/InputType";

const BrowseVariant = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState('')
  const [selectedType, setSelectedType] = useState<InputType | ''>('') // Empty string for auto-detect
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setError(''); // Clear error message when user starts typing
  };

  const handleSelectedTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value as InputType | '');
    setError('');
  };

  const handleSubmit = () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      setError('Input value cannot be empty.');
      return;
    }
/*
    const detectedType = resolve(trimmedInput);

    // If user explicitly selected a type, validate input against that type's regex
    if (selectedType) {
      // Backend and client should agree on these type strings or add a mapping if different
      if (!detectedType) {
        setError(`Input does not match any supported type.`);
        return;
      }
      // If user picked UniProt but detectedType isn't UNIPROT, error out
      if (selectedType !== detectedType) {
        setError(`Input does not match the selected type ${selectedType}.`);
        return;
      }
    }

    // Navigate and pass type param only if specified
    const effectiveType = selectedType || detectedType;
    const normalized = normalize(trimmedInput, effectiveType || '');
    const typeParam = effectiveType ? `?type=${effectiveType.toLowerCase()}` : '';
    //navigate(`/search?input=${normalized}&type=${effectiveType.toLowerCase()}`);
    navigate(`${normalized}${typeParam}`);
    */
    // Simply navigate with input and optional type hint
    // Let the backend resolve and validate
    const typeParam = selectedType ? `?type=${selectedType}` : '';
    navigate(`${trimmedInput}${typeParam}`);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }

  const submitDisabled = input.trim() ? false : true;

  return (
    <div id="search" className="card-table search">
      <div className="card">
        <section className="search-card__actions" style={{backgroundColor: '#9fccaf'}}>
          <span className="search-card-header">
            <p>
              <b>Browse ProtVar</b> - enter input (type optional)
            </p>
          </span>
        </section>
        <section className="card--has-hover top-row" role="button">
          <div className="card__content">
            <div className="search-box-container">
              <select className="search-select" value={selectedType} onChange={handleSelectedTypeChange}>
                <option value="">Input type (auto-detect)</option>
                <option value="gene">{INPUT_TYPE_LABELS.gene}</option>
                <option value="variant">{INPUT_TYPE_LABELS.variant}</option>
                <option value="refseq">{INPUT_TYPE_LABELS.refseq}</option>
                <option value="ensembl">{INPUT_TYPE_LABELS.ensembl}</option>
                <option value="uniprot">{INPUT_TYPE_LABELS.uniprot}</option>
                <option value="pdb">{INPUT_TYPE_LABELS.pdb}</option>
                <option value="input_id">{INPUT_TYPE_LABELS.input_id}</option>
              </select>
              <input type="text" className="search-input"
                     value={input}
                     onChange={handleInputChange}
                     onKeyDown={handleKeyDown}
                     placeholder={selectedType ? INPUT_TYPE_EXAMPLES[selectedType] : "Search..."}/>
              <button className="search-button btn btn-primary"
                      disabled={submitDisabled}
                      onClick={handleSubmit}>
                <i className="bi bi-search"></i>
              </button>
            </div>
            {error && (
              <span className="padding-left-1x">
                      <i className="file-warning bi bi-exclamation-triangle-fill"></i>{' '}
                {error}
                      </span>
            )}

          </div>
        </section>
      </div>

    </div>
  )
}

export default BrowseVariant
