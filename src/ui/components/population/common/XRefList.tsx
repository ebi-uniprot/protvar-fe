import React from 'react';
import {ClinicalSignificance, PopulationFrequency} from "../../../../types/PopulationObservation";
import {DbReferenceObject} from "../../../../types/Common";
import {ExtLink, PVLink} from "../../common/Link";
import {ExpandableList} from "../../common/ExpandableList";
import { getSourceRank } from "../../common/sourceRanking";

const XREF_SHOW_LIMIT = 5;
const PV_SEARCH = '/ProtVar/query?search=';
const CLINVAR_PREFIXES = ['VCV', 'RCV'];
const COSMIC_PREFIXES = ['COSV', 'COSM', 'COSN'];

const isRsId = (id: string): boolean => /^rs\d+$/i.test(id);

const isUuid = (id: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

// NCI-TCGA xrefs carry a bare case UUID with no url that resolves nowhere public —
// drop them from the id list (keep the source summary + count) rather than show junk ids.
const isDisplayableXref = (xref: DbReferenceObject): boolean =>
  Boolean(xref.url) || !isUuid(xref.id);

const isClinVarId = (id: string): boolean =>
  CLINVAR_PREFIXES.some(prefix => id.toUpperCase().startsWith(prefix));

const isCosmicId = (id: string): boolean =>
  COSMIC_PREFIXES.some(prefix => id.toUpperCase().startsWith(prefix));

const shouldShowProtVarLink = (id: string, source: string): boolean => {
  const sourceLower = source.toLowerCase();
  if (sourceLower.includes('clinvar')) return isClinVarId(id);
  if (sourceLower.includes('cosmic')) return isCosmicId(id);
  if (sourceLower.includes('dbsnp') || sourceLower.includes('gnomad')) return isRsId(id);
  return isRsId(id);
};

const buildProtVarUrl = (id: string): string => `${PV_SEARCH}${id}`;

interface XRefListProps {
  xrefs?: DbReferenceObject[];
  populationFrequencies?: PopulationFrequency[];
  clinicalSignificances?: ClinicalSignificance[];
}

function XRefList({xrefs, populationFrequencies, clinicalSignificances}: XRefListProps) {
  if (!xrefs || xrefs.length === 0) return null;

  const groupedXrefs = xrefs.reduce((acc, xref) => {
    if (!acc[xref.name]) acc[xref.name] = [];
    acc[xref.name].push(xref);
    return acc;
  }, {} as Record<string, DbReferenceObject[]>);

  const sortedGroups = Object.entries(groupedXrefs).sort(
    ([a], [b]) => getSourceRank(a) - getSourceRank(b)
  );

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
      <div className="section-title">Cross References</div>
      <div className="xref-groups">
        {sortedGroups.map(([source, sourceXrefs]) => {
          const significance = significanceMap.get(source);
          const popFreq = popFreqMap.get(source);
          const displayXrefs = sourceXrefs.filter(isDisplayableXref);

          return (
            <div key={source} className="xref-source-group">
              <div className="xref-source-meta">
                <span className="xref-source-name">{source}</span>
                {sourceXrefs.length > 1 && (
                  <span className="count-badge">{sourceXrefs.length}</span>
                )}
                {significance && (
                  <span className="xref-significance">{significance.type.toLowerCase()}</span>
                )}
                {popFreq && (
                  <span className="xref-pop-freq-inline">
                    {popFreq.populationName}: {popFreq.frequency.toExponential(2)}
                  </span>
                )}
              </div>
              {displayXrefs.length > 0 && (
                <ExpandableList
                  items={displayXrefs}
                  defaultCount={XREF_SHOW_LIMIT}
                  className="id-list"
                  renderItem={(xref, idx) => (
                    <span key={idx} className="id-chip">
                      {xref.url
                        ? <ExtLink url={xref.url} text={xref.id} />
                        : <span className="id-plain">{xref.id}</span>}
                      {shouldShowProtVarLink(xref.id, source) &&
                        <PVLink url={buildProtVarUrl(xref.id)} />
                      }
                    </span>
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default XRefList;
