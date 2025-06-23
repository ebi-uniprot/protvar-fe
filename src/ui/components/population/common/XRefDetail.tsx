import {v1 as uuidv1} from 'uuid';
import {ClinicalSignificance, PopulationFrequency} from "../../../../types/PopulationObservation";
import React from "react";
import {DbReferenceObject} from "../../../../types/Common";

interface XRefDetailProps {
  xrefs: DbReferenceObject[];
  populationFrequencies: PopulationFrequency[];
  clinicalSignificances: ClinicalSignificance[];
}

function XRefDetail({xrefs, populationFrequencies, clinicalSignificances}: XRefDetailProps) {
  if (!xrefs?.length) return null;

  const popFreqMap = new Map<string, PopulationFrequency>(
    (populationFrequencies || []).map(freq => [freq.sourceName, freq])
  );  //<li key={uuidv1()}><b>{freq.populationName}</b>-{freq.frequency}</li>

  const significanceMap = new Map<string, ClinicalSignificance>(
    (clinicalSignificances || []).flatMap(significance =>
      (significance.sources || []).map(source => [source, significance])
    )
  ); // <li key={uuidv1()}><b>{significance.type}</b></li>

  const xrefGroups = new Map<string, React.JSX.Element[]>();
  xrefs.forEach(({name, id, url}) => {
    if (!xrefGroups.has(name)) xrefGroups.set(name, []);
    xrefGroups.get(name)!.push(<XReferenceItem key={uuidv1()} id={id} url={url}/>);
  });

  return (
    <li key={uuidv1()}>
      <b>Cross-References</b>
      <ul>
        {Array.from(xrefGroups.entries()).map(([sourceName, xRefIds]) => (
          <li key={uuidv1()}>
            <b>{sourceName}</b>
            <ul className="flatList">
              {xRefIds}
              {significanceMap.get(sourceName) && <span className="badge">{significanceMap.get(sourceName)?.type.toLowerCase()}</span>}
            </ul>
            {popFreqMap.get(sourceName) &&
              <><b>{popFreqMap.get(sourceName)?.populationName}</b> - {popFreqMap.get(sourceName)?.frequency}</>}
          </li>
        ))}
      </ul>
    </li>
  );
}

function XReferenceItem({id, url}: { id: string; url: string }) {
  return (<li>
      <a href={url} target="_blank" rel="noreferrer" className="ext-link">
        {id}
      </a>
    </li>
  );
}

export default XRefDetail;