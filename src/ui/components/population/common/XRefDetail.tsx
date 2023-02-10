//import { ClinicalSignificance, PopulationFrequency, Xref } from "../PopulationDetail";
import { v1 as uuidv1 } from 'uuid';
import XReferenceLi from "./XReferenceLi";
import {ClinicalSignificance, PopulationFrequency, Xref} from "../../../../types/PopulationObservationResponse";

interface XRefDetailProps {
  xrefs: Array<Xref>,
  populationFrequencies: Array<PopulationFrequency>,
  clinicalSignificances: Array<ClinicalSignificance>
}
function XRefDetail(props: XRefDetailProps) {
  const { xrefs, populationFrequencies, clinicalSignificances } = props;
  if (!xrefs || xrefs.length <= 0) {
    return <></>
  }

  return (
    <li key={uuidv1()}>
      <b>Identifiers</b>

      {getReferences(xrefs, populationFrequencies, clinicalSignificances)}
    </li>
  );
}

function getReferences(xrefs: Array<Xref>, populationFrequencies: Array<PopulationFrequency>, clinicalSignificances: Array<ClinicalSignificance>) {
  const popFreqMap = new Map<string, JSX.Element>();
  if (populationFrequencies !== undefined && populationFrequencies.length > 0) {
    populationFrequencies.forEach((freq) => {
      let val = (
        <li key={uuidv1()}>
          <b>{freq.populationName}</b>-{freq.frequency}
        </li>
      );
      popFreqMap.set(freq.sourceName, val);
    });
  }

  const significanceMap = new Map<string, JSX.Element>();
  if (clinicalSignificances !== undefined && clinicalSignificances.length > 0) {
    clinicalSignificances.forEach((significance) => {
      let type = (
        <li key={uuidv1()}>
          <b>{significance.type}</b>
        </li>
      );
      significance.sources.forEach((source) => {
        significanceMap.set(source, type);
      });
    });
  }
  let xrefList: Array<JSX.Element> = [];
  if (xrefs !== undefined && xrefs.length > 0) {
    const xrefMap = new Map<string, Array<JSX.Element>>();
    xrefs.forEach((xref) => {
      if (!xrefMap.get(xref.name)) {
        xrefMap.set(xref.name, [])
      }
      xrefMap.get(xref.name)!.push(<XReferenceLi id={xref.id} url={xref.url} key={uuidv1()}/>);
    });

    xrefMap.forEach((xRefIdsLis, xrefName) => {
      const populationFreq = popFreqMap.get(xrefName);
      const significance = significanceMap.get(xrefName);
      xrefList.push(getReferenceForEachSource(xrefName, xRefIdsLis, populationFreq, significance));
    })
  }
  return <ul>{xrefList}</ul>;
}

function getReferenceForEachSource(sourceName: string, xRefIdsLis: Array<JSX.Element>,
  populationFreq: JSX.Element | undefined, significance: JSX.Element | undefined) {
  return (
    <li key={uuidv1()}>
      <b>{sourceName} :</b>
      <ul className="flatList">
        {xRefIdsLis}
        {populationFreq}
        {significance}
      </ul>
    </li>
  );
}
export default XRefDetail;