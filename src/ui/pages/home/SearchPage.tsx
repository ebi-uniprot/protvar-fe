// SearchPage.tsx
import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {ArrowRight, ChevronDown, ChevronUp, Clipboard, Database, FileText, FileUp, FlaskConical, List, LucideIcon,
  Search, Sparkles, TextAlignStart, X} from "lucide-react";
import PageHelp, {HelpTopic} from "../../components/help/PageHelp";
import {useStorage} from "../../../context/StorageContext";
import {ResultRecord, submissionExpiresAt} from "../../../types/ResultRecord";
import {getDatasets, uploadFile, uploadText} from "../../../services/ProtVarService";
import {API_ERROR, DATASET, RESULT, SEARCH, SEMANTIC_SEARCH} from "../../../constants/BrowserPaths";
import {Dataset} from "../../../types/Dataset";
import {readFirstLineFromFile} from "../../../utills/FileUtil";
import { DEFAULT_SEARCH_FILTERS } from '../../components/search/defaultFilters';
import SearchFilters, {
  SearchFilterParams
} from '../../components/search/SearchFilters';
import {buildFilterParams} from "../../components/search/filterUtils";
import {parseIdParam, singleIdPath} from "../../../utills/InputTypeResolver";
import {hasPrimaryFilter, PRIMARY_FILTER_PROMPT} from "../../../utills/PrimaryFilter";
import {ANNOTATE_CARDS, BROWSE_CARDS, FORMAT_EXAMPLES, ID_EXAMPLES, PASTE_BOX, SEMANTIC_CARDS} from "../../../constants/Example";

type SearchMode = 'annotate' | 'browse' | 'semantic'; // annotate=variant annotation; browse=by identifier and/or filters; semantic=free-text search
export type GenomeAssembly = 'auto' | 'grch38' | 'grch37';

// The active mode is mirrored in the URL (?tab=) so sidebar links can deep-link
// into a mode — same pattern as the Activity page's ?tab=downloads.
const TAB_PARAM = 'tab';
const tabToMode = (tab: string | null): SearchMode =>
  tab === 'browse' || tab === 'semantic' ? tab : 'annotate';

// Help for each mode, on the right of its title (each opens in the help drawer). Results has its own, on the result page.
const MODE_HELP: Record<SearchMode, HelpTopic[]> = {
  annotate: [
    { name: 'annotate', title: 'Annotate' },
    { name: 'input-formats', title: 'Supported formats' },
    { name: 'assembly-detection', title: 'Assembly detection' },
  ],
  browse: [
    { name: 'browse', title: 'Browse' },
    { name: 'browse', title: 'Filters', section: 'browse:filters' },
  ],
  semantic: [
    { name: 'semantic-search', title: 'Semantic search' },
  ],
};

// Semantic Search: example questions shown before "more"
const QUESTIONS_SHOWN = 4;

