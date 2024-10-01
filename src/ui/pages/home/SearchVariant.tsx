import React, {useState, useRef} from 'react'
import Button from '../../elements/form/Button'
import {Assembly, DEFAULT_ASSEMBLY} from '../../../constants/CommonTypes'
import {
  INPUT_EXAMPLES,
  PASTE_BOX
} from "../../../constants/Example";
import {Form, initialForm} from "../../../types/FormData";
import {submitInputFile, submitInputText} from "../../../services/ProtVarService";
import {API_ERROR, QUERY, RESULT} from "../../../constants/BrowserPaths";
import {useNavigate} from "react-router-dom";
import {AxiosResponse} from "axios";
import {IDResponse} from "../../../types/PagedMappingResponse";
import {LOCAL_RESULTS} from "../../../constants/const";
import {ResultRecord} from "../../../types/ResultRecord";
import {readFirstLineFromFile} from "../../../utills/FileUtil";
import useLocalStorage from "../../../hooks/useLocalStorage";
import {HelpContent} from "../../components/help/HelpContent";
import {HelpButton} from "../../components/help/HelpButton";

const hasMultipleLines = (str: string): boolean => {
  return str.includes('\n');
}

function cleanInput(input: string): string {
  return input
    .replace(/[\|,]/g, '\n') // Replace comma and pipe with newline
    .split('\n') // Split into lines
    .map(line => line.trim()) // Trim leading and trailing whitespace
    .filter(line => line !== '')
    .join('\n'); // Remove empty lines
}

