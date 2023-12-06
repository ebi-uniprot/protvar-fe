import React, { useState, useRef } from 'react'
import Button from '../../elements/form/Button'
import { FileLoadFun } from '../../../utills/AppHelper'
import {
  Assembly,
  DEFAULT_ASSEMBLY,
  StringVoidFun,
} from '../../../constants/CommonTypes'

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
    setSearchTerm(
      'X\t149498202\t.\tC\tG\n' +
      '10-43118436-A-C\n' +
      'NC_000002.12:g.233760498G>A\n' +
      '14 89993420 A/G',
    )
  };

  const cDNAExamples = () => {
    setSearchTerm(
      'NM_004006.2:c.234C>G\n' +
      'NM_017547.4(FOXRED1):c.1289A>G(p.Asn430Ser)\n' +
      'NM_014630.3(ZNF592):c.3136G>A (p.Gly1046Arg)\n',
    )
  };

  const proteinExamples = () => {
    setSearchTerm(
      'NP_001305738.1:p.Pro267Ser\n' +
      'P22304 A205P\n' +
      'P07949 asn783thr\n' +
      'P22309 71 Gly Arg')
    update(DEFAULT_ASSEMBLY)
  };

  const idExamples = () => {
    setSearchTerm('rs864622779\n' +
      'rs587778656\n' +
      'RCV001270034\n' +
      'VCV002573141\n' +
      'COSV10469109\n' +
      'COSM5381302\n' +
      'COSN5742537')
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
                className={`main-textarea-search-field ${file ? 'disable' : ''}`}
                value={searchTerm}
                placeholder={pasteBox}
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
                    title="VCF ✅
                    gnomAD ✅
                    HGVS g. ✅
                    Custom genomic input incl. in the following formats
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
                    title="HGVS c."
                  >
                    cDNA
                  </button>

                  <button
                    onClick={proteinExamples}
                    className="example-link"
                    id="proteinExamples"
                    title="HGVS p. ✅
                     Custom protein input incl. in the following formats
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
                    ID/Ref
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
