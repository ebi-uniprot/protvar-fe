import React, { Fragment, useMemo } from "react";
import { Evidence } from "../../../types/Common";
import PubMedIdList from "./PubMedIdList";

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
    <>
      {Array.from(evidencesBySource.entries()).map(([sourceName, ids]) => (
        <Fragment key={sourceName}>
          <b>{sourceName} :</b>
          {sourceName === 'PubMed' ? (
            <PubMedIdList ids={ids} />
          ) : (
            <ul className="flatList">
              {ids.map((evidence) => (
                <li key={evidence.id}>
                  <a
                    href={evidence.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ext-link"
                  >
                    {evidence.id}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Fragment>
      ))}
    </>
  );
};

export default Evidences;