import React, { useState } from 'react';
import axios from 'axios';
import { IdUrl } from "./Evidences";
import './PubMedIdList.css';

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

interface PubMedIdListProps {
  ids: IdUrl[];
  initialShowCount?: number;
}

const PubMedIdList: React.FC<PubMedIdListProps> = ({
                                                     ids,
                                                     initialShowCount = 3
                                                   }) => {
  const [expanded, setExpanded] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [articles, setArticles] = useState<Map<string, PubMedArticle>>(new Map());

  const visibleIds = expanded ? ids : ids.slice(0, initialShowCount);
  const hasMore = ids.length > initialShowCount;
  const showExpandAll = visibleIds.length > 1; // Only show if more than 1 ID
  const allExpanded = visibleIds.every(({ id }) => expandedIds.has(id));

  const fetchArticles = async (pmids: string[]) => {
    // Set loading state for all
    setArticles(prev => {
      const newMap = new Map(prev);
      pmids.forEach(pmid => {
        newMap.set(pmid, { title: '', authors: [], loading: true });
      });
      return newMap;
    });

    try {
      // Single or batch request - works the same way
      const response = await pubmedApi.get('/esummary.fcgi', {
        params: { db: 'pubmed', id: pmids.join(','), retmode: 'json' }
      });

      const results = response.data.result;

      // Update all articles from the response
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
      // Set error state for all
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
          fetchArticles([pmid]); // Single ID as array
        }
      }
      return newSet;
    });
  };

  const expandAll = () => {
    const allVisibleIds = visibleIds.map(({ id }) => id);
    setExpandedIds(new Set(allVisibleIds));

    // Fetch uncached articles in a single batch
    const uncachedIds = allVisibleIds.filter(id => !articles.has(id));
    if (uncachedIds.length > 0) {
      fetchArticles(uncachedIds); // Multiple IDs as array
    }
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  return (
    <div>
      {showExpandAll && (
        <div className="pubmed-expand-controls">
          <button
            className="icon-btn"
            onClick={allExpanded ? collapseAll : expandAll}
            title={allExpanded ? "Collapse all" : "Expand all"}
          >
            <i className={`bi bi-${allExpanded ? 'dash-square' : 'plus-square'}`}></i>
          </button>
          <span className="pubmed-expand-label">
            {allExpanded ? 'Collapse all' : 'Expand all'}
          </span>
        </div>
      )}

      <ul>
        {visibleIds.map(({ id, sourceUrl }) => {
          const article = articles.get(id);
          const isExpanded = expandedIds.has(id);

          return (
            <li key={id}>
              <button
                className="icon-btn"
                onClick={() => toggleArticleDetails(id)}
                aria-label={isExpanded ? "Hide details" : "Show details"}
              >
                <i className={`bi bi-caret-${isExpanded ? 'down' : 'right'}`}></i>
              </button>{' '}
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ext-link"
              >
                {id}
              </a>

              {isExpanded && article && (
                <div className="pubmed-article-card">
                  {article.loading ? (
                    <div className="pubmed-article-loading">
                      <i className="bi bi-hourglass-split"></i> <em>Loading...</em>
                    </div>
                  ) : article.error ? (
                    <div className="pubmed-article-error">
                      <i className="bi bi-exclamation-triangle"></i> <em>{article.error}</em>
                    </div>
                  ) : (
                    <>
                      <div className="pubmed-article-title">
                        <i className="bi bi-file-text"></i> {article.title}
                      </div>
                      {article.authors.length > 0 && (
                        <div className="pubmed-article-authors">
                          <i className="bi bi-people"></i> {article.authors.slice(0, 3).join(', ')}
                          {article.authors.length > 3 && ` +${article.authors.length - 3} more`}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {hasMore && (
        <button
          className="show-btn"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded
            ? 'Show less'
            : `Show ${ids.length - initialShowCount} more`
          }
        </button>
      )}
    </div>
  );
};

export default PubMedIdList;