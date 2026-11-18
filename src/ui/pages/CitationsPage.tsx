import React, { useEffect, useState } from 'react';
import DefaultPageLayout from '../layout/DefaultPageLayout';
import { CitationEntry, CitationText, loadCitations } from '../layout/Footer/Citation';

// Research using ProtVar: every citation, newest first, grouped by year (the footer carousel shows a selection)
const CitationsContent: React.FC = () => {
  const [citations, setCitations] = useState<CitationEntry[] | null>(null);

  useEffect(() => { loadCitations().then(setCitations); }, []);

  const years = citations ? Array.from(new Set(citations.map(c => c.Year || 0))) : [];

  return (
    <div className="container citations-page">
      <div className="page-header-row">
        <h5 className="page-header">Research using ProtVar</h5>
        {citations && <span className="page-header-count page-header-count--inline">{citations.length} citations</span>}
      </div>
      <p className="citations-intro">
        Publications that use or cite ProtVar. Missing one? Tell us at{' '}
        <a href="mailto:protvar@ebi.ac.uk">protvar@ebi.ac.uk</a>.
      </p>
      {citations === null && <p className="citations-intro">Loading…</p>}
      {years.map(year => (
        <section key={year} className="citations-year">
          <h6>{year || 'Year not given'}</h6>
          <ol>
            {citations!.filter(c => (c.Year || 0) === year).map(c => (
              <li key={c.Title}>
                {c.URL
                  ? <a href={c.URL} target="_blank" rel="noopener noreferrer"><CitationText cit={c} /></a>
                  : <CitationText cit={c} />}
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
};

const CitationsPage: React.FC = () => <DefaultPageLayout content={<CitationsContent />} />;

export default CitationsPage;
