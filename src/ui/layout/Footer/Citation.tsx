import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Icon } from '../../elements/Icon';
import { CITATIONS } from '../../../constants/BrowserPaths';

export interface CitationEntry {
  Authors: string;
  Title: string;
  Publication: string;
  Volume?: string;
  Number?: string;
  Pages?: string;
  Year: number;
  Publisher?: string;
  URL?: string;
  Selected?: string;   // "yes": shown in the footer carousel
}

const parseCSV = (csvText: string): CitationEntry[] => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const citations: CitationEntry[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values: string[] = [];
    let currentValue = '';
    let insideQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim());

    const citation: any = {};
    headers.forEach((header, idx) => {
      const value = values[idx] || '';
      citation[header] = value === '' ? undefined :
        (header === 'Year' ? parseInt(value) : value);
    });

    if (citation.Authors && citation.Title) {
      citations.push(citation as CitationEntry);
    }
  }

  return citations;
};

let cachedCitations: CitationEntry[] | null = null;
let loadingPromise: Promise<CitationEntry[]> | null = null;

// public/citations.csv: every citation, newest first (shared by the footer carousel and the Citations page)
export const loadCitations = (): Promise<CitationEntry[]> => {
  if (cachedCitations !== null) return Promise.resolve(cachedCitations);
  if (loadingPromise !== null) return loadingPromise;

  loadingPromise = fetch(`${process.env.PUBLIC_URL}/citations.csv`)
    .then(response => {
      if (!response.ok) throw new Error('Failed to load citations');
      return response.text();
    })
    .then(csvText => {
      const parsed = parseCSV(csvText);
      cachedCitations = parsed;
      loadingPromise = null;
      return parsed;
    })
    .catch(() => {
      loadingPromise = null;
      cachedCitations = [];
      return [];
    });

  return loadingPromise;
};

// One citation as text: Authors (Year). "Title". Journal, volume(number), pages. Publisher.
// Plain React elements (no HTML strings), so a "<" or ">" in a title stays text.
export const CitationText: React.FC<{ cit: CitationEntry }> = ({ cit }) => {
  const authors = cit.Authors.replace(/;\s*$/, '');
  const source = cit.Publication && <>
    <i>{cit.Publication}</i>{cit.Volume && `, ${cit.Volume}`}{cit.Number && `(${cit.Number})`}{cit.Pages && `, ${cit.Pages}`}.{' '}
  </>;
  return <>
    {authors}{cit.Year && ` (${cit.Year})`}. &ldquo;{cit.Title}&rdquo;. {source}{cit.Publisher && `${cit.Publisher}.`}
  </>;
};

const Citation: React.FC = () => {
  const [all, setAll] = useState<CitationEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCitations().then(data => {
      setAll(data);
      setIsLoading(false);
    });
  }, []);

  // the carousel shows the selected few; the rest are on the Citations page
  const selected = all.filter(c => c.Selected === 'yes');
  const citations = selected.length ? selected : all;

  useEffect(() => {
    if (citations.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % citations.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [citations.length]);

  if (isLoading || citations.length === 0) return null;

  const shown = currentIndex % citations.length;
  const total = citations.length;
  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + total) % total);
  const goNext = () => setCurrentIndex((prev) => (prev + 1) % total);

  return (
    <div className="citation-carousel">
      <h5>Research Using ProtVar</h5>
      <div className="carousel-content">
        {/* every citation in the same grid cell, only the current one visible: the box is as tall as the longest,
            so the controls and the page below don't jump as they rotate */}
        <div className="carousel-stack" aria-live="polite">
          {citations.map((c, i) => {
            const text = <p className="carousel-citation-text"><CitationText cit={c} /></p>;
            return (
              <div key={c.Title} className={`carousel-slide${i === shown ? ' current' : ''}`} aria-hidden={i !== shown}>
                {c.URL
                  ? <a href={c.URL} target="_blank" rel="noreferrer" className="carousel-citation-link"
                       tabIndex={i === shown ? undefined : -1}>{text}</a>
                  : text}
              </div>
            );
          })}
        </div>
        <div className="carousel-controls">
          <button
            type="button"
            className="carousel-nav"
            onClick={goPrev}
            disabled={total < 2}
            aria-label="Previous citation"
          >
            <Icon name="chevron-left" />
          </button>
          <span className="carousel-counter">{shown + 1} / {total}</span>
          <button
            type="button"
            className="carousel-nav"
            onClick={goNext}
            disabled={total < 2}
            aria-label="Next citation"
          >
            <Icon name="chevron-right" />
          </button>
          <Link to={CITATIONS} className="carousel-all">All {all.length} citations <ArrowRight size={13} aria-hidden="true" /></Link>
        </div>
      </div>
    </div>
  );
};

export default Citation;
