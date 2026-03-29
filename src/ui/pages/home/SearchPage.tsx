// SearchPage.tsx
import React, { useState, useRef, ChangeEvent } from 'react';
import './SearchPage.css';
import {useNavigate} from "react-router-dom";
import {HelpContent} from "../../components/help/HelpContent";
import {HelpButton} from "../../components/help/HelpButton";
import useLocalStorage from "../../../hooks/useLocalStorage";
import {ResultRecord} from "../../../types/ResultRecord";
import {LOCAL_RESULTS} from "../../../constants/const";
import {uploadFile, uploadText} from "../../../services/ProtVarService";
import {API_ERROR, QUERY, RESULT} from "../../../constants/BrowserPaths";
import {readFirstLineFromFile} from "../../../utills/FileUtil";
import { DEFAULT_SEARCH_FILTERS } from '../../components/search/defaultFilters';
import SearchFilters, {
  SearchFilterParams
} from '../../components/search/SearchFilters';
import {buildFilterParams} from "../../components/search/filterUtils";

interface ExampleData {
  label: string;
  value: string;
  tip?: string;
}

type SearchMode = 'variant' | 'browse' | 'text'; // browse=id(identifier) input
export type GenomeAssembly = 'auto' | 'grch38' | 'grch37';

const EXAMPLES: Record<SearchMode, ExampleData[]> = {
  variant: [
    {
      label: 'VCF / Genomic',
      value: 'X\t149498202\t.\tC\tG\n' +
        '10-43118436-A-C\n' +
        'chr12 25245350 C T\n' +
        '14 89993420 A/G'
    },
    {
      label: 'HGVS Genomic',
      value: 'NC_000002.12:g.233760498G>A\n' +
        'NC_000010.11:g.43100674C>G\n' +
        'NC_000023.11:g.149483072G>A\n' +
        'NC_000012.11:g.25398284C>T'
    },
    {
      label: 'HGVS cDNA',
      value: 'NM_000202.8:c.1327C>T\n' +
        'NM_020975.6(RET):c.3105G>A (p.Glu1035Glu)\n' +
        'NM_000463.3(IDS):c.1124C>T\n' +
        'NM_018319.4:c.1478A>G p.(His493Arg)'
    },
    {
      label: 'UniProt Variants',
      value: 'P22304 A205P\n' +
        'P07949 asn783thr\n' +
        'P22309 71 Gly Arg'
    },
    {
      label: 'HGVS Protein',
      value: 'NP_001305738.1:p.Pro267Ser'
    },
    {
      label: 'Variant IDs',
      value: 'rs864622779\n' +
        'VCV002573141\n' +
        'COSV64777467',
      tip: 'dbSNP, ClinVar, COSMIC'
    },
    // TODO: add 37-38 examples, following aren't working despite 100% 37 matches
    //X 153009152 6a C T
    // 9 133759718 12a T A
    // 15 35085619 21a T C
    // 1 236906323 27a C T
  ],
  browse: [
    { label: 'UniProt ID', value: 'P68871' },
    { label: 'Gene Symbol', value: 'BRCA1' },
    { label: 'Ensembl Gene', value: 'ENSG00000012048' },
    { label: 'RefSeq ID', value: 'NM_007294.4' },
    { label: 'PDB ID', value: '1JNX' }
  ],
  text: [
    { label: 'Disease Terms', value: 'sickle cell anemia' },
    { label: 'Phenotypes', value: 'intellectual disability' },
    { label: 'Pathways', value: 'DNA repair pathway' },
    { label: 'Drug Response', value: 'warfarin sensitivity' },
    { label: 'Functional Impact', value: 'loss of function' }
  ]
};

const branch = process.env.REACT_APP_GIT_BRANCH;

const findExampleLabel = (input: string): string | null =>
  Object.values(EXAMPLES)
    .flat()
    .find(example => example.value === input)?.label ?? null;