const SearchVariant = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Form>(initialForm)
  const [invalidInput, setInvalidInput] = useState(false);
  const [invalidMsg, setInvalidMsg] = useState('');
  const uploadInputField = useRef<HTMLInputElement>(null);
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const UNSUPPORTED_FILE = 'Unsupported file type';
  const FILE_EXCEEDS_LIMIT = 'File exceeds 10MB limit';
  const INVALID_INPUT = 'Invalid input';
  const { getItem, setItem } = useLocalStorage();
  const savedRecords = getItem<ResultRecord[]>(LOCAL_RESULTS) || [];

  const submittedRecord = async (id: string, url: string) => {
    const now = new Date().toISOString();
    const existingRecord = savedRecords.find(record => record.id === id);
    const firstInput = await getFirstInput();

    let updatedRecords;

    if (existingRecord) {
      const updatedRecord = {
        ...existingRecord,
        lastSubmitted: now,
        //lastViewed: now
      };
      updatedRecords = savedRecords.map(record =>
        record.id === id ? updatedRecord : record
      );
    } else {
      const newRecord: ResultRecord = {
        id, url,
        name: firstInput.replace(/\s+/g, ' '),
        firstSubmitted: now,
        //lastSubmitted: now,
        //lastViewed: now
      };
      updatedRecords = [newRecord, ...savedRecords];
    }
    setItem(LOCAL_RESULTS, updatedRecords); // newRecord added at start, so sorted by latestDate
  };

  async function getFirstInput(): Promise<string> {
    if (form.file) {
      return await readFirstLineFromFile(form.file);
    } else if (form.text) {
      return form.text.split('\n')[0] || '';
    } else {
      return '';
    }
  }

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
      setForm({...form, file: file})
      setInvalidInput(false);
    }
  };

  const handleSubmit = () => {
    setLoading(true)
    var promise: Promise<AxiosResponse<IDResponse>> | undefined = undefined;
    if (form.file)
      promise = submitInputFile(form.file, form.assembly)
    else if (form.text) {
      // input example check that can be used to decide whether
      // to save in result history or not.
      //if (INPUT_EXAMPLES.includes(form.text.trim())) {
      //  alert('Example!')
      //}
      const cleanText = cleanInput(form.text)
      if (cleanText) {
        setForm({...form, text: cleanText})
        if (hasMultipleLines(cleanText)) {
          promise = submitInputText(cleanText, form.assembly)
        } else {
          let directQuery = `${QUERY}?search=${encodeURIComponent(cleanText)}`
          if (form.assembly && form.assembly === Assembly.GRCh37) {
            // single input uses GRCh38 by default (auto-detect is ignored), unless GRCh37 is specified.
            directQuery += `&assembly=${encodeURIComponent(form.assembly)}`
          }
          navigate(directQuery)
        }
      } else { // empty after trim
        setInvalidInput(true);
        setInvalidMsg(INVALID_INPUT);
      }
    }

    if (promise) {
      promise
        .then((response) => {
          let url = `${RESULT}/${response.data.id}`
          if (form.assembly !== DEFAULT_ASSEMBLY)
            url += `?assembly=${form.assembly}`
          submittedRecord(response.data.id, url)
          navigate(url)
        })
        .catch((err) => {
          navigate(API_ERROR);
          console.log(err);
        })
    }
    setLoading(false);
  }

  const clearFileInput = () => {
    if (uploadInputField?.current) {
      const fileInput = uploadInputField.current;
      fileInput.value = '';
      setForm({...form, file: null});
    }
  }

  return (
    <div id="search" className="card-table search">
      <div className="card">
        <section className="search-card__actions">
          <span className="search-card-header">
            <p>
              <b>Search single nucleotide variants</b> - paste your variants below or
              upload your file <HelpButton title="" content={<HelpContent name="search-variants" />} />
            </p>
          </span>
        </section>
        <section className="card--has-hover top-row" role="button">
          <div className="card__content">
            <section className="search-card">
              <textarea
                id="main-textarea-search-field"
                className={`main-textarea-search-field ${form.file ? 'disable' : ''}`}
                value={form.text}
                placeholder={PASTE_BOX}
                onChange={(e) => setForm({...form, text: e.target.value})}
              />
              <div className="search-card-selection">
                <div>
                  <HelpButton title="Supported format" content={<HelpContent name="supported-format" />} />
                  <br/>
                  <b>Click buttons below to try examples</b><br/>
                  <div className="examples-container">

                    <button
                      onClick={_ => setForm({...form, text: INPUT_EXAMPLES[0]})}
                      className="example-link"
                      id="genomicExamples"
                    >
                      Genomic
                    </button>

                    <button
                      onClick={_ => setForm({...form, text: INPUT_EXAMPLES[1]})}
                      className="example-link"
                      id="cDNAExamples"
                    >
                      cDNA
                    </button>

                    <button
                      onClick={_ => setForm({file: form.file, text: INPUT_EXAMPLES[2], assembly: DEFAULT_ASSEMBLY})}
                      className="example-link"
                      id="proteinExamples"
                    >
                      Protein
                    </button>

                    <button
                      onClick={_ => setForm({file: form.file, text: INPUT_EXAMPLES[3], assembly: DEFAULT_ASSEMBLY})}
                      className="example-link"
                      id="idExamples"
                    >
                      Variant ID
                    </button>
                  </div>
                </div>

                <div className="assembly">
                  <span
                    title="Genome assembly GRCh37 to GRCh38 conversion for genomic inputs (VCF, HGVS g., gnomAD and any other custom genomic formats).">
                    <b>Reference Genome Assembly</b> <HelpButton title="" content={<HelpContent name="build-logic" />} />
                  </span>
                  <div className="assembly-radio-check">
                    <label>
                      <input
                        type="radio"
                        name="assembly"
                        value={Assembly.AUTO}
                        checked={form.assembly === Assembly.AUTO}
                        onChange={e => setForm({...form, assembly: Assembly.AUTO})}
                      />
                      Auto-detect
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="assembly"
                        value={Assembly.GRCh38}
                        checked={form.assembly === Assembly.GRCh38}
                        onChange={e => setForm({...form, assembly: Assembly.GRCh38})}
                      />
                      GRCh38
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="assembly"
                        value={Assembly.GRCh37}
                        checked={form.assembly === Assembly.GRCh37}
                        onChange={e => setForm({...form, assembly: Assembly.GRCh37})}
                      />
                      GRCh37
                    </label>
                  </div>

                  <div>
                    <span>
                      <b>Supported file formats</b><br/>
                    </span>
                    <p className='supported-file-text'>
                      ProtVar accepts any files that are in plain text format (i.e. .txt, .csv)
                    </p>
                    <input
                      id="myInput"
                      type="file"
                      style={{display: 'none'}}
                      ref={uploadInputField}
                      onChange={viewResult}
                    />
                    <Button
                      onClick={
                        form.file
                          ? clearFileInput
                          : () => uploadInputField.current?.click()
                      }
                      className={`file-upload ${form.file ? 'clear-file bi bi-x-lg' : 'bi bi-file-earmark-fill'}`}
                    >
                      {' '}{form.file ? 'Clear file' : 'Upload File'
                    }
                    </Button>
                    {invalidInput && (
                      <span className="padding-left-1x">
                      <i className="file-warning bi bi-exclamation-triangle-fill"></i>{' '}
                        {invalidMsg}
                      </span>
                    )}
                    {form.file?.name && (
                      <div className='file-name'>
                        <i className="bi bi-check-circle tick-icon"></i>
                        <span className='name'>{form.file?.name.substring(0, form.file.name.lastIndexOf('.'))}</span>
                        <span className='extension'>{form.file?.name.substring(form.file.name.lastIndexOf('.'))}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="search-button-wrapper">
                  <Button
                    type="submit"
                    onClick={loading ? () => {
                    } : handleSubmit}
                    className={`button-primary bi bi-box-arrow-right ${form.file || form.text ? '' : 'disable-submit'}`}
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
