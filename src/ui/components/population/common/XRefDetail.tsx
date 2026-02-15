import React, { useState } from 'react';
import {ClinicalSignificance, PopulationFrequency} from "../../../../types/PopulationObservation";
import {DbReferenceObject} from "../../../../types/Common";
import {ProtVarLink} from "../../common/ProtVarLink";

const XREF_SHOW_LIMIT = 5;
const PV_SEARCH = '/ProtVar/query?search=';
const CLINVAR_PREFIXES = ['VCV', 'RCV'];
const COSMIC_PREFIXES = ['COSV', 'COSM', 'COSN'];

// Helper to check if ID is an rsID (dbSNP format)
const isRsId = (id: string): boolean => /^rs\d+$/i.test(id);

// Helper to check if ID is a ClinVar ID
const isClinVarId = (id: string): boolean =>
  CLINVAR_PREFIXES.some(prefix => id.toUpperCase().startsWith(prefix));

// Helper to check if ID is a COSMIC ID
const isCosmicId = (id: string): boolean =>
  COSMIC_PREFIXES.some(prefix => id.toUpperCase().startsWith(prefix));

// Helper to determine if ProtVar link should be shown for this source/ID combination
const shouldShowProtVarLink = (id: string, source: string): boolean => {
  const sourceLower = source.toLowerCase();

  // ClinVar: only show for VCV/RCV IDs
  if (sourceLower.includes('clinvar')) {
    return isClinVarId(id);
  }

  // COSMIC: only show for COSV/COSM/COSN IDs
  if (sourceLower.includes('cosmic')) {
    return isCosmicId(id);
  }

  // dbSNP/gnomAD: only show for rsIDs
  if (sourceLower.includes('dbsnp') || sourceLower.includes('gnomad')) {
    return isRsId(id);
  }

  // For other sources, show ProtVar link if is a rsID
  return isRsId(id);
};

// Helper to build ProtVar URL
const buildProtVarUrl = (id: string): string => {
  return `${PV_SEARCH}${id}`;
};

interface XRefDetailProps {
  xrefs?: DbReferenceObject[];
  populationFrequencies?: PopulationFrequency[];
  clinicalSignificances?: ClinicalSignificance[];
}

function XRefDetail({xrefs, populationFrequencies, clinicalSignificances}: XRefDetailProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  if (!xrefs || xrefs.length === 0) return null;

  // Group xrefs by source
  const groupedXrefs = xrefs.reduce((acc, xref) => {
    if (!acc[xref.name]) {
      acc[xref.name] = [];
    }
    acc[xref.name].push(xref);
    return acc;
  }, {} as Record<string, DbReferenceObject[]>);

  const toggleGroup = (source: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [source]: !prev[source]
    }));
  };

  const popFreqMap = new Map<string, PopulationFrequency>(
    (populationFrequencies || []).map(freq => [freq.sourceName, freq])
  );

  const significanceMap = new Map<string, ClinicalSignificance>(
    (clinicalSignificances || []).flatMap(significance =>
      (significance.sources || []).map(source => [source, significance])
    )
  );

  return (
    <div className="xref-section">
      <b>Cross-References</b>
      {Object.entries(groupedXrefs).map(([source, sourceXrefs]) => {
        const isExpanded = expandedGroups[source] || false;
        const hasMany = sourceXrefs.length > XREF_SHOW_LIMIT;

        const significance=significanceMap.get(source);
        const popFreq=popFreqMap.get(source);

        return (
          <div key={source} className="xref-source-group">
            {/* Source name with significance and frequency inline */}
            <div className="xref-source-header">
              <div className="xref-source-name">{source}</div>
              {/* Clinical Significance */}
              {significance && (
                <span className="xref-significance">
                  {significance.type.toLowerCase()}
                </span>
              )}

              {/* Population Frequency */}
              {popFreq && (
                <div className="xref-pop-freq">
                  {popFreq.populationName}: {popFreq.frequency.toExponential(2)}
                </div>
              )}
            </div>
            <ul className={`xref-list ${!isExpanded ? 'collapsed' : ''}`}>
              {sourceXrefs.map((xref, idx) => (
                <li key={idx}>
                  <a
                    href={xref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ext-link"
                  >
                    {xref.id}
                  </a>
                  {/* ProtVar Link - only show if ID format matches source */}
                  {shouldShowProtVarLink(xref.id, source) &&
                    <ProtVarLink url={buildProtVarUrl(xref.id)} />
                  }
                </li>
              ))}
            </ul>

            {/* Show more/less button */}
            {hasMany && (
              <button
                className="show-btn"
                onClick={() => toggleGroup(source)}
              >
                <i className={`bi bi-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                {isExpanded
                  ? 'Show less'
                  : `Show ${sourceXrefs.length - XREF_SHOW_LIMIT} more`
                }
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}/*
  return (
    <div className="xref-section">
      <b>Cross-References</b>
      <ul>
        {Array.from(xrefGroups.entries()).map(([sourceName, xRefList]) => {

          const [isExpanded, setIsExpanded] = useState(false);
          const hasMany = xRefList.length > XREF_SHOW_LIMIT;


          const significance=significanceMap.get(sourceName)
          const popFreq=popFreqMap.get(sourceName)

            return <li className="xref-source-group">
            <div className="xref-source-name">{sourceName}</div>
            <ul className={`xref-list ${!isExpanded && hasMany ? 'collapsed' : ''}`}>
              {xRefList.map((xref, index) => (
                <a href={xref.url} target="_blank" rel="noreferrer" className="ext-link">
                  {xref.id}
                </a>
              ))}
            </ul>

            {hasMany && (
              <button
                className="show-btn"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <i className={`bi bi-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                {isExpanded ? 'Show less' : `Show ${xRefList.length - XREF_SHOW_LIMIT} more`}
              </button>
            )}

            {significance && (
              <div className="xref-significance">
                {significance.type.toLowerCase()}
              </div>
            )}

            {popFreq && (
              <div className="xref-pop-freq">
                <b>{popFreq.populationName}</b> - {popFreq.frequency}
              </div>
            )}
          </li>
        })}
      </ul>
    </div>
  );
}
*/
export default XRefDetail;