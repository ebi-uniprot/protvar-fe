import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import DefaultPageLayout from '../../layout/DefaultPageLayout';
import { vectorSearch, getSemanticSearchModels } from '../../../services/ProtVarService';
import { GroupedResult, ModelInfo, VectorSearchResult } from '../../../types/VectorSearch';
import { TITLE } from '../../../constants/const';
import { HelpButton } from '../../components/help/HelpButton';
import { HelpContent } from '../../components/help/HelpContent';

const PAGE_SIZE = 10;
const DEFAULT_MODEL = 'mpnet';

const SOURCE_TYPE_LABELS: Record<string, { label: string; cls: string }> = {
  protein_name:                  { label: 'Name',        cls: 'annotation-badge--name' },
  comment_FUNCTION:              { label: 'Function',    cls: 'annotation-badge--function' },
  comment_PATHWAY:               { label: 'Pathway',     cls: 'annotation-badge--pathway' },
  comment_DISEASE:               { label: 'Disease',     cls: 'annotation-badge--disease' },
  comment_TISSUE_SPECIFICITY:    { label: 'Tissue',      cls: 'annotation-badge--tissue' },
  comment_DEVELOPMENTAL_STAGE:   { label: 'Development', cls: 'annotation-badge--dev' },
  comment_SIMILARITY:            { label: 'Similarity',  cls: 'annotation-badge--other' },
  feature_CHAIN:                 { label: 'Chain',       cls: 'annotation-badge--other' },
};

function sourceTypeInfo(type: string) {
  return SOURCE_TYPE_LABELS[type] ?? { label: type.replace(/^(comment_|feature_)/, ''), cls: 'annotation-badge--other' };
}

function groupResults(results: VectorSearchResult[]): GroupedResult[] {
  const map = new Map<string, VectorSearchResult[]>();
  for (const r of results) {
    if (!map.has(r.accession)) map.set(r.accession, []);
    map.get(r.accession)!.push(r);
  }
  return Array.from(map.entries())
    .map(([accession, matches]) => {
      const best = matches.reduce((a, b) => a.distance < b.distance ? a : b);
      const nameMatch = matches.find(m => m.sourceType === 'protein_name');
      return {
        accession,
        proteinName: nameMatch?.sourceText ?? null,
        score: Math.round((1 - best.distance) * 1000) / 10,
        bestText: best.sourceText,
        sourceTypes: Array.from(new Set(matches.map(m => m.sourceType))),
        matches,
      };
    })
    .sort((a, b) => b.score - a.score);
}

function ScoreBar({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(100, score));
  const cls = pct >= 80 ? 'similarity-score--high' : pct >= 60 ? 'similarity-score--mid' : 'similarity-score--low';
  return (
    <div className={`similarity-score ${cls}`}>
      <div className="similarity-bar" style={{ width: `${pct}%` }} />
      <span className="similarity-label">{score.toFixed(1)}%</span>
    </div>
  );
}

function ResultCard({ result, onView }: { result: GroupedResult; onView: (acc: string) => void }) {
  const rankedMatches = Array.from(
    result.matches
      .reduce((acc, m) => {
        const existing = acc.get(m.sourceType);
        if (!existing || m.distance < existing.distance) acc.set(m.sourceType, m);
        return acc;
      }, new Map<string, VectorSearchResult>())
      .values()
  ).sort((a, b) => a.distance - b.distance);

  return (
    <div className="protein-card">
      <div className="protein-card-header">
        <div className="protein-card-title">
          {result.proteinName && <span className="protein-name">{result.proteinName}</span>}
          <span className="protein-accession">{result.accession}</span>
        </div>
      </div>
      <div className="annotation-matches">
        {rankedMatches.map(m => {
          const { label, cls } = sourceTypeInfo(m.sourceType);
          const score = Math.round((1 - m.distance) * 1000) / 10;
          const posLabel = m.beginPos !== null && m.endPos !== null
            ? m.beginPos === m.endPos
              ? `position ${m.beginPos}`
              : `positions ${m.beginPos}–${m.endPos}`
            : null;
          return (
            <div key={m.sourceType} className="annotation-match">
              <span className={`annotation-badge ${cls}`}>{label}</span>
              <p className="match-text">"{m.sourceText}"</p>
              {posLabel && (
                <span className="match-position">
                  <a href={m.beginPos === m.endPos
                    ? `/p/${m.accession}/${m.beginPos}`
                    : `/p/${m.accession}/${m.beginPos}-${m.endPos}`}>{posLabel}</a>
                </span>
              )}
              <ScoreBar score={score} />
            </div>
          );
        })}
      </div>
      <div className="protein-card-footer">
        <button className="btn btn-secondary view-variants-btn" onClick={() => onView(result.accession)}>
          View variants <i className="bi bi-arrow-right" />
        </button>
      </div>
    </div>
  );
}

function SemanticSearchPageContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') ?? '';
  const modelParam = searchParams.get('model') ?? DEFAULT_MODEL;

  const [models, setModels] = useState<ModelInfo[]>([]);
  const [selectedModel, setSelectedModel] = useState(modelParam);
  const [rawResults, setRawResults] = useState<VectorSearchResult[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const prevQueryRef = useRef('');
  const prevModelRef = useRef('');

  const groupedResults = useMemo(() => groupResults(rawResults), [rawResults]);

  useEffect(() => {
    document.title = `Semantic Search | ${TITLE}`;
    getSemanticSearchModels().then(setModels);
  }, []);

  // Sync model param → state when URL changes externally
  useEffect(() => {
    setSelectedModel(modelParam);
  }, [modelParam]);

  function handleModelChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    setSelectedModel(next);
    const params: Record<string, string> = { q: query, model: next };
    setSearchParams(params, { replace: true });
  }

  useEffect(() => {
    if (!query) return;

    const isNewSearch =
      prevQueryRef.current !== query || prevModelRef.current !== selectedModel;

    if (isNewSearch) {
      prevQueryRef.current = query;
      prevModelRef.current = selectedModel;
      if (page !== 0) {
        setPage(0);
        setRawResults([]);
        setHasMore(false);
        setError(null);
        return;
      }
      setRawResults([]);
      setHasMore(false);
    }

    setLoading(true);
    setError(null);
    vectorSearch(query, PAGE_SIZE, page * PAGE_SIZE, selectedModel)
      .then(res => {
        const data = res.data;
        if (!data.success) {
          setError(data.error ?? 'Search failed.');
        } else {
          const newResults: VectorSearchResult[] = data.results ?? [];
          setRawResults(prev => page === 0 ? newResults : [...prev, ...newResults]);
          setHasMore(newResults.length >= PAGE_SIZE);
        }
      })
      .catch((err: any) => {
        const msg = err?.response?.data?.error;
        setError(msg ?? 'Could not reach the search service. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [query, selectedModel, page]);

  return (
    <div className="container">
      <div className="semantic-header">
        <h5 className="page-header">
          {query ? <>Results for <em>"{query}"</em></> : 'Semantic Search'}
        </h5>
        <div className="semantic-toolbar">
          {!loading && !error && groupedResults.length > 0 && (
            <span className="result-count">{groupedResults.length} protein{groupedResults.length !== 1 ? 's' : ''} matched</span>
          )}
          {models.length > 1 && (
            <select
              className="model-select"
              value={selectedModel}
              onChange={handleModelChange}
              title="Embedding model"
            >
              {models.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          )}
          <HelpButton title="" content={<HelpContent name="semantic-search" />} variant="inline" />
        </div>
      </div>

      {loading && page === 0 && (
        <div className="search-state">
          <i className="bi bi-hourglass-split search-state-icon" />
          <p>Searching…</p>
        </div>
      )}

      {error && (
        <div className="search-state search-state--error">
          <i className="bi bi-exclamation-circle search-state-icon" />
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && groupedResults.length === 0 && query && (
        <div className="search-state">
          <i className="bi bi-search search-state-icon" />
          <p>No results found for <em>"{query}"</em>. Try a different term.</p>
        </div>
      )}

      {groupedResults.length > 0 && (
        <div className="search-results">
          {groupedResults.map(r => (
            <ResultCard
              key={r.accession}
              result={r}
              onView={acc => navigate(`/${acc}`)}
            />
          ))}
          {!loading && hasMore && (
            <button
              className="btn btn-secondary load-more-btn"
              onClick={() => setPage(p => p + 1)}
            >
              Load more results
            </button>
          )}
          {loading && page > 0 && (
            <div className="search-state">
              <i className="bi bi-hourglass-split search-state-icon" />
              <p>Loading more…</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SemanticSearchPage() {
  return <DefaultPageLayout content={<SemanticSearchPageContent />} />;
}

export default SemanticSearchPage;
