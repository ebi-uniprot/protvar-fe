import React, { Fragment, useMemo } from "react";
import { Evidence } from "../../../types/Common";
import PubMedList from "./PubMedList";

import {ExtLink} from "./Link";

export interface IdUrl {
  id: string;
  sourceUrl: string;
}

interface EvidencesProps {
  evidences: Array<Evidence>;
}

const Evidences = ({ evidences }: EvidencesProps) => {
  // Group evidences by source name
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

    return grouped;
  }, [evidences]);

  if (!evidences || evidences.length === 0) {
    return null;
  }

  return (
    <div className="evidences-container">
      {Array.from(evidencesBySource.entries()).map(([sourceName, ids]) => (
        <Fragment key={sourceName}>
          <b>{sourceName.toLowerCase() === 'pubmed' ? 'PubMed' : sourceName}</b>
          {sourceName.toLowerCase() === 'pubmed' ? (
            <PubMedList ids={ids} />
          ) : (
            <ul className="evidences-list">
              {ids.map((evidence) => (
                <li key={evidence.id}>
                  <ExtLink url={evidence.sourceUrl} text={evidence.id} />
                </li>
              ))}
            </ul>
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default Evidences;