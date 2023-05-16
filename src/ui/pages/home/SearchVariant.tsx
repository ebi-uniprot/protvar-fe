import React, { useState, useRef } from 'react'
import Button from '../../elements/form/Button'
import { FileLoadFun } from '../../../utills/AppHelper'
import {
  Assembly,
  DEFAULT_ASSEMBLY,
  StringVoidFun,
} from '../../../constants/CommonTypes'
import Spaces from '../../elements/Spaces'

interface VariantSearchProps {
  isLoading: boolean
  assembly: Assembly
  updateAssembly: (assembly: Assembly) => void
  fetchPasteResult: StringVoidFun
  fetchFileResult: FileLoadFun
}

const SearchVariant = (props: VariantSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [invalidInput, setInvalidInput] = useState(false);
  const uploadInputField = useRef<HTMLInputElement>(null);

  const populateVCF = () => {
    setSearchTerm(
      'X\t149498202\t.\tC\tG\n' +
        '10\t43118436\t.\tA\tC\n' +
        '2\t233760498\t.\tG\tA\n' +
        '14\t89993420\t.\tA\tG',
    )
  };

  const populateGnomAD = () => {
    setSearchTerm(
      'X-149498202-C-G\n' +
        '10-43118436-A-C\n' +
        '2-233760498-G-A\n' +
        '14-89993420-A-G',
    )
  };

  const populateHGVS = () => {
    setSearchTerm(
      'NC_000023.11:g.149498202C>G\n' +
        'NC_000010.11:g.43118436A>C\n' +
        'NC_000002.12:g.233760498G>A',
    )
  };

  const populateProtAC = () => {
    setSearchTerm('P22304 A205P\nP07949 asn783thr\nP22309 71 Gly Arg')
    props.updateAssembly(DEFAULT_ASSEMBLY)
  };

  const populateRs = () => {
    setSearchTerm('rs864622779\nrs587778656\nrs4148323')
    props.updateAssembly(DEFAULT_ASSEMBLY)
  };

  const viewResult = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    if (!target.files || !(target.files.length > 0)) {
      return
    }
    var file = target.files[0]
    if (file.type.startsWith('text/')) {
      setFile(file);
    } else {
      setInvalidInput(true);
    }
    
  };

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

  const pasteBox: string =
    'Paste variants here. Accepted formats are VCF, HGVS, dbSNP, protein position.\n' +
    'Mixed formats are allowed, however mixed genome assemblies are not.\n' +
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
                className="main-textarea-search-field"
                value={searchTerm}
                placeholder={pasteBox}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="search-card-selection">
                <div>
                <b>Examples:</b><br />
                <div className="examples-container">
                  <Spaces count={2} />
                  <button
                    onClick={populateVCF}
                    className="example-link"
                    id="vcfExampleButton"
                  >
                    VCF
                  </button>
                  <Spaces count={2} />
                  <button
                    onClick={populateGnomAD}
                    className="example-link"
                    id="gnomadExampleButton"
                  >
                    gnomAD
                  </button>
                  <Spaces count={2} />
                  <button
                    onClick={populateHGVS}
                    className="example-link"
                    id="hgvsExampleButton"
                  >
                    HGVS
                  </button>
                  <Spaces count={2} />
                  <button
                    onClick={populateProtAC}
                    className="example-link"
                    id="protACExampleButton"
                    title={protACTitle}
                  >
                    Protein Position
                  </button>
                  <Spaces count={2} />
                  <button
                    onClick={populateRs}
                    className="example-link"
                    id="rsExampleButton"
                    title={rsTitle}
                  >
                    Variant ID
                  </button>
                </div>
                </div>
                <div className="assembly">
                  <span title="Genome assembly conversion from GRCh37 to GRCh38 works for genomic input types only i.e. for input in VCF, HGVS or gnomAD formats. Protein position and DBSNP ID inputs are assumed to be in GRCh38.">
                    <b>Reference Genome Assembly</b>
                  </span>
                  <div className="assembly-radio-check">
                    <label>
                      <input
                        type="radio"
                        name="grch"
                        value="grch38"
                        checked={props.assembly === Assembly.GRCh38}
                        onChange={() => props.updateAssembly(Assembly.GRCh38)}
                      />
                      GRCh38
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="grch"
                        value="grch37"
                        checked={props.assembly === Assembly.GRCh37}
                        onChange={() => props.updateAssembly(Assembly.GRCh37)}
                      />
                      GRCh37
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="grch"
                        value="auto"
                        checked={props.assembly === Assembly.AUTO}
                        onChange={() => props.updateAssembly(Assembly.AUTO)}
                      />
                      Auto-detect
                    </label>
                  </div>

                  <div>
                    <span>
                      <b>Supported file formats</b><br />
                    </span>
                    <p>
                      ProtVar accepts any files that are in plain text format (i.e. .txt, .csv)
                    </p>
                    <input
                      id="myInput"
                      type="file"
                      style={{ display: 'none' }}
                      ref={uploadInputField}
                      onChange={viewResult}
                    />
                    {invalidInput && (
                      <>
                      <i className="file-warning bi bi-exclamation-triangle-fill"></i>{' '}
                      Unsupported file
                      </>
                    )}
                    {file?.name && (
                      <div className='file-name'>
                        <span className='name'>{file?.name.substring(0, file.name.lastIndexOf('.'))}</span>
                        <span className='extension'>{file?.name.substring(file.name.lastIndexOf('.'))}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="search-button-group">
                  <Button
                    onClick={
                      file
                        ? clearFileInput
                        : () => uploadInputField.current?.click()
                    }
                    className={`button-primary ${file ? 'clear-file bi bi-x-lg': 'bi bi-file-earmark-fill'}`}
                  >
                    {' '}{file ? 'Clear file' : 'Upload File'
                     }
                  </Button>
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
