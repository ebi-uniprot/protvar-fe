import React, { useState, useRef } from 'react'
import Button from '../../elements/form/Button'
import {
  Assembly,
} from '../../../constants/CommonTypes'
import {AppState} from "../../App";

interface VariantSearchProps {
  loading: boolean
  state: AppState
  updateState: any
  submitData: any
}

const SearchVariant = (props: VariantSearchProps) => {

  const { loading, state, updateState, submitData } = props
  const { file, assembly } = state

  const [invalidInput, setInvalidInput] = useState(false);
  const [invalidMsg, setInvalidMsg] = useState('');
  const uploadInputField = useRef<HTMLInputElement>(null);
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const UNSUPPORTED_FILE = 'Unsupported file type';
  const FILE_EXCEEDS_LIMIT = 'File exceeds 10MB limit';

  const numTextInput = (inputStr: string) => {
    return inputStr.split(/[\n,]/)
      .filter(i => !i.trimStart().startsWith("#"))
      .length
  }

  const updateTextInput = (inputStr: string) => {
    updateState("textInput", inputStr)
    updateState("numTextInput", numTextInput(inputStr))
  }

  const genomicExamples = () => {
    updateTextInput(
      'X\t149498202\t.\tC\tG\n' +
      '10-43118436-A-C\n' +
      'NC_000002.12:g.233760498G>A\n' +
      '14 89993420 A/G',
    )
  };

  const cDNAExamples = () => {
    updateTextInput(
      'NM_004006.2:c.234C>G\n' +
      'NM_017547.4(FOXRED1):c.1289A>Gp.(Asn430Ser)\n' +
      'NM_014630.3(ZNF592):c.3136G>A p.(Gly1046Arg)\n',
    )
  };

  const proteinExamples = () => {
    updateTextInput(
      'NP_001305738.1:p.Pro267Ser\n' +
      'P22304 A205P\n' +
      'P07949 asn783thr\n' +
      'P22309 71 Gly Arg')
    updateState("assembly", Assembly.AUTO)
  };

  const idExamples = () => {
    updateTextInput('rs864622779\n' +
      'rs587778656\n' +
      'RCV001270034\n' +
      'VCV002573141\n' +
      'COSV10469109\n' +
      'COSM5381302\n' +
      'COSN5742537')
    updateState("assembly", Assembly.AUTO)
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
      updateState("file", file)
      setInvalidInput(false);
    }

  };
  /*
    const protACTitle =
      'Supported format examples:\n' +
      ' ACC X 999 Y\n' +
      ' ACC/X/999/Y\n' +
      ' ACC X/999/Y\n' +
      ' ACC 999 X Y\n' +
      ' ACC 999    X     Y\n' +
      ' ACC p.XXX999YYY\n' +
      ' ACC X999Y\n' +
      ' ACC 999 X/Y\n' +
      ' ACC 999 XXX/YYY\n' +
      ' ACC XXX999YYY\n' +
      ' ACC/999/YYY\n' +
      ' where\n' +
      ' ACC=protein accession,\n' +
      ' X=one letter ref AA, XXX=three letters ref AA (case-insensitive),\n' +
      ' Y=one letter variant AA, YYY=three letters variant AA (case-insensitive),\n' +
      ' 999=protein position.'

    const rsTitle = 'Search by Variant (rs) IDs.'
  */

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (file) {
      //props.fetchFileResult(file);
      // TODO: submitFile!
      // file takes precendence over text search
      return;
    }
    if (state.textInput !== '') {
      //props.fetchPasteResult(searchTerm)
      submitData()
    }
  }

  const clearFileInput = () => {
    if ( uploadInputField?.current) {
      const fileInput = uploadInputField.current;
      fileInput.value = '';
      updateState("file", null);
    }
  }

  const pasteBox: string =
    'Paste variants here. Genomic, cDNA, Protein and ID input types are accepted. Click on the examples to see supported ' +
    'formats. Mixed formats are allowed, however mixed genome assemblies are not.\n' +
    'Test inputs can be found to the right\n' +
    '\n' +
    'X\t149498202\t.\tC\tG\n' +
    'X-149498202-C-G\n' +
    'NC_000023.11:g.149498202C>G\n' +
    'P22304 A205P\n' +
    'rs864622779\n'

  return (
    <div id="search" className="card-table search">
      <div className="card">
        <section className="search-card__actions">
          <span className="search-card-header">
            <p>
              <b>Search single nucleotide variants</b> - Please paste your variants below or
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
                value={state.textInput}
                placeholder={pasteBox}
                onChange={(e) => updateTextInput(e.target.value)}
              />
              <div className="search-card-selection">
                <div>
                  <b>Examples:</b><br />
                  <div className="examples-container">

                    <button
                      onClick={genomicExamples}
                      className="example-link"
                      id="genomicExamples"
                      title="VCF ✅
                    gnomAD ✅
                    HGVS g. ✅
                    Custom genomic formats including the following
                    X 149498202 C G ✅ (without variant ID/lenient VCF)
                    X 149498202 C/G ✅
                    X 149498202 C>G ✅"
                    >
                      Genomic
                    </button>

                    <button
                      onClick={cDNAExamples}
                      className="example-link"
                      id="cDNAExamples"
                      title="HGVS c. (using RefSeq NM identifier) ✅"
                    >
                      cDNA
                    </button>

                    <button
                      onClick={proteinExamples}
                      className="example-link"
                      id="proteinExamples"
                      title="HGVS p. (using RefSeq NP identifier) ✅
                     Custom protein inputs including the following
                     P22304 A205P ✅
                     P07949 asn783thr ✅
                     P22309 71 Gly Arg ✅
                     P22304 205 A/P ✅"
                    >
                      Protein
                    </button>

                    <button
                      onClick={idExamples}
                      className="example-link"
                      id="idExamples"
                      title="DBSNP ✅
                    ClinVar ✅
                    COSMIC ✅
                    VARID ❌"
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
                        name="assembly"
                        value={Assembly.AUTO}
                        checked={assembly === Assembly.AUTO}
                        onChange={e => updateState("assembly", e.target.value) }
                      />
                      Auto-detect
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="assembly"
                        value={Assembly.GRCh38}
                        checked={assembly === Assembly.GRCh38}
                        onChange={e => updateState("assembly", e.target.value) }
                      />
                      GRCh38
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="assembly"
                        value={Assembly.GRCh37}
                        checked={assembly === Assembly.GRCh37}
                        onChange={e => updateState("assembly", e.target.value) }
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
                    onClick={loading ? () => {} : handleSubmit}
                    className={`button-primary bi bi-box-arrow-right ${file || state.textInput ? '' : 'disable-submit'}`}
                    id="searchButton"
                  >
                    {' '}{loading ? 'Loading...' : 'Submit'}
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
