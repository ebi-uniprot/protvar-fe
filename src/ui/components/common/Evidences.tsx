import React, { Fragment, useMemo } from "react";
import { Evidence } from "../../../types/Common";
import PubMedList from "./PubMedList";
import {ExtLink} from "./Link";
import { getSourceRank } from "./sourceRanking";

export interface IdUrl {
  id: string;
  sourceUrl: string;
}

interface EvidencesProps {
  evidences: Array<Evidence>;
}

const Evidences = ({ evidences }: EvidencesProps) => {
  // Group evidences by source name, sorted by clinical authority rank
  const evidencesBySource = useMemo(() => {
    const grouped = new Map<string, IdUrl[]>();

    evidences?.forEach((evidence) => {
      if (evidence.source?.id) {
        const sourceName = evidence.source.name;
        const idUrl: IdUrl = {
          id: evidence.source.id,
          sourceUrl: evidence.source.url || ''
        };

        if (!grouped.has(sourceName)) {
          grouped.set(sourceName, []);
        }
        grouped.get(sourceName)!.push(idUrl);
      }
    });

    // Sort entries by rank
    const sorted: [string, IdUrl[]][] = Array.from(grouped.entries()).sort(
      ([a], [b]) => getSourceRank(a) - getSourceRank(b)
    );
    return new Map<string, IdUrl[]>(sorted);
  }, [evidences]);

  if (!evidences || evidences.length === 0) {
    return null;
  }

  return (
    <div className="evidences-container">
      {Array.from(evidencesBySource.entries()).map(([sourceName, ids]) => (
        <Fragment key={sourceName}>
          <span className="source-label">
            {sourceName.toLowerCase() === 'pubmed' ? 'PubMed' : sourceName}
          </span>
          {sourceName.toLowerCase() === 'pubmed' ? (
            <PubMedList ids={ids} />
          ) : (
            <div className="id-list">
              {ids.map((evidence) => (
                <span key={evidence.id} className="id-chip">
                  <ExtLink url={evidence.sourceUrl} text={evidence.id} />
                </span>
              ))}
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default Evidences;