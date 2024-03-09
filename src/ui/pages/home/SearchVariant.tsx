import React, { useState, useRef } from 'react'
import Button from '../../elements/form/Button'
import { FileLoadFun } from '../../../utills/AppHelper'
import {
  Assembly,
  DEFAULT_ASSEMBLY,
  StringVoidFun,
} from '../../../constants/CommonTypes'
import {
  CDNA_BTN_TITLE,
  CDNA_EXAMPLE,
  GENOMIC_BTN_TITLE,
  GENOMIC_EXAMPLE, ID_BTN_TITLE,
  ID_EXAMPLE,
  PASTE_BOX, PROTEIN_BTN_TITLE,
  PROTEIN_EXAMPLE
} from "../../../constants/Example";

interface VariantSearchProps {
  isLoading: boolean
  assembly: Assembly
  updateAssembly: (assembly: Assembly) => void
  fetchPasteResult: StringVoidFun
  fetchFileResult: FileLoadFun
}

const SearchVariant = (props: VariantSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [assembly, setAssembly] = useState(props.assembly);
  const [file, setFile] = useState<File | null>(null);
  const [invalidInput, setInvalidInput] = useState(false);
  const [invalidMsg, setInvalidMsg] = useState('');
  const uploadInputField = useRef<HTMLInputElement>(null);
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const UNSUPPORTED_FILE = 'Unsupported file type';
  const FILE_EXCEEDS_LIMIT = 'File exceeds 10MB limit';

  const update = (a: Assembly) => {
    setAssembly(a); // set assembly in the search variant form
    props.updateAssembly(a); // set assembly in the top-level
  }

  const genomicExamples = () => {
    setSearchTerm(GENOMIC_EXAMPLE)
  };

  const cDNAExamples = () => {
    setSearchTerm(CDNA_EXAMPLE)
  };

  const proteinExamples = () => {
    setSearchTerm(PROTEIN_EXAMPLE)
    update(DEFAULT_ASSEMBLY)
  };

  const idExamples = () => {
    setSearchTerm(ID_EXAMPLE)
    update(DEFAULT_ASSEMBLY)
  };

  const viewResult = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    if (!target.files || !(target.files.length > 0)) {
      return
    }
    var file = target.files[0]
    if (!file.type.startsWith('text/')) {
      setInvalidInput(true);
      setInvalidMsg(UNSUPPORTED_FILE);
    } else if (file.size > MAX_FILE_SIZE) {
      setInvalidInput(true);
      setInvalidMsg(FILE_EXCEEDS_LIMIT);
    } else {
      setFile(file);
      setInvalidInput(false);
    }
    
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (file) {
      props.fetchFileResult(file);
      // file takes precendence over text search
      return;
    }
    if (searchTerm !== '') {
      props.fetchPasteResult(searchTerm) 
    }
  }

  const clearFileInput = () => {
    if ( uploadInputField?.current) {
      const fileInput = uploadInputField.current;
      fileInput.value = '';
      setFile(null);
    }
  }

  return (
    <div id="search" className="card-table search">
      <div className="card">
        <section className="search-card__actions">
          <span className="search-card-header">
            <p>
              <b>Search Variants</b> - Please paste your variants below or
              upload your file
            </p>
          </span>
        </section>
        <section className="card--has-hover top-row" role="button">
          <div className="card__content">
            <section className="search-card">
              <textarea
                id="main-textarea-search-field"
                className={`main-textarea-search-field ${file ? 'disable' : ''}`}
                value={searchTerm}
                placeholder={PASTE_BOX}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="search-card-selection">
                <div>
                <b>Examples:</b><br />
                <div className="examples-container">

                  <button
                    onClick={genomicExamples}
                    className="example-link"
                    id="genomicExamples"
                    title={GENOMIC_BTN_TITLE}
                  >
                    Genomic
                  </button>

                  <button
                    onClick={cDNAExamples}
                    className="example-link"
                    id="cDNAExamples"
                    title={CDNA_BTN_TITLE}
                  >
                    cDNA
                  </button>

                  <button
                    onClick={proteinExamples}
                    className="example-link"
                    id="proteinExamples"
                    title={PROTEIN_BTN_TITLE}
                  >
                    Protein
                  </button>

                  <button
                    onClick={idExamples}
                    className="example-link"
                    id="idExamples"
                    title={ID_BTN_TITLE}
                  >
                    Variant ID
                  </button>
                </div>
                </div>

                <div className="assembly">
                  <span title="Genome assembly GRCh37 to GRCh38 conversion for genomic inputs (VCF, HGVS g., gnomAD and any other custom genomic formats).">
                    <b>Reference Genome Assembly</b>
                  </span>
                  <div className="assembly-radio-check">
                    <label>
                      <input
                        type="radio"
                        name="grch"
                        value="auto"
                        checked={assembly === Assembly.AUTO}
                        onChange={() => update(Assembly.AUTO)}
                      />
                      Auto-detect
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="grch"
                        value="grch38"
                        checked={assembly === Assembly.GRCh38}
                        onChange={() => update(Assembly.GRCh38)}
                      />
                      GRCh38
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="grch"
                        value="grch37"
                        checked={assembly === Assembly.GRCh37}
                        onChange={() => update(Assembly.GRCh37)}
                      />
                      GRCh37
                    </label>
                  </div>

                  <div>
                    <span>
                      <b>Supported file formats</b><br />
                    </span>
                    <p className='supported-file-text'>
                      ProtVar accepts any files that are in plain text format (i.e. .txt, .csv)
                    </p>
                    <input
                      id="myInput"
                      type="file"
                      style={{ display: 'none' }}
                      ref={uploadInputField}
                      onChange={viewResult}
                    />
                    <Button
                    onClick={
                      file
                        ? clearFileInput
                        : () => uploadInputField.current?.click()
                    }
                    className={`file-upload ${file ? 'clear-file bi bi-x-lg': 'bi bi-file-earmark-fill'}`}
                  >
                    {' '}{file ? 'Clear file' : 'Upload File'
                     }
                  </Button>
                    {invalidInput && (
                      <span className="padding-left-1x">
                      <i className="file-warning bi bi-exclamation-triangle-fill"></i>{' '}
                        {invalidMsg}
                      </span>
                    )}
                    {file?.name && (
                      <div className='file-name'>
                        <i className="bi bi-check-circle tick-icon"></i>
                        <span className='name'>{file?.name.substring(0, file.name.lastIndexOf('.'))}</span>
                        <span className='extension'>{file?.name.substring(file.name.lastIndexOf('.'))}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="search-button-wrapper">
                  <Button
                    type="submit"
                    onClick={props.isLoading ? () => {} : handleSubmit}
                    className={`button-primary bi bi-box-arrow-right ${file || searchTerm ? '' : 'disable-submit'}`}
                    id="searchButton"
                  >
                    {' '}{props.isLoading ? 'Loading...' : 'Submit'}
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </div>
  )
}

export default SearchVariant
