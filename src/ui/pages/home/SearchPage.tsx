// SearchPage.tsx
import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {HelpContent} from "../../components/help/HelpContent";
import {HelpButton} from "../../components/help/HelpButton";
import {useStorage} from "../../../context/StorageContext";
import {ResultRecord, submissionExpiresAt} from "../../../types/ResultRecord";
import {getDatasets, uploadFile, uploadText} from "../../../services/ProtVarService";
import {API_ERROR, DATASET, HELP, RESULT, SEARCH, SEMANTIC_SEARCH} from "../../../constants/BrowserPaths";
import {Dataset} from "../../../types/Dataset";
import {readFirstLineFromFile} from "../../../utills/FileUtil";
import { DEFAULT_SEARCH_FILTERS } from '../../components/search/defaultFilters';
import SearchFilters, {
  SearchFilterParams
} from '../../components/search/SearchFilters';
import {buildFilterParams} from "../../components/search/filterUtils";
import {parseIdParam} from "../../../utills/InputTypeResolver";
import {hasPrimaryFilter, PRIMARY_FILTER_PROMPT} from "../../../utills/PrimaryFilter";
import {ID_GENE, ID_PDB, ID_ENSEMBL, ID_REFSEQ} from "../../../constants/BrowserPaths";
import {ANNOTATE_CARDS, BROWSE_CARDS, CARDS_SHOWN, ExampleCard, PASTE_BOX, SEMANTIC_CARDS} from "../../../constants/Example";

interface ExampleData {
  label: string;
  value: string;
  tip?: string;
}

type SearchMode = 'annotate' | 'browse' | 'semantic'; // annotate=variant annotation; browse=by identifier and/or filters; semantic=free-text search
export type GenomeAssembly = 'auto' | 'grch38' | 'grch37';

// The active mode is mirrored in the URL (?tab=) so sidebar links can deep-link
// into a mode — same pattern as the Activity page's ?tab=downloads.
const TAB_PARAM = 'tab';
const tabToMode = (tab: string | null): SearchMode =>
  tab === 'browse' || tab === 'semantic' ? tab : 'annotate';

const EXAMPLES: Record<SearchMode, ExampleData[]> = {
  // By format: together the chips cover every supported input form (see input-formats help)
  annotate: [
    {
      label: 'Genomic',
      value: '7\t140753336\trs113488022\tA\tT\n' +
        '12-25245350-C-T\n' +
        '17 7675088 C T\n' +
        '7:55191822:T:G\n' +
        'chr11:5227002 T>A\n' +
        '19 44908684 T/C\n' +
        'MT 3460 G A',
      tip: 'VCF, gnomAD, chromosome/position (space, colon, > or /), mitochondrial'
    },
    {
      label: 'HGVS g.',
      value: 'NC_000007.14:g.140753336A>T\n' +
        'chr11:g.5227002T>A',
      tip: 'HGVS genomic, with an NC_ accession or a chromosome'
    },
    {
      label: 'HGVS c.',
      value: 'NM_000518.5:c.20A>T\n' +
        'NM_004333.6(BRAF):c.1799T>A\n' +
        'NM_000546.6:c.524G>A p.(Arg175His)\n' +
        'NM_000249.4:c.543C>T',
      tip: 'HGVS coding, optionally with the gene or the protein change'
    },
    {
      label: 'UniProt',
      value: 'P15056 V600E\n' +
        'P01116 p.G12D\n' +
        'P02649 Cys130Arg\n' +
        'p00533 leu858arg\n' +
        'P38398 61 C/G\n' +
        'Q30201 282 Cys Tyr\n' +
        'P04637 R213*\n' +
        'P40692 G181=',
      tip: 'UniProt accession + change: 1- or 3-letter, any case, stop (*) and silent (=)'
    },
    {
      label: 'HGVS p.',
      value: 'NP_000509.1:p.Glu7Val\n' +
        'NP_000537.3:p.Arg213Ter',
      tip: 'HGVS protein'
    },
    {
      label: 'Variant IDs',
      value: 'rs334\n' +
        'VCV000000642.133\n' +
        'RCV000007540\n' +
        'COSV56056643\n' +
        'COSM521\n' +
        'COSN190667\n' +
        'VAR_004109',
      tip: 'dbSNP, ClinVar (VCV with a version, RCV), COSMIC (COSV, COSM, COSN), UniProt (VAR_)'
    },
    {
      label: 'Position only',
      value: '17 7675088\n' +
        '7 140753336 A\n' +
        '11:5227002:na:na\n' +
        'P01116 12\n' +
        'P15056 600 Val\n' +
        'P04637 M1?',
      tip: 'Without the alternative (or both alleles / amino acids): every possible change at the position'
    },
    {
      label: 'GRCh37',
      value: '7 140453136 A T\n' +
        '11 5248232 T A\n' +
        '12 25398284 C T\n' +
        '17 7578406 C T',
      tip: 'GRCh37 positions: detected and converted to GRCh38'
    },
  ],
  browse: [
    { label: 'UniProt ID', value: 'P04637', tip: 'TP53' },
    { label: 'Gene Symbol', value: 'BRCA1' },
    { label: 'Ensembl Gene', value: 'ENSG00000141510', tip: 'TP53' },
    { label: 'RefSeq ID', value: 'NM_000492.4', tip: 'CFTR' },
    { label: 'PDB ID', value: '4HHB', tip: 'Haemoglobin' }
  ],
  semantic: []  // cards only (SEMANTIC_CARDS)
};


