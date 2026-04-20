import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import DefaultPageLayout from '../../layout/DefaultPageLayout';
import { vectorSearch } from '../../../services/ProtVarService';
import { GroupedResult, VectorSearchResult } from '../../../types/VectorSearch';
import { TITLE } from '../../../constants/const';

const PAGE_SIZE = 10;

const SOURCE_TYPE_LABELS: Record<string, { label: string; cls: string }> = {
  protein_name:                  { label: 'Name',        cls: 'ts-badge--name' },
  comment_FUNCTION:              { label: 'Function',    cls: 'ts-badge--function' },
  comment_PATHWAY:               { label: 'Pathway',     cls: 'ts-badge--pathway' },
  comment_DISEASE:               { label: 'Disease',     cls: 'ts-badge--disease' },
  comment_TISSUE_SPECIFICITY:    { label: 'Tissue',      cls: 'ts-badge--tissue' },
  comment_DEVELOPMENTAL_STAGE:   { label: 'Development', cls: 'ts-badge--dev' },
  comment_SIMILARITY:            { label: 'Similarity',  cls: 'ts-badge--other' },
  feature_CHAIN:                 { label: 'Chain',       cls: 'ts-badge--other' },
};

function sourceTypeInfo(type: string) {
  return SOURCE_TYPE_LABELS[type] ?? { label: type.replace(/^(comment_|feature_)/, ''), cls: 'ts-badge--other' };
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
  const cls = pct >= 80 ? 'ts-score--high' : pct >= 60 ? 'ts-score--mid' : 'ts-score--low';
  return (
    <div className={`ts-score ${cls}`}>
      <div className="ts-score-bar" style={{ width: `${pct}%` }} />
      <span className="ts-score-label">{score.toFixed(1)}%</span>
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
    <div className="ts-card">
      <div className="ts-card-header">
        <div className="ts-card-title">
          {result.proteinName && <span className="ts-protein-name">{result.proteinName}</span>}
          <span className="ts-accession">{result.accession}</span>
        </div>
      </div>
      <div className="ts-matches">
        {rankedMatches.map(m => {
          const { label, cls } = sourceTypeInfo(m.sourceType);
          const score = Math.round((1 - m.distance) * 1000) / 10;
          return (
            <div key={m.sourceType} className="ts-match">
              <span className={`ts-badge ${cls}`}>{label}</span>
              <p className="ts-match-text">"{m.sourceText}"</p>
              <ScoreBar score={score} />
            </div>
          );
        })}
      </div>
      <div className="ts-card-footer">
        <button className="btn btn-secondary ts-view-btn" onClick={() => onView(result.accession)}>
          View variants <i className="bi bi-arrow-right" />
        </button>
      </div>
    </div>
  );
}

function SemanticSearchPageContent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') ?? '';

  const [rawResults, setRawResults] = useState<VectorSearchResult[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const prevQueryRef = useRef('');

  const groupedResults = useMemo(() => groupResults(rawResults), [rawResults]);

  useEffect(() => {
    document.title = `Semantic Search | ${TITLE}`;
  }, []);

  useEffect(() => {
    if (!query) return;

    const isNewQuery = prevQueryRef.current !== query;
    if (isNewQuery) {
      prevQueryRef.current = query;
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
    vectorSearch(query, PAGE_SIZE, page * PAGE_SIZE)
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
  }, [query, page]);

  return (
    <div className="container">
      <div className="ts-header">
        <h5 className="page-header">
          {query ? <>Results for <em>"{query}"</em></> : 'Semantic Search'}
        </h5>
        {!loading && !error && groupedResults.length > 0 && (
          <span className="ts-count">{groupedResults.length} protein{groupedResults.length !== 1 ? 's' : ''} matched</span>
        )}
      </div>

      {loading && page === 0 && (
        <div className="ts-state">
          <i className="bi bi-hourglass-split ts-state-icon" />
          <p>Searching…</p>
        </div>
      )}

      {error && (
        <div className="ts-state ts-state--error">
          <i className="bi bi-exclamation-circle ts-state-icon" />
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && groupedResults.length === 0 && query && (
        <div className="ts-state">
          <i className="bi bi-search ts-state-icon" />
          <p>No results found for <em>"{query}"</em>. Try a different term.</p>
        </div>
      )}

      {groupedResults.length > 0 && (
        <div className="ts-results">
          {groupedResults.map(r => (
            <ResultCard
              key={r.accession}
              result={r}
              onView={acc => navigate(`/${acc}`)}
            />
          ))}
          {!loading && hasMore && (
            <button
              className="btn btn-secondary ts-load-more"
              onClick={() => setPage(p => p + 1)}
            >
              Load more results
            </button>
          )}
          {loading && page > 0 && (
            <div className="ts-state">
              <i className="bi bi-hourglass-split ts-state-icon" />
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
