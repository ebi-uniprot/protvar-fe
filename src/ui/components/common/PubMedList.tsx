import React, { useState } from 'react';
import axios from 'axios';
import { IdUrl } from "./Evidences";
import {ExtLink} from "./Link";

// Shared instance for PubMed API
const pubmedApi = axios.create({
  baseURL: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils',
  timeout: 10000,
});

interface PubMedArticle {
  title: string;
  authors: string[];
  loading: boolean;
  error?: string;
}

interface PubMedListProps {
  ids: IdUrl[];
  initialShowCount?: number;
}

const PubMedList: React.FC<PubMedListProps> = ({
                                                 ids,
                                                 initialShowCount = 3
                                               }) => {
  const [expanded, setExpanded] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [articles, setArticles] = useState<Map<string, PubMedArticle>>(new Map());

  const visibleIds = expanded ? ids : ids.slice(0, initialShowCount);
  const hasMore = ids.length > initialShowCount;
  const showExpandAll = visibleIds.length > 1;
  const allExpanded = visibleIds.every(({ id }) => expandedIds.has(id));

  const fetchArticles = async (pmids: string[]) => {
    setArticles(prev => {
      const newMap = new Map(prev);
      pmids.forEach(pmid => {
        newMap.set(pmid, { title: '', authors: [], loading: true });
      });
      return newMap;
    });

    try {
      const response = await pubmedApi.get('/esummary.fcgi', {
        params: { db: 'pubmed', id: pmids.join(','), retmode: 'json' }
      });

      const results = response.data.result;

      setArticles(prev => {
        const newMap = new Map(prev);
        pmids.forEach(pmid => {
          const article = results?.[pmid];
          if (article?.title) {
            newMap.set(pmid, {
              title: article.title,
              authors: article.authors?.map((a: any) => a.name) || [],
              loading: false
            });
          } else {
            newMap.set(pmid, {
              title: '',
              authors: [],
              loading: false,
              error: 'Article data not found'
            });
          }
        });
        return newMap;
      });
    } catch (err) {
      console.error('Error fetching PubMed articles:', err);
      setArticles(prev => {
        const newMap = new Map(prev);
        pmids.forEach(pmid => {
          newMap.set(pmid, {
            title: '',
            authors: [],
            loading: false,
            error: 'Failed to load article'
          });
        });
        return newMap;
      });
    }
  };

  const toggleArticleDetails = (pmid: string) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pmid)) {
        newSet.delete(pmid);
      } else {
        newSet.add(pmid);
        if (!articles.has(pmid)) {
          fetchArticles([pmid]);
        }
      }
      return newSet;
    });
  };

  const expandAll = () => {
    const allVisibleIds = visibleIds.map(({ id }) => id);
    setExpandedIds(new Set(allVisibleIds));

    const uncachedIds = allVisibleIds.filter(id => !articles.has(id));
    if (uncachedIds.length > 0) {
      fetchArticles(uncachedIds);
    }
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  return (
    <div className="pubmed-list-container">
      <div className="pubmed-ids-row">
        {showExpandAll && (
          <button
            className="pubmed-btn"
            onClick={allExpanded ? collapseAll : expandAll}
            title={allExpanded ? "Collapse all" : "Expand all"}
          >
            <i className={`bi bi-${allExpanded ? 'dash-square' : 'plus-square'}`}></i>
          </button>
        )}

        {visibleIds.map(({ id, sourceUrl }) => {
          const isExpanded = expandedIds.has(id);
          return (
            <span key={id} className={`pubmed-id-chip${isExpanded ? ' pubmed-id-chip--active' : ''}`}>
              <ExtLink url={sourceUrl} text={id} />
              <button
                className="pubmed-chip-toggle"
                onClick={() => toggleArticleDetails(id)}
                title={isExpanded ? "Hide details" : "Show details"}
              >
                <i className={`bi bi-book${isExpanded ? '-fill' : ''}`}></i>
              </button>
            </span>
          );
        })}

        {hasMore && (
          <button
            className="show-btn"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Less' : `+${ids.length - initialShowCount}`}
          </button>
        )}
      </div>

      {visibleIds.map(({ id, sourceUrl }) => {
        if (!expandedIds.has(id)) return null;
        const article = articles.get(id);
        if (!article) return null;

        return (
          <div key={id} className="pubmed-article-card">
            <div className="pubmed-article-pmid">
              <ExtLink url={sourceUrl} text={id} />
            </div>
            {article.loading ? (
              <div className="pubmed-article-loading">
                <i className="bi bi-hourglass-split"></i>
                <em>Loading...</em>
              </div>
            ) : article.error ? (
              <div className="pubmed-article-error">
                <i className="bi bi-exclamation-triangle"></i>
                <em>{article.error}</em>
              </div>
            ) : (
              <>
                <div className="pubmed-article-title">
                  <i className="bi bi-file-text"></i>
                  <span>{article.title}</span>
                </div>
                {article.authors.length > 0 && (
                  <div className="pubmed-article-authors">
                    <i className="bi bi-people"></i>
                    <span>
                      {article.authors.slice(0, 3).join(', ')}
                      {article.authors.length > 3 && ` +${article.authors.length - 3} more`}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PubMedList;