// Annotate's worksheet: rows of line numbers shown at least, before the box grows
const MIN_LINES = 9;

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
    return singleIdPath(type, value);
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


  const acceptFile = (file: File | undefined) => {
    if (!file) return;

    if (file.type && !file.type.startsWith('text/')) {
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

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => acceptFile(event.target.files?.[0]);

  // Annotate: a file dropped anywhere on the worksheet
  const [dragOver, setDragOver] = useState(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    acceptFile(e.dataTransfer.files?.[0]);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  const [showAllQuestions, setShowAllQuestions] = useState(false);

  // Annotate's worksheet: line numbers on the left, kept in step with the textarea's scroll
  const gutterRef = useRef<HTMLDivElement>(null);
  const variantLines = variantInput.split('\n');
  const gutterLines = Math.max(MIN_LINES, variantLines.length);

  // Browse: Enter or a comma turns the typed text into a token; Backspace on an empty input removes the last one
  const handleBrowseKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (browseInputText.trim()) addBrowseId();
      else if (e.key === 'Enter') handleSearch();
    } else if (e.key === 'Backspace' && !browseInputText && browseIds.length) {
      removeBrowseId(browseIds.length - 1);
    }
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
      const example = FORMAT_EXAMPLES.find(f => f.value === trimmedInput);
      if (example) return `${example.label} examples`;
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
      return false; // with nothing to browse, the click explains what's needed (PRIMARY_FILTER_PROMPT)
    } else if (activeMode === 'semantic') {
      return !textInput.trim();
    }
    return true;
  };

  // Every form: an icon, a title and one short line; the rest of the explaining lives in Help (the ? buttons)
  const formTitle = (Icon: LucideIcon, title: string, line: string, tag?: React.ReactNode) => (
    <div className="form-title">
      <span className="form-title-icon"><Icon size={22} strokeWidth={1.75} aria-hidden="true" /></span>
      <div>
        <h1>{title}{tag}</h1>
        <p>{line}</p>
      </div>
      <PageHelp topics={MODE_HELP[activeMode]} />
    </div>
  );

  const submitLabel = activeMode === 'annotate' ? 'Annotate' : activeMode === 'browse' ? 'Browse' : 'Search';
  const submitButton = (
    <button type="button" className="form-submit" onClick={handleSearch} disabled={isSubmitDisabled() || loading}>
      {loading ? 'Working…' : submitLabel}
      <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
    </button>
  );

  return (
    <>
    {/* Mode bar: the one place to switch mode; full width, pinned to the top while the page scrolls */}
    <nav className="mode-bar" aria-label="Search modes">
      <div className="search-modes">
        <button className={`mode-tab ${activeMode === 'annotate' ? 'active' : ''}`}
                onClick={() => handleModeChange('annotate')}>
          <Clipboard size={16} strokeWidth={1.75} aria-hidden="true" /> Annotate
        </button>
        <button className={`mode-tab ${activeMode === 'browse' ? 'active' : ''}`}
                onClick={() => handleModeChange('browse')}>
          <List size={16} strokeWidth={1.75} aria-hidden="true" /> Browse
        </button>
        <button className={`mode-tab ${activeMode === 'semantic' ? 'active' : ''}`}
                onClick={() => handleModeChange('semantic')}>
          <TextAlignStart size={16} strokeWidth={1.75} aria-hidden="true" /> Semantic Search
        </button>
      </div>
    </nav>

    <div className="search-container">

      <div className="search-form">
        {/* ── Annotate: a worksheet — numbered lines, a file dropped on it, assembly and Annotate in its toolbar ── */}
        {activeMode === 'annotate' && (
          <>
            {formTitle(Clipboard, 'Annotate variants', 'Paste a list or upload a file, in any supported format.')}

            <div className={`composer${dragOver ? ' composer--drop' : ''}`}
                 onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                 onDragLeave={() => setDragOver(false)}
                 onDrop={handleDrop}>
              {uploadedFile ? (
                <div className="composer-file">
                  <FileText size={20} strokeWidth={1.75} aria-hidden="true" />
                  <span className="composer-file-name">{uploadedFile.name}</span>
                  <span className="composer-file-size">{(uploadedFile.size / 1024).toFixed(1)} KB</span>
                  <button type="button" className="composer-icon-btn" onClick={handleRemoveFile}
                          aria-label="Remove file" title="Remove file"><X size={16} aria-hidden="true" /></button>
                </div>
              ) : (
                <div className="worksheet">
                  <div className="worksheet-gutter" ref={gutterRef} aria-hidden="true">
                    {Array.from({ length: gutterLines }, (_, i) => <span key={i}>{i + 1}</span>)}
                  </div>
                  <textarea
                    className="worksheet-input"
                    aria-label="Variants, one per line"
                    placeholder={PASTE_BOX}
                    value={variantInput}
                    spellCheck={false}
                    onChange={(e) => setVariantInput(e.target.value)}
                    onScroll={(e) => { if (gutterRef.current) gutterRef.current.scrollTop = e.currentTarget.scrollTop; }}
                  />
                </div>
              )}

              <div className="composer-toolbar">
                <button type="button" className="composer-upload" onClick={() => fileInputRef.current?.click()}>
                  <FileUp size={16} strokeWidth={1.75} aria-hidden="true" /> Upload or drop a file
                </button>
                <label className="composer-select" title="Genome assembly of genomic inputs">
                  Assembly
                  <select value={genomeAssembly} onChange={e => setGenomeAssembly(e.target.value as GenomeAssembly)}>
                    <option value="auto">Auto</option>
                    <option value="grch38">GRCh38</option>
                    <option value="grch37">GRCh37</option>
                  </select>
                </label>
                <span className="composer-spacer" />
                {(variantInput || uploadedFile) && (
                  <button type="button" className="composer-clear" onClick={handleClear}>Clear</button>
                )}
                {submitButton}
              </div>
            </div>

            {/* Under the box: a button per format, filling the box with examples of it */}
            <div className="format-examples" role="group" aria-label="Fill the box with examples">
              <span className="format-examples-label">Fill with examples:</span>
              {FORMAT_EXAMPLES.map(f => (
                <button key={f.label} type="button" className="format-example" title={f.tip}
                        onClick={() => { setVariantInput(f.value); setUploadedFile(null); setError(''); }}>
                  {f.label}
                </button>
              ))}
            </div>

            <input type="file" ref={fileInputRef} style={{display: 'none'}} accept=".txt,.tsv,.csv,.vcf"
                   onChange={handleFileUpload} />

            {/* Well-known variants: compact cards, each opening its result */}
            <div className="variant-cards">
              <span className="variant-cards-label">Try a well-known variant</span>
              <div className="variant-cards-grid">
                {ANNOTATE_CARDS.map(card => (
                  <button key={card.name} type="button" className="variant-card" onClick={() => navigate(card.to)}
                          title={card.note}>
                    <span className="variant-card-head">
                      <strong>{card.name}</strong>
                      <span className="variant-card-tag">{card.tag}</span>
                    </span>
                    <span className="variant-card-detail">{card.detail} · <code>{card.code}</code></span>
                  </button>
                ))}
              </div>
            </div>

            {/* Ready-made datasets: a whole upload, not one variant, so a line of its own */}
            {datasets.map(d => (
              <Link key={d.name} className="dataset-link" to={`${DATASET}/${d.name}`} title={d.description}>
                <Database size={16} strokeWidth={1.75} aria-hidden="true" />
                <span className="dataset-link-label">Dataset</span>
                <strong>{d.title}</strong>
                <span className="dataset-link-meta">
                  {d.lineCount.toLocaleString()} variants{d.sourceVersion ? ` · ${d.sourceVersion}` : ''}
                </span>
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            ))}
          </>
        )}

        {/* ── Browse: IDs as tokens in one line; ready-made views as tiles; filters in the rail ── */}
        {activeMode === 'browse' && (
          <>
            {formTitle(List, 'Browse variants',
              'Every variant in a protein, gene or structure, or across all proteins with filters.')}

            <div className="composer composer--line">
              <Search size={18} strokeWidth={1.75} className="composer-lead" aria-hidden="true" />
              {browseIds.map((id, index) => (
                <span key={id} className="token">
                  {id}
                  <button type="button" onClick={() => removeBrowseId(index)} aria-label={`Remove ${id}`}>
                    <X size={12} aria-hidden="true" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                aria-label="Gene, protein or other identifier"
                placeholder={browseIds.length ? 'Add another' : 'Gene, protein, Ensembl, RefSeq or PDB ID'}
                value={browseInputText}
                onChange={(e) => setBrowseInputText(e.target.value)}
                onKeyDown={handleBrowseKeyDown}
                onBlur={() => browseInputText.trim() && addBrowseId()}
              />
              {submitButton}
            </div>

            {/* Under the box: an example of each identifier type, added as a token */}
            <div className="format-examples" role="group" aria-label="Add an example identifier">
              <span className="format-examples-label">Add an example:</span>
              {ID_EXAMPLES.map(ex => (
                <button key={ex.label} type="button" className="format-example" title={ex.tip}
                        onClick={() => { if (!browseIds.includes(ex.value)) setBrowseIds(prev => [...prev, ex.value]); setError(''); }}>
                  {ex.label}
                </button>
              ))}
            </div>

            {/* Filters under the box, open, first section only: no side rail, so switching tabs moves nothing */}
            <SearchFilters
              filters={searchFilters}
              onFiltersChange={setSearchFilters}
              showSorting={false}
              defaultExpanded
              openSections={['variant']}
            />

            {/* Ready-made views: compact cards, as Annotate's well-known variants; each opens its result */}
            <div className="variant-cards">
              <span className="variant-cards-label">Try a ready-made view</span>
              <div className="variant-cards-grid">
                {BROWSE_CARDS.map(card => (
                  <button key={card.name} type="button" className="variant-card" onClick={() => navigate(card.to)}
                          title={card.note}>
                    <span className="variant-card-head">
                      <strong>{card.name}</strong>
                      <span className="variant-card-tag">{card.tag}</span>
                    </span>
                    <span className="variant-card-detail">
                      {card.detail}
                      {card.code.toLowerCase() !== card.tag.toLowerCase() && <> · <code>{card.code}</code></>}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Semantic Search: ask in words — a roomy question box, example questions as sentences ── */}
        {activeMode === 'semantic' && (
          <>
            {formTitle(TextAlignStart, 'Search by description', 'Describe a disease, drug response or mechanism.',
              <span className="form-tag" tabIndex={0}
                    title="Experimental AI search — results are ranked by meaning, not exact matches, and accuracy varies by query.">
                <FlaskConical size={12} aria-hidden="true" /> Experimental
              </span>)}

            <div className="composer">
              <textarea
                className="composer-question"
                aria-label="Describe what you are looking for"
                placeholder="e.g. loss of DNA mismatch repair in Lynch syndrome"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSearch(); } }}
              />
              <div className="composer-toolbar">
                <span className="composer-spacer" />
                {submitButton}
              </div>
            </div>

            {/* Semantic Search keeps its own look: example questions as a list of full sentences */}
            <div className="question-list">
              {(showAllQuestions ? SEMANTIC_CARDS : SEMANTIC_CARDS.slice(0, QUESTIONS_SHOWN)).map(card => (
                <button key={card.name} type="button" className="question" onClick={() => navigate(card.to)}>
                  <Sparkles size={15} strokeWidth={1.75} className="question-icon" aria-hidden="true" />
                  <span className="question-text">{card.code}</span>
                  <span className="question-tag">{card.tag}</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </button>
              ))}
            </div>
            {SEMANTIC_CARDS.length > QUESTIONS_SHOWN && (
              <button type="button" className="form-more" onClick={() => setShowAllQuestions(v => !v)}>
                {showAllQuestions ? 'Fewer' : `${SEMANTIC_CARDS.length - QUESTIONS_SHOWN} more`}
                {showAllQuestions ? <ChevronUp size={14} aria-hidden="true" /> : <ChevronDown size={14} aria-hidden="true" />}
              </button>
            )}
          </>
        )}

        {error && <div className="error-message" role="alert">{error}</div>}
      </div>

    </div>
    </>
  );
};

export default SearchPage;