const findExampleLabel = (input: string): string | null =>
  Object.values(EXAMPLES)
    .flat()
    .find(example => example.value === input)?.label ?? null;



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
  // ready-made datasets for the "explore a dataset" link; none if the API has none (or fails)
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  useEffect(() => { getDatasets().then(r => setDatasets(r.data ?? [])).catch(() => setDatasets([])); }, []);

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
      .split(/\r?\n/) // one variant per line: commas and pipes can be part of a variant (VCF, thousands separators)
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

  const [showAllCards, setShowAllCards] = useState(false);

  // Example cards open their result straight away (a single variant, a filtered browse or a semantic search)
  const renderCards = (cards: ExampleCard[], title: string) => (
    <>
      <h6>{title}</h6>
      <div className="story-cards">
        {(showAllCards ? cards : cards.slice(0, CARDS_SHOWN)).map(card => (
          <button key={card.name} type="button" className="story-card"
                  onClick={() => navigate(card.to)} title={card.note}>
            <span className="story-name">{card.name}</span>
            {card.detail && <span className="story-change">{card.detail}</span>}
            <span className="story-input"><code>{card.code}</code></span>
            <span className="story-format">{card.tag}</span>
          </button>
        ))}
      </div>
      {cards.length > CARDS_SHOWN && (
        <button type="button" className="story-more" onClick={() => setShowAllCards(v => !v)}>
          {showAllCards ? 'Fewer' : `${cards.length - CARDS_SHOWN} more`}
          <i className={`bi bi-chevron-${showAllCards ? 'up' : 'down'}`} />
        </button>
      )}
    </>
  );

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
          Browse Variants
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
                  {renderCards(ANNOTATE_CARDS, 'Try a well-known variant')}
                  <h6 className="examples-by-format">
                    Or fill the box by format
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
                  {datasets.length > 0 && (
                    <p className="example-dataset">
                      Or explore a ready-made dataset:{' '}
                      {datasets.map((d, i) => (
                        <React.Fragment key={d.name}>
                          {i > 0 && ', '}
                          <Link to={`${DATASET}/${d.name}`} title={d.description}>{d.title}</Link>
                          {' '}({d.lineCount.toLocaleString()} variants{d.sourceVersion ? `, ${d.sourceVersion}` : ''})
                        </React.Fragment>
                      ))}
                    </p>
                  )}
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
              <label className="input-label">Browse all mapped variants for a protein, gene or other identifier, or across all proteins with filters</label>

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
                {renderCards(BROWSE_CARDS, 'Try a ready-made view')}
                <h6 className="examples-by-format">Or add an identifier by type</h6>
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
                placeholder="loss of DNA mismatch repair in Lynch syndrome"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />
              {
                //Search through variant annotations, disease associations, and functional descriptions
              }
              <p className="browse-hint">
                <i className="bi bi-info-circle"></i>
                Experimental AI search — results are ranked by meaning, not exact
                matches, and accuracy varies by query. <Link to={`${HELP}#semantic-search`}>Learn more</Link>
              </p>
              <div className="examples">
                {renderCards(SEMANTIC_CARDS, 'Try a search')}
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