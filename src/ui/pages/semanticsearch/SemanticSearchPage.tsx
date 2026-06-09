import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import DefaultPageLayout from '../../layout/DefaultPageLayout';
import { vectorSearch, getSemanticSearchModels } from '../../../services/ProtVarService';
import {
  GroupedResult, GroupedPopulationResult, ModelInfo,
  VectorSearchResult, PopulationVectorSearchResult,
} from '../../../types/VectorSearch';
import { TITLE } from '../../../constants/const';
import { modelRank } from '../../../constants/semanticSearch';
import { HelpButton } from '../../components/help/HelpButton';
import { HelpContent } from '../../components/help/HelpContent';

const PAGE_SIZE = 10;
const DEFAULT_MODEL = 'biobert';

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

const score1dp = (distance: number) => Math.round((1 - distance) * 1000) / 10;

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
        score: score1dp(best.distance),
        bestText: best.sourceText,
        sourceTypes: Array.from(new Set(matches.map(m => m.sourceType))),
        matches,
      };
    })
    .sort((a, b) => b.score - a.score);
}

function groupPopulationResults(results: PopulationVectorSearchResult[]): GroupedPopulationResult[] {
  const map = new Map<string, PopulationVectorSearchResult[]>();
  for (const r of results) {
    if (!map.has(r.accession)) map.set(r.accession, []);
    map.get(r.accession)!.push(r);
  }
  return Array.from(map.entries())
    .map(([accession, matches]) => {
      const best = matches.reduce((a, b) => a.distance < b.distance ? a : b);
      return {
        accession,
        score: score1dp(best.distance),
        matches: [...matches].sort((a, b) => a.distance - b.distance),
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
                  <Link to={m.beginPos === m.endPos
                    ? `/p/${m.accession}/${m.beginPos}`
                    : `/p/${m.accession}/${m.beginPos}-${m.endPos}`}>{posLabel}</Link>
                </span>
              )}
              <ScoreBar score={score1dp(m.distance)} />
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

function PopulationResultCard({ result }: { result: GroupedPopulationResult }) {
  return (
    <div className="protein-card">
      <div className="protein-card-header">
        <div className="protein-card-title">
          <span className="protein-accession">{result.accession}</span>
        </div>
      </div>
      <div className="annotation-matches">
        {result.matches.map((m, i) => (
          <div key={i} className="annotation-match">
            <span className="annotation-badge annotation-badge--disease">Variant</span>
            <p className="match-text">"{m.sourceText}"</p>
            {m.position != null && (
              <span className="match-position">
                <Link to={`/p/${m.accession}/${m.position}`}>position {m.position}</Link>
              </span>
            )}
            <ScoreBar score={score1dp(m.distance)} />
          </div>
        ))}
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
  const [rawFunctionResults, setRawFunctionResults] = useState<VectorSearchResult[]>([]);
  const [rawPopulationResults, setRawPopulationResults] = useState<PopulationVectorSearchResult[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const prevQueryRef = useRef('');
  const prevModelRef = useRef('');

  const functionGrouped = useMemo(() => groupResults(rawFunctionResults), [rawFunctionResults]);
  const populationGrouped = useMemo(() => groupPopulationResults(rawPopulationResults), [rawPopulationResults]);
  // Dropdown follows the documented best-first order, not the API's order.
  const orderedModels = useMemo(
    () => [...models].sort((a, b) => modelRank(a.id) - modelRank(b.id)),
    [models]
  );
  const totalProteins = functionGrouped.length + populationGrouped.length;

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
    setSearchParams({ q: query, model: next }, { replace: true });
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
        setRawFunctionResults([]);
        setRawPopulationResults([]);
        setHasMore(false);
        setError(null);
        return;
      }
      setRawFunctionResults([]);
      setRawPopulationResults([]);
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
          const fn: VectorSearchResult[] = data.functionResults ?? [];
          const pop: PopulationVectorSearchResult[] = data.populationResults ?? [];
          setRawFunctionResults(prev => page === 0 ? fn : [...prev, ...fn]);
          setRawPopulationResults(prev => page === 0 ? pop : [...prev, ...pop]);
          // More to load if either corpus filled a page.
          setHasMore(fn.length >= PAGE_SIZE || pop.length >= PAGE_SIZE);
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
          {!loading && !error && totalProteins > 0 && (
            <span className="result-count">
              {functionGrouped.length} protein{functionGrouped.length !== 1 ? 's' : ''}
              {' · '}
              {populationGrouped.length} variant group{populationGrouped.length !== 1 ? 's' : ''}
            </span>
          )}
          {orderedModels.length > 1 && (
            <select
              className="model-select"
              value={selectedModel}
              onChange={handleModelChange}
              title="Embedding model"
            >
              {orderedModels.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          )}
          <HelpButton title="" content={<HelpContent name="semantic-search" />} variant="inline" />
        </div>
      </div>

      {query && (
        <p className="semantic-ai-notice">
          <i className="bi bi-info-circle" />
          These results are AI-ranked by semantic similarity. Relevance varies
          depending on your search terms — use them as a starting point and
          verify important findings against the annotated data.
        </p>
      )}

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

      {!loading && !error && totalProteins === 0 && query && (
        <div className="search-state">
          <i className="bi bi-search search-state-icon" />
          <p>No results found for <em>"{query}"</em>. Try a different term.</p>
        </div>
      )}

      {totalProteins > 0 && (
        <>
          {/* Function corpus — protein-level descriptive matches */}
          {functionGrouped.length > 0 && (
            <section className="search-results-section">
              <h6 className="results-section-title">
                <i className="bi bi-diagram-3" /> Protein function
              </h6>
              <div className="search-results">
                {functionGrouped.map(r => (
                  <ResultCard key={r.accession} result={r} onView={acc => navigate(`/${acc}`)} />
                ))}
              </div>
            </section>
          )}

          {/* Population corpus — variant-level matches (residue + disease) */}
          {populationGrouped.length > 0 && (
            <section className="search-results-section">
              <h6 className="results-section-title">
                <i className="bi bi-geo-alt" /> Variants
              </h6>
              <div className="search-results">
                {populationGrouped.map(r => (
                  <PopulationResultCard key={r.accession} result={r} />
                ))}
              </div>
            </section>
          )}

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
        </>
      )}
    </div>
  );
}

function SemanticSearchPage() {
  return <DefaultPageLayout content={<SemanticSearchPageContent />} />;
}

export default SemanticSearchPage;
