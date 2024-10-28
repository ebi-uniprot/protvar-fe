import { Fragment } from "react"
import { v1 as uuidv1 } from 'uuid';
import {Evidence} from "../../../types/Common";

interface IdUrl {
  id: string
  sourceUrl: string
}

interface EvidencesProps {
  evidences: Array<Evidence>
}

const Evidences = (props: EvidencesProps) => {
  const { evidences } = props;
  let evidenceList: Array<IdUrl> = [];
  let evidenceMap = new Map();
  let evidenceListToRet: Array<JSX.Element> = [];

  if (evidences && evidences.length > 0) {
    evidences.forEach((evidence) => {
      if (evidence.source && evidence.source.id) {
        let url = evidence.source.url ? evidence.source.url : '';
        let newEvidence = {
          id: evidence.source.id,
          sourceUrl: url
        };
        if (evidenceMap.get(evidence.source.name)) {
          evidenceList = evidenceMap.get(evidence.source.name);
          evidenceList.push(newEvidence);
        } else {
          evidenceList = [];
          evidenceList.push(newEvidence);
        }
        evidenceMap.set(evidence.source.name, evidenceList);
      }
    });
    evidenceMap.forEach((value, key) => {
      let list = value.map(getEvidence);
      evidenceListToRet.push(getEvidenceForEachSource(key, list));
    })
  }

  return <>{evidenceListToRet}</>;
}

function getEvidenceForEachSource(sourceName: string, ids: Array<JSX.Element>) {
  return (
    <Fragment key={uuidv1()}>
      <b>{sourceName} :</b>
      <ul className="flatList">{ids}</ul>
    </Fragment>
  );
}

function getEvidence(evidence: IdUrl) {
  return (
    <li key={uuidv1()}>
      <a href={evidence.sourceUrl} target="_blank" rel="noopener noreferrer" className="ext-link">
        {evidence.id}
      </a>
    </li>
  );
}

export default Evidences;
