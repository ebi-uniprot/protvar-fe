// SearchPage.tsx
import React, { useState, useRef, ChangeEvent } from 'react';
import {useNavigate, useSearchParams} from "react-router-dom";
import {HelpContent} from "../../components/help/HelpContent";
import {HelpButton} from "../../components/help/HelpButton";
import {useStorage} from "../../../context/StorageContext";
import {ResultRecord, submissionExpiresAt} from "../../../types/ResultRecord";
import {uploadFile, uploadText} from "../../../services/ProtVarService";
import {API_ERROR, RESULT, SEARCH, SEMANTIC_SEARCH} from "../../../constants/BrowserPaths";
import {readFirstLineFromFile} from "../../../utills/FileUtil";
import { DEFAULT_SEARCH_FILTERS } from '../../components/search/defaultFilters';
import SearchFilters, {
  SearchFilterParams
} from '../../components/search/SearchFilters';
import {buildFilterParams} from "../../components/search/filterUtils";
import {parseIdParam} from "../../../utills/InputTypeResolver";
import {hasPrimaryFilter, PRIMARY_FILTER_PROMPT} from "../../../utills/PrimaryFilter";
import {ID_GENE, ID_PDB, ID_ENSEMBL, ID_REFSEQ} from "../../../constants/BrowserPaths";

interface ExampleData {
  label: string;
  value: string;
  tip?: string;
}

type SearchMode = 'annotate' | 'browse' | 'semantic'; // annotate=variant annotation; browse=by identifier; semantic=free-text search
export type GenomeAssembly = 'auto' | 'grch38' | 'grch37';

// The active mode is mirrored in the URL (?tab=) so sidebar links can deep-link
// into a mode — same pattern as the Activity page's ?tab=downloads.
const TAB_PARAM = 'tab';
const tabToMode = (tab: string | null): SearchMode =>
  tab === 'browse' || tab === 'semantic' ? tab : 'annotate';

