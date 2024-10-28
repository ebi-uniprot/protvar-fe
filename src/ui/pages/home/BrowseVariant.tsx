import React, {useState} from 'react'
import "./BrowseVariant.css"
import {useNavigate} from "react-router-dom";


const UNIPROT_ACC_MIN_LEN = 6
const UNIPROT_ACC_MAX_LEN = 10
const UNIPROT_ACC_REGEX = /^([OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2})(?:-[1-9]|[1-9][0-9])?$/i

const BrowseVariant = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setError(''); // Clear error message when user starts typing
  };

  const handleSubmit = () => {
    const trimmedValue = inputValue.trim();

    // Check if the trimmed value matches the regex pattern
    if (trimmedValue === '') {
      setError('The input value is empty');
    } else if (trimmedValue.length < UNIPROT_ACC_MIN_LEN
      || trimmedValue.length > UNIPROT_ACC_MAX_LEN
      || !UNIPROT_ACC_REGEX.test(trimmedValue)) {
      setError("Not valid UniProt accession")
    } else {
      navigate(trimmedValue.toUpperCase())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }

  const submitDisabled = inputValue.trim() ? false : true;

  return (
    <div id="search" className="card-table search">
      <div className="card">
        <section className="search-card__actions" style={{backgroundColor: '#9fccaf'}}>
          <span className="search-card-header">
            <p>
              <b>Browse ProtVar</b> - enter a single UniProt accession below
            </p>
          </span>
        </section>
        <section className="card--has-hover top-row" role="button">
          <div className="card__content">
            <div className="search-box-container">
              <select className="search-select">
                <option value="1">Protein (UniProt)</option>{/*
                <option value="2" disabled={true}>Protein (PDBe)</option>
                <option value="3" disabled={true}>Gene (HGNC)</option>
                <option value="4" disabled={true}>Gene (Ensembl ID)</option>
                <option value="5" disabled={true}>Gene (RefSeq)</option>*/}
              </select>
              <input type="text" className="search-input"
                     value={inputValue}
                     onChange={handleInputChange}
                     onKeyDown={handleKeyDown}
                     placeholder="Search..."/>
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