const PASTE_BOX = `NP_000508.1:p.Glu6Val
11:5248232:A:T
rs334
NC_000011.10:g.5248232A>T`;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<SearchMode>('variant');
  const [variantInput, setVariantInput] = useState('');
  const [browseInput, setBrowseInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [genomeAssembly, setGenomeAssembly] = useState<GenomeAssembly>('auto');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [resultsVisible, setResultsVisible] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getItem, setItem } = useLocalStorage();

  const [searchFilters, setSearchFilters] = useState<SearchFilterParams>(DEFAULT_SEARCH_FILTERS);

  const handleModeChange = (mode: SearchMode) => {
    setActiveMode(mode);
    setError('');
  };

  const cleanInput = (input: string): string => {
    return input
      .replace(/[|,]/g, '\n') // Replace comma and pipe with newline
      .split('\n') // Split into lines
      .map(line => line.trim()) // Trim leading and trailing whitespace
      .filter(line => line !== '')
      .join('\n'); // Remove empty lines
  };

  const hasMultipleLines = (str: string): boolean => {
    return str.includes('\n');
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('text/')) {
      setError('Unsupported file type');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('File exceeds 10MB limit');
      return;
    }

    setUploadedFile(file);
    setError('');
    setVariantInput(''); // Clear text input when file is uploaded
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExampleClick = (example: ExampleData) => {
    switch (activeMode) {
      case 'variant':
        setVariantInput(example.value);
        setUploadedFile(null); // Clear file if text example is used
        break;
      case 'browse':
        setBrowseInput(example.value);
        break;
      case 'text':
        setTextInput(example.value);
        break;
    }
    setError('');
  };

  const handleSearch = () => {
    if (activeMode === 'variant') {
      handleVariantSearch();
    } else if (activeMode === 'browse') {
      handleBrowseSearch();
    }
  };

  const submittedRecord = async (id: string, url: string) => {
    // Always get latest data to avoid stale cache issues
    const savedRecords: ResultRecord[] = getItem<ResultRecord[]>(LOCAL_RESULTS) ?? [];
    const now = new Date().toISOString();

    const existingIndex = savedRecords.findIndex(record => record.id === id);
    let updatedRecords: ResultRecord[];

    if (existingIndex !== -1) {
      // Update existing record
      updatedRecords = [...savedRecords];
      updatedRecords[existingIndex] = {
        ...updatedRecords[existingIndex],
        lastSubmitted: now, //lastViewed: now
      };
    } else {
      // Determine the name
      const name = await getRecordName(id);
      // Add new record at the start
      const newRecord: ResultRecord = {
        id, url, name,
        firstSubmitted: now, //lastSubmitted: now, lastViewed: now
      };
      updatedRecords = [newRecord, ...savedRecords];
    }

    setItem(LOCAL_RESULTS, updatedRecords);
  };

  // New helper to decide the name
  async function getRecordName(id: string): Promise<string> {
    const trimmedInput = variantInput.trim()
    if (trimmedInput) {
      const exampleLabel = findExampleLabel(trimmedInput)
      if (exampleLabel) {
        return exampleLabel;
      }
      return trimmedInput.split("\n")[0]
        .replace(/\s+/g, " ") // normalize spaces
        .trim() || "";
    }

    if (uploadedFile) {
      try {
        return (await readFirstLineFromFile(uploadedFile))
          .replace(/\s+/g, " ")
          .trim();
      } catch (error) {
        console.error("Failed to read first line from file:", error);
      }
    }
    // Fallback
    return id;
  }

  const handleVariantSearch = async () => {
    setLoading(true);
    setError('');

    try {
      if (uploadedFile) {
        // --- File upload path ---
        await handleUpload(() => uploadFile(uploadedFile, genomeAssembly));
      }
      else if (variantInput.trim()) {
        const cleanText = cleanInput(variantInput);

        if (hasMultipleLines(cleanText)) {
          // --- Multi-line text upload ---
          await handleUpload(() => uploadText(cleanText, genomeAssembly));
        } else {
          // --- Direct single variant query ---
          let directQuery = `/${QUERY}?search=${encodeURIComponent(cleanText)}`;
          if (genomeAssembly === 'grch37') {
            directQuery += `&assembly=${genomeAssembly}`;
          }
          navigate(directQuery);
        }
      } else {
        setError('Please enter variants or upload a file');
      }
    } catch (err: any) {
      // This will catch any error thrown by handleUpload
      if (err?.response?.status === 400) {
        setError('Input upload error.');
      } else {
        console.error(err);
        navigate(API_ERROR);
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper for file/text upload, DRY-ing shared code
  async function handleUpload(uploadFn: () => Promise<any>) {
    const response = await uploadFn();
    let url = `${RESULT}/${response.data.inputId}`;
    if ((genomeAssembly?.toLowerCase() || '') !== 'auto') {
      url += `?assembly=${genomeAssembly}`;
    }
    submittedRecord(response.data.inputId, url);
    navigate(url);
  }

  const handleBrowseSearch = () => {
    const trimmedInput = browseInput.trim();
    if (!trimmedInput) {
      setError('Input value cannot be empty.');
      return;
    }

    setError('');

    // Use shared utility to build filter params
    const params = buildFilterParams(searchFilters);

    // Build the final URL
    const queryString = params.toString();
    navigate(`${trimmedInput}${queryString ? `?${queryString}` : ''}`);
  };

  const handleClear = () => {
    setVariantInput('');
    setBrowseInput('');
    setTextInput('');
    setUploadedFile(null);
    setResultsVisible(false);
    setError('');
    setLoading(false);
    setSearchFilters(DEFAULT_SEARCH_FILTERS);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const isSubmitDisabled = () => {
    if (activeMode === 'variant') {
      return !variantInput.trim() && !uploadedFile;
    } else if (activeMode === 'browse') {
      return !browseInput.trim();
    }
    return true;
  };

  return (
    <div className="search-container">
      {/* Header */}
      <div className="search-header">
        <p>Explore protein variation and its functional consequences</p>
      </div>

      {/* Search Mode Tabs */}
      <div className="search-modes">
        <button
          className={`mode-tab ${activeMode === 'variant' ? 'active' : ''}`}
          onClick={() => handleModeChange('variant')}
        >
          <span className="icon"><i className="bi bi-list-ul"></i></span>
          Variant List
        </button>
        <button
          className={`mode-tab ${activeMode === 'browse' ? 'active' : ''}`}
          onClick={() => handleModeChange('browse')}
        >
          <span className="icon"><i className="bi bi-search"></i></span>
          Browse by ID
        </button>
        {branch !== "dev" &&
          <button
            className={`mode-tab ${activeMode === 'text' ? 'active' : ''}`}
            onClick={() => handleModeChange('text')}
          >
            <span className="icon"><i className="bi bi-chat"></i></span>
            Text Search
          </button>}
      </div>

      {/* Search Panel */}
      <div className="search-panel">
        {/* Variant List Mode */}
        {activeMode === 'variant' && (
          <div className="search-content">
            <div className="variant-controls-row">
              <div className="input-method-toggle">
                <button
                  className={`method-btn ${!uploadedFile ? 'active' : ''}`}
                  onClick={() => setUploadedFile(null)}
                >
                  Type/Paste Variants
                </button>
                <button
                  className={`method-btn ${uploadedFile ? 'active' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload File
                </button>
              </div>

              <div className="genome-assembly-inline">
                <span className="assembly-label">
                  Genome Assembly
                  <HelpButton title="" content={<HelpContent name="genomic-assembly-detection" />} />
                </span>
                <select
                  className="assembly-select"
                  value={genomeAssembly}
                  onChange={(e) => setGenomeAssembly(e.target.value as GenomeAssembly)}
                >
                  <option value="auto">Auto-detect</option>
                  <option value="grch38">GRCh38/hg38</option>
                  <option value="grch37">GRCh37/hg19</option>
                </select>
              </div>
            </div>

            {uploadedFile ? (
              <div className="file-upload-display">
                <div className="uploaded-file">
                  <div className="file-info">
                    <span className="file-icon">📄</span>
                    <span className="file-name">{uploadedFile.name}</span>
                    <span className="file-size">
                      ({(uploadedFile.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <button className="remove-file-btn" onClick={handleRemoveFile}>
                    ×
                  </button>
                </div>
                <div className="file-help">
                  Accepts .txt, .tsv, .csv, .vcf files up to 10MB
                </div>
              </div>
            ) : (
              <div className="input-group">
                <label className="input-label">Enter your variants (one per line)</label>
                <textarea
                  className="input-field textarea"
                  placeholder={PASTE_BOX}
                  value={variantInput}
                  onChange={(e) => setVariantInput(e.target.value)}
                />
                <div className="examples">
                  <h6>
                    Try these examples
                    <HelpButton title="" content={<HelpContent name="supported-variant-format" />} />
                  </h6>
                  <div className="example-tags">
                    {EXAMPLES[activeMode].map((example, index) => (
                      <span
                        key={index}
                        className="example-tag"
                        onClick={() => handleExampleClick(example)}
                        title={example.tip}
                      >
                        {example.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              style={{display: 'none'}}
              accept=".txt,.tsv,.csv,.vcf"
              onChange={handleFileUpload}
            />
          </div>
        )}

        {/* Browse by ID Mode */}
        {activeMode === 'browse' && (
          <div className="search-content">
            <div className="input-group">
              <label className="input-label">Browse all variants for a protein, gene, or identifier</label>
              <input
                type="text"
                className="input-field"
                placeholder="P68871 or HBB or ENSG00000244734"
                value={browseInput}
                onChange={(e) => setBrowseInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <div className="examples">
                <h6>Try these examples</h6>
                <div className="example-tags">
                  {EXAMPLES[activeMode].map((example, index) => (
                    <span
                      key={index}
                      className="example-tag"
                      onClick={() => handleExampleClick(example)}
                    >
                      {example.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Text Search Mode */}
        {activeMode === 'text' && branch !== "dev" && (
          <div className="search-content">
            <div className="input-group">
              <label className="input-label">Search variants by disease, phenotype, or annotation</label>
              <input
                type="text"
                className="input-field"
                placeholder="sickle cell anemia"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />
              {
                //Search through variant annotations, disease associations, and functional descriptions
              }
              <div className="examples">
                <h6>Try these examples</h6>
                <div className="example-tags">
                  {EXAMPLES[activeMode].map((example, index) => (
                    <span
                      key={index}
                      className="example-tag"
                      onClick={() => handleExampleClick(example)}
                    >
                      {example.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Filters Toggle - Only for Browse Mode */}
        {activeMode === 'browse' && (
          <SearchFilters
            filters={searchFilters}
            onFiltersChange={setSearchFilters}
            showSorting={false}
          />
        )}

        {/* Error Display */}
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            className={`btn btn-primary ${isSubmitDisabled() ? 'disabled' : ''}`}
            onClick={handleSearch}
            disabled={isSubmitDisabled() || loading}
            title={activeMode === 'text' ? 'Coming soon' : ''}
          >
            {activeMode === 'variant' ? 'Submit' : 'Search'}
          </button>
          <button className="btn btn-secondary" onClick={handleClear}>
            Clear All
          </button>
        </div>
      </div>

      {/* Results Preview */}
      {resultsVisible && (
        <div className="results-preview" id="results-preview">
          <div className="results-header">
            <div>
              <h3>Search Results</h3>
              <div className="results-count">Found 1,247 variants</div>
            </div>
            <div className="active-filters">
              {[].map((filter, index) => (
                <div key={index} className="filter-chip">
                  {filter} <span className="remove">×</span>
                </div>
              ))}
            </div>
          </div>
          <p>Results would appear here with consistent formatting regardless of input method...</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;