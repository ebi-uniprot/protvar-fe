import React, {useState} from 'react'
import "./BrowseVariant.css"
import {useNavigate} from "react-router-dom";
import {resolve, normalize} from "../../../utills/InputTypeResolver";
import {InputType} from "../../../types/InputType";

const inputExamples: Record<string, string> = {
  [InputType.UNIPROT]: 'e.g. P22304',
  [InputType.ENSEMBL]: 'e.g. ENSG00000139618',
  [InputType.GENE]: 'e.g. BRCA2',
  [InputType.PDB]: 'e.g. 6ioz',
  [InputType.REFSEQ]: 'e.g. NM_000059.4',
  [InputType.INPUT_ID]: 'e.g. genomic input examples',
};

const BrowseVariant = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setError(''); // Clear error message when user starts typing
  };

  const handleSelectedTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
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
    const typeParam = selectedType ? `?type=${selectedType.toLowerCase()}` : '';
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
                <option value={InputType.GENE}>Gene Symbol</option>
                <option value={InputType.VARIANT}>Variant</option>
                <option value={InputType.REFSEQ}>RefSeq ID</option>
                <option value={InputType.ENSEMBL}>Ensembl ID</option>
                <option value={InputType.UNIPROT}>UniProt ID</option>
                <option value={InputType.PDB}>PDB ID</option>
                <option value={InputType.INPUT_ID}>Input ID</option>
              </select>
              <input type="text" className="search-input"
                     value={input}
                     onChange={handleInputChange}
                     onKeyDown={handleKeyDown}
                     placeholder={selectedType ? inputExamples[selectedType] : "Search..."}/>
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
