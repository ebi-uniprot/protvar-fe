import React, {useState} from 'react'
import "./BrowseVariant.css"
import {useNavigate} from "react-router-dom";


const UNIPROT_ACC_MIN_LEN = 6
const UNIPROT_ACC_MAX_LEN = 10
const UNIPROT_ACC_REGEX = /^[OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2}$/

const BrowseVariant = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("")
  const [error, setError] = useState<string|null>(null)
  const validText = () => {
    if (text.trim().length < UNIPROT_ACC_MIN_LEN || text.trim().length > UNIPROT_ACC_MAX_LEN)
      return false
    return UNIPROT_ACC_REGEX.test(text)
  }

  const handleSubmit = () => {
    setError(null)
    if (!validText()) {
      setError("Not valid UniProt accession")
    } else {
      navigate(text)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter") {
      if (text.trim()) {
        handleSubmit()
      }
    }
  }

  return (
    <div id="search" className="card-table search">
      <div className="card">
        <section className="search-card__actions" style={{backgroundColor: '#9fccaf'}}>
          <span className="search-card-header">
            <p>
              <b>Browse whole protein</b> - enter a single UniProt accession below
            </p>
          </span>
        </section>
        <section className="card--has-hover top-row" role="button">
          <div className="card__content">
            <div className="search-box-container">
              <select className="search-select">
                <option value="1">Protein (UniProt)</option>
                <option value="2" disabled={true}>Protein (PDBe)</option>
                <option value="3" disabled={true}>Gene (HGNC)</option>
                <option value="4" disabled={true}>Gene (Ensembl ID)</option>
                <option value="5" disabled={true}>Gene (RefSeq)</option>
              </select>
              <input type="text" value={text}
                     onKeyDown={e => handleKeyDown(e)}
                     onChange={e=> { setError(null); setText(e.target.value)}} className="search-input" placeholder="Search..."/>
              <button className="search-button btn btn-primary"
              disabled={text.trim() ? false : true}
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