const EXAMPLES: Record<SearchMode, ExampleData[]> = {
  annotate: [
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
  semantic: [
    { label: 'Disease Terms', value: 'sickle cell anemia' },
    { label: 'Phenotypes', value: 'intellectual disability' },
    { label: 'Pathways', value: 'DNA repair pathway' },
    { label: 'Drug Response', value: 'warfarin sensitivity' },
    { label: 'Functional Impact', value: 'loss of function' }
  ]
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const activeMode: SearchMode = tabToMode(searchParams.get(TAB_PARAM));
  const [variantInput, setVariantInput] = useState('');
  const [browseIds, setBrowseIds] = useState<string[]>([]);
  const [browseInputText, setBrowseInputText] = useState('');
  const [textInput, setTextInput] = useState('');
  const [genomeAssembly, setGenomeAssembly] = useState<GenomeAssembly>('auto');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { saveResult } = useStorage();

  const [searchFilters, setSearchFilters] = useState<SearchFilterParams>(DEFAULT_SEARCH_FILTERS);

  const handleModeChange = (mode: SearchMode) => {
    setError('');
    const next = new URLSearchParams(searchParams);
    if (mode === 'annotate') next.delete(TAB_PARAM);
    else next.set(TAB_PARAM, mode);
    setSearchParams(next, { replace: true });
  };

  const addBrowseId = () => {
    const trimmed = browseInputText.trim();
    if (trimmed && !browseIds.includes(trimmed)) {
      setBrowseIds(prev => [...prev, trimmed]);
    }
    setBrowseInputText('');
  };

  const removeBrowseId = (index: number) => {
    setBrowseIds(prev => prev.filter((_, i) => i !== index));
  };

  function buildSingleIdUrl(raw: string): string {
    const { type, value } = parseIdParam(raw);
    switch (type) {
      case 'gene':    return `${ID_GENE}/${value}`;
      case 'pdb':     return `${ID_PDB}/${value}`;
      case 'ensembl': return `${ID_ENSEMBL}/${value}`;
      case 'refseq':  return `${ID_REFSEQ}/${value}`;
      default:        return `/${value}`; // uniprot and fallback — bare accession path
    }
  }

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
      case 'annotate':
        setVariantInput(example.value);
        setUploadedFile(null); // Clear file if text example is used
        break;
      case 'browse':
        // Add as chip if not already present
        if (!browseIds.includes(example.value)) {
          setBrowseIds(prev => [...prev, example.value]);
        }
        break;
      case 'semantic':
        setTextInput(example.value);
        break;
    }
    setError('');
  };

  const handleTextSearch = () => {
    const q = textInput.trim();
    if (!q) return;
    navigate(`${SEMANTIC_SEARCH}?q=${encodeURIComponent(q)}`);
  };

  const handleSearch = () => {
    if (activeMode === 'annotate') {
      handleVariantSearch();
    } else if (activeMode === 'browse') {
      handleBrowseSearch();
    } else if (activeMode === 'semantic') {
      handleTextSearch();
    }
  };

  const submittedRecord = async (id: string, url: string) => {
    const name = await getRecordName(id)
    const record: ResultRecord = {
      id,
      type: 'submission',
      inputType: 'input_id',
      url,
      name,
      savedAt: new Date().toISOString(),
      expiresAt: submissionExpiresAt(),
    }
    saveResult(record)
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
          let directQuery = `${SEARCH}?q=${encodeURIComponent(cleanText)}`;
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
    // Flush any partially typed text before submitting
    const allIds = browseInputText.trim()
      ? [...browseIds, browseInputText.trim()].filter((v, i, a) => a.indexOf(v) === i)
      : browseIds;

    if (allIds.length === 0 && !hasPrimaryFilter(searchFilters)) {
      setError(PRIMARY_FILTER_PROMPT);
      return;
    }
    setError('');
    if (browseInputText.trim()) {
      setBrowseIds(allIds);
      setBrowseInputText('');
    }

    const filterParams = buildFilterParams(searchFilters);
    const filterStr = filterParams.toString();

    if (allIds.length === 0) {
      // Filter-only browse: no identifiers, primary filter present
      navigate(`${SEARCH}${filterStr ? `?${filterStr}` : ''}`);
    } else if (allIds.length === 1) {
      const url = buildSingleIdUrl(allIds[0]);
      navigate(`${url}${filterStr ? `?${filterStr}` : ''}`);
    } else {
      const params = new URLSearchParams();
      allIds.forEach(id => params.append('id', id));
      filterParams.forEach((v, k) => params.append(k, v));
      navigate(`${SEARCH}?${params.toString()}`);
    }
  };

  const handleClear = () => {
    setVariantInput('');
    setBrowseIds([]);
    setBrowseInputText('');
    setTextInput('');
    setUploadedFile(null);
    setError('');
    setLoading(false);
    setSearchFilters(DEFAULT_SEARCH_FILTERS);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  const isSubmitDisabled = () => {
    if (activeMode === 'annotate') {
      return !variantInput.trim() && !uploadedFile;
    } else if (activeMode === 'browse') {
      return browseIds.length === 0 && !browseInputText.trim() && !hasPrimaryFilter(searchFilters);
    } else if (activeMode === 'semantic') {
      return !textInput.trim();
    }
    return true;
  };

  return (
    <div className="search-container">
      {/* Search Mode Tabs */}
      <div className="search-modes">
        <button
          className={`mode-tab ${activeMode === 'annotate' ? 'active' : ''}`}
          onClick={() => handleModeChange('annotate')}
        >
          <span className="icon"><i className="bi bi-clipboard-data"></i></span>
          Annotate Variants
        </button>
        <button
          className={`mode-tab ${activeMode === 'browse' ? 'active' : ''}`}
          onClick={() => handleModeChange('browse')}
        >
          <span className="icon"><i className="bi bi-card-list"></i></span>
          Browse by Identifier
        </button>
        <button
          className={`mode-tab ${activeMode === 'semantic' ? 'active' : ''}`}
          onClick={() => handleModeChange('semantic')}
        >
          <span className="icon"><i className="bi bi-body-text"></i></span>
          <span className="tab-label-experimental">
            Semantic Search
            <i className="bi bi-flask experimental-badge" title="Experimental feature" />
          </span>
        </button>
      </div>

      {/* Search Panel */}
      <div className="search-panel">
        {/* Variant List Mode */}
        {activeMode === 'annotate' && (
          <div className="search-content">
            <div className="variant-controls-row">
              <div className="input-method-toggle">
                <button
                  className={`method-btn ${!uploadedFile ? 'active' : ''}`}
                  onClick={() => setUploadedFile(null)}
                >
                  <i className="bi bi-keyboard" /> Type / Paste
                </button>
                <button
                  className={`method-btn ${uploadedFile ? 'active' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <i className="bi bi-file-earmark-arrow-up" /> Upload File
                </button>
              </div>

              <div className="genome-assembly-inline">
                <span className="assembly-label">
                  Assembly
                  <HelpButton title="" content={<HelpContent name="assembly-detection" />} />
                </span>
                <div className="input-method-toggle assembly-toggle">
                  <button
                    className={`method-btn ${genomeAssembly === 'auto' ? 'active' : ''}`}
                    onClick={() => setGenomeAssembly('auto')}
                    title="Automatically detect genome assembly from input"
                  >Auto</button>
                  <button
                    className={`method-btn ${genomeAssembly === 'grch38' ? 'active' : ''}`}
                    onClick={() => setGenomeAssembly('grch38')}
                    title="GRCh38 / hg38"
                  >GRCh38</button>
                  <button
                    className={`method-btn ${genomeAssembly === 'grch37' ? 'active' : ''}`}
                    onClick={() => setGenomeAssembly('grch37')}
                    title="GRCh37 / hg19"
                  >GRCh37</button>
                </div>
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
                    <HelpButton title="" content={<HelpContent name="input-formats" />} />
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
              <label className="input-label">Browse all mapped variants for a protein, gene, or other biological identifier</label>

              {/* Chips */}
              {browseIds.length > 0 && (
                <div className="browse-chips">
                  {browseIds.map((id, index) => (
                    <span key={index} className="browse-chip">
                      {id}
                      <button
                        type="button"
                        className="browse-chip-remove"
                        onClick={() => removeBrowseId(index)}
                        aria-label={`Remove ${id}`}
                      >×</button>
                    </span>
                  ))}
                </div>
              )}

              {/* Input row */}
              <div className="browse-input-row">
                <div className="browse-input-wrapper">
                  <input
                    type="text"
                    className="input-field"
                    placeholder={browseIds.length > 0 ? "Add another identifier..." : "P68871 or HBB or ENSG00000244734"}
                    value={browseInputText}
                    onChange={(e) => setBrowseInputText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addBrowseId(); } }}
                  />
                  <button
                    type="button"
                    className="browse-add-btn"
                    onClick={addBrowseId}
                    disabled={!browseInputText.trim()}
                    title="Add identifier"
                  >
                    <i className="bi bi-plus-lg"></i>
                  </button>
                </div>
                <button
                  type="button"
                  className="browse-go-btn"
                  onClick={handleSearch}
                  disabled={isSubmitDisabled() || loading}
                  title="Browse"
                >
                  <i className="bi bi-search"></i>
                </button>
              </div>

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

        {/* Semantic Search Mode */}
        {activeMode === 'semantic' && (
          <div className="search-content">
            <div className="input-group">
              <label className="input-label">Find proteins by disease, phenotype, or functional description</label>
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

        {/* Why the Browse button is disabled — a disabled button gives no
            feedback on its own, so explain the requirement right above it. */}
        {activeMode === 'browse' && isSubmitDisabled() && !loading && (
          <p className="browse-hint">
            <i className="bi bi-info-circle"></i> {PRIMARY_FILTER_PROMPT}
          </p>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            className="btn btn-brand"
            onClick={handleSearch}
            disabled={isSubmitDisabled() || loading}
          >
            {activeMode === 'annotate'
              ? <><i className="bi bi-send-fill" /> Submit</>
              : activeMode === 'semantic'
              ? <><i className="bi bi-search" /> Search</>
              : <><i className="bi bi-search" /> Browse</>
            }
          </button>
          <button className="btn btn-secondary" onClick={handleClear}>
            <i className="bi bi-x-lg" /> Clear
          </button>
        </div>
      </div>

    </div>
  );
};

export default SearchPage;