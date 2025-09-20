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

interface FilterState {
  potential: boolean;
  known: boolean;
  caddScore: number;
  pathogenic: boolean;
  ambiguous: boolean;
  benign: boolean;
  clinvar: boolean;
  conflicting: boolean;
}

interface ExampleData {
  label: string;
  value: string;
}

type SearchMode = 'variants' | 'browse'; // | 'search';
// TODO: replace hg38/hg37 with grch38/grch37
export type GenomeAssembly = 'auto' | 'grch38' | 'grch37';

const EXAMPLES: Record<SearchMode, ExampleData[]> = {
  variants: [
    { label: 'VCF / Genomic', value: 'X\t149498202\t.\tC\tG\n10-43118436-A-C\n14 89993420 A/G' },
    { label: 'HGVS Genomic', value: 'NC_000002.12:g.233760498G>A\nNC_000011.10:g.5248232A>T' },
    { label: 'HGVS cDNA', value: 'NM_000202.8:c.1327C>T\nNM_020975.6(RET):c.3105G>A\nNM_000463.3(IDS):c.1124C>T' },
    { label: 'UniProt Variants', value: 'P22304 A205P\nP07949 asn783thr\nP22309 71 Gly Arg' },
    { label: 'HGVS Protein', value: 'NP_001305738.1:p.Pro267Ser' },
    { label: 'Variant IDs', value: 'rs864622779\nVCV002573141\nCOSV64777467' },
  ],
  browse: [
    { label: 'UniProt ID', value: 'P68871' },
    { label: 'Gene Symbol', value: 'BRCA1' },
    { label: 'Ensembl Gene', value: 'ENSG00000012048' },
    { label: 'RefSeq ID', value: 'NM_007294.4' },
    { label: 'PDB ID', value: '1JNX' }
  ],/*
  search: [
    { label: 'Disease Terms', value: 'sickle cell anemia' },
    { label: 'Phenotypes', value: 'intellectual disability' },
    { label: 'Pathways', value: 'DNA repair pathway' },
    { label: 'Drug Response', value: 'warfarin sensitivity' },
    { label: 'Functional Impact', value: 'loss of function' }
  ]*/
};

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
  const [activeMode, setActiveMode] = useState<SearchMode>('variants');
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [variantInput, setVariantInput] = useState('');
  const [browseInput, setBrowseInput] = useState('');
  //const [searchInput, setSearchInput] = useState('');
  const [genomeAssembly, setGenomeAssembly] = useState<GenomeAssembly>('auto');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [resultsVisible, setResultsVisible] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getItem, setItem } = useLocalStorage();

  const [filters, setFilters] = useState<FilterState>({
    potential: true,
    known: true,
    caddScore: 15,
    pathogenic: false,
    ambiguous: false,
    benign: false,
    clinvar: false,
    conflicting: false
  });

  const handleModeChange = (mode: SearchMode) => {
    setActiveMode(mode);
    setError('');
  };

  const handleFilterChange = (key: keyof FilterState, value: boolean | number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
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
      case 'variants':
        setVariantInput(example.value);
        setUploadedFile(null); // Clear file if text example is used
        break;
      case 'browse':
        setBrowseInput(example.value);
        break;/*
      case 'search':
        setSearchInput(example.value);
        break;*/
    }
    setError('');
  };

  const handleSearch = () => {
    if (activeMode === 'variants') {
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

    // Simply navigate with input and optional type hint
    // Let the backend resolve and validate
    const typeParam = selectedType ? `?type=${selectedType}` : '';
    navigate(`${trimmedInput}${typeParam}`);
    */
    navigate(trimmedInput)
  };

  const handleClear = () => {
    setVariantInput('');
    setBrowseInput('');
    //setSearchInput('');
    setUploadedFile(null);
    setResultsVisible(false);
    setError('');
    setLoading(false);
    setFilters({
      potential: true,
      known: true,
      caddScore: 15,
      pathogenic: false,
      ambiguous: false,
      benign: false,
      clinvar: false,
      conflicting: false
    });
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
    if (activeMode === 'variants') {
      return !variantInput.trim() && !uploadedFile;
    } else if (activeMode === 'browse') {
      return !browseInput.trim();
    }
    return true;
  };

  const getActiveFilters = () => {
    const active = [];
    if (filters.caddScore > 0) active.push(`CADD ≥ ${filters.caddScore}`);
    if (filters.potential && !filters.known) active.push('Potential variants only');
    if (!filters.potential && filters.known) active.push('Known variants only');
    if (filters.pathogenic) active.push('Pathogenic');
    if (filters.clinvar) active.push('ClinVar annotated');
    return active;
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
          className={`mode-tab variants ${activeMode === 'variants' ? 'active' : ''}`}
          onClick={() => handleModeChange('variants')}
        >
          <span className="icon"><i className="bi bi-list-ul"></i></span>
          Variant List
        </button>
        <button
          className={`mode-tab browse ${activeMode === 'browse' ? 'active' : ''}`}
          onClick={() => handleModeChange('browse')}
        >
          <span className="icon"><i className="bi bi-search"></i></span>
          Browse by ID
        </button>
        <button
          //className={`mode-tab ${activeMode === 'search' ? 'active' : ''}`}
          //onClick={() => handleModeChange('search')}
          className="mode-tab disabled" disabled title="Coming soon"
        >
          <span className="icon"><i className="bi bi-chat"></i></span>
          Text Search
        </button>
      </div>

      {/* Search Panel */}
      <div className="search-panel">
        {/* Variant List Mode */}
        {activeMode === 'variants' && (
          <div className="search-content">
            <div className="variant-input-options">
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

              <div className="genome-assembly-selector">
                <label className="input-label"><HelpButton title="" content={<HelpContent name="genomic-assembly-detection" />} /> Genome Assembly</label>
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
                  ProtVar accepts plain text files (.txt, .tsv, .csv, .vcf) up to 10MB
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
                <div className="input-help">
                  <span><HelpButton title="" content={<HelpContent name="supported-variant-format" />} /> Supported formats:</span>
                    <ul>
                      <li><strong>Genomic:</strong> VCF, coordinates, HGVS genomic</li>
                      <li><strong>Transcript:</strong> HGVS coding/cDNA</li>
                      <li><strong>Protein:</strong> UniProt variants, HGVS protein</li>
                      <li><strong>Variant IDs:</strong> dbSNP, ClinVar, COSMIC</li>
                    </ul>
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
              <label className="input-label">Browse all variants for a protein or gene</label>
              <input
                type="text"
                className="input-field"
                placeholder="P68871 or HBB or ENSG00000244734"
                value={browseInput}
                onChange={(e) => setBrowseInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <div className="input-help">
                Enter UniProt ID, Gene Symbol, RefSeq ID, Ensembl ID, or PDB ID
              </div>
            </div>
          </div>
        )}

        {/* Text Search Mode */}
        {/*activeMode === 'search' && (
          <div className="search-content">
            <div className="input-group">
              <label className="input-label">Search variants by disease, phenotype, or annotation</label>
              <input
                type="text"
                className="input-field"
                placeholder="sickle cell anemia"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <div className="input-help">
                Search through variant annotations, disease associations, and functional descriptions
              </div>
            </div>
          </div>
        )*/}

        {/* Advanced Filters Toggle - Only for Browse Mode */}
        {activeMode === 'browse' && (<>
        <div
          className={`filters-toggle ${filtersExpanded ? 'expanded' : ''}`}
          onClick={() => setFiltersExpanded(!filtersExpanded)}
        >
          <span className="toggle-text">Advanced Filters</span>
          <span className="chevron"><i className="bi bi-chevron-down"></i></span>
        </div>

        {/* Filters Panel */}
        <div className={`filters-panel ${filtersExpanded ? 'expanded' : ''}`}>
          <div className="filters-grid">
            <div className="filter-group">
              <h4>Variant Type</h4>
              <div className="filter-item">
                <input
                  type="checkbox"
                  id="potential"
                  checked={filters.potential}
                  onChange={(e) => handleFilterChange('potential', e.target.checked)}
                />
                <label htmlFor="potential">Potential variants</label>
              </div>
              <div className="filter-item">
                <input
                  type="checkbox"
                  id="known"
                  checked={filters.known}
                  onChange={(e) => handleFilterChange('known', e.target.checked)}
                />
                <label htmlFor="known">Known variants</label>
              </div>
            </div>

            <div className="filter-group">
              <h4>CADD Score</h4>
              <div className="filter-item">
                <span>0</span>
                <input
                  type="range"
                  id="cadd"
                  min="0"
                  max="50"
                  value={filters.caddScore}
                  onChange={(e) => handleFilterChange('caddScore', parseInt(e.target.value))}
                />
                <span>50</span>
              </div>
              <div className="range-values">
                <span>Minimum: {filters.caddScore}</span>
              </div>
            </div>

            <div className="filter-group">
              <h4>AlphaMissense</h4>
              <div className="filter-item">
                <input
                  type="checkbox"
                  id="pathogenic"
                  checked={filters.pathogenic}
                  onChange={(e) => handleFilterChange('pathogenic', e.target.checked)}
                />
                <label htmlFor="pathogenic">Pathogenic</label>
              </div>
              <div className="filter-item">
                <input
                  type="checkbox"
                  id="ambiguous"
                  checked={filters.ambiguous}
                  onChange={(e) => handleFilterChange('ambiguous', e.target.checked)}
                />
                <label htmlFor="ambiguous">Ambiguous</label>
              </div>
              <div className="filter-item">
                <input
                  type="checkbox"
                  id="benign"
                  checked={filters.benign}
                  onChange={(e) => handleFilterChange('benign', e.target.checked)}
                />
                <label htmlFor="benign">Benign</label>
              </div>
            </div>

            <div className="filter-group">
              <h4>Clinical Significance</h4>
              <div className="filter-item">
                <input
                  type="checkbox"
                  id="clinvar"
                  checked={filters.clinvar}
                  onChange={(e) => handleFilterChange('clinvar', e.target.checked)}
                />
                <label htmlFor="clinvar">ClinVar annotated</label>
              </div>
              <div className="filter-item">
                <input
                  type="checkbox"
                  id="conflicting"
                  checked={filters.conflicting}
                  onChange={(e) => handleFilterChange('conflicting', e.target.checked)}
                />
                <label htmlFor="conflicting">Conflicting interpretations</label>
              </div>
            </div>
          </div>
        </div>
        </>)
      }

        {/* Error Display */}
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className={`btn btn-primary ${isSubmitDisabled() ? 'disabled' : ''}`}
                  onClick={handleSearch}
                  disabled={isSubmitDisabled() || loading}
          >
            {activeMode === 'variants' ? 'Submit' : 'Search'}
          </button>
          <button className="btn btn-secondary" onClick={handleClear}>
            Clear All
          </button>
        </div>
      </div>

      {/* Example Queries */}
      <div className="examples">
        <h3>Try these examples</h3>
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

      {/* Results Preview */}
      {resultsVisible && (
        <div className="results-preview" id="results-preview">
          <div className="results-header">
            <div>
              <h3>Search Results</h3>
              <div className="results-count">Found 1,247 variants</div>
            </div>
            <div className="active-filters">
              {getActiveFilters().map((filter, index) => (
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