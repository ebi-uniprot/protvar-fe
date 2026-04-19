import React, { useState, useEffect } from 'react';

interface CitationEntry {
  Authors: string;
  Title: string;
  Publication: string;
  Volume?: string;
  Number?: string;
  Pages?: string;
  Year: number;
  Publisher?: string;
  URL?: string;
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

const loadCitations = (): Promise<CitationEntry[]> => {
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

const Citation: React.FC = () => {
  const [citations, setCitations] = useState<CitationEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCitations().then(data => {
      setCitations(data);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (citations.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % citations.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [citations.length]);

  if (isLoading || citations.length === 0) return null;

  const entry = citations[currentIndex];

  const formatCitation = (cit: CitationEntry): string => {
    const parts: string[] = [];
    if (cit.Authors) parts.push(cit.Authors);
    if (cit.Year) parts.push(`(${cit.Year})`);
    if (cit.Title) parts.push(`"${cit.Title}"`);

    let publicationInfo = '';
    if (cit.Publication) {
      publicationInfo = `<i>${cit.Publication}</i>`;
      if (cit.Volume) publicationInfo += `, ${cit.Volume}`;
      if (cit.Number) publicationInfo += `(${cit.Number})`;
      if (cit.Pages) publicationInfo += `, ${cit.Pages}`;
      parts.push(publicationInfo);
    }
    if (cit.Publisher) parts.push(cit.Publisher);
    return parts.join('. ') + '.';
  };

  const formattedText = formatCitation(entry);

  return (
    <div className="citation-carousel">
      <h5>Research Using ProtVar</h5>
      <div className="carousel-content">
        {entry.URL ? (
          <a href={entry.URL} target="_blank" rel="noreferrer" className="carousel-citation-link">
            <p className="carousel-citation-text" dangerouslySetInnerHTML={{ __html: formattedText }} />
          </a>
        ) : (
          <p className="carousel-citation-text" dangerouslySetInnerHTML={{ __html: formattedText }} />
        )}
        <div className="carousel-controls">
          <div className="carousel-dots">
            {citations.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`carousel-dot ${idx === currentIndex ? 'active' : ''}`}
                aria-label={`Go to citation ${idx + 1}`}
              />
            ))}
          </div>
          <span className="carousel-counter">{currentIndex + 1} / {citations.length}</span>
        </div>
      </div>
    </div>
  );
};

export default Citation;
