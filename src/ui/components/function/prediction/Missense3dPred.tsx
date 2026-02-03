import {M3dPred} from "../../../../types/MappingResponse";
import React from "react";

const M3D_BASE_URL = "https://missense3d.bc.ic.ac.uk/~missense3d2/results-details.html";

interface Missense3dPredProps {
  m3dPred?: M3dPred
  accession: string
  variantId: string
}

export const Missense3dPred = (props: Missense3dPredProps) => {
  if (!props.m3dPred) return null;

  const predColor = props.m3dPred.prediction === "Damaging" ? "red" : "blue";
  const formattedText = props.m3dPred.damagingFeature?.split('|')
    .map(str => str.trim().replace(/_/g, ' '))
    .join(', ');

  const maxLength = 30;
  const isTruncated = formattedText.length > maxLength;
  const displayText = isTruncated ? `${formattedText.slice(0, maxLength)}...` : formattedText;
  const m3dUrl = `${M3D_BASE_URL}?uniprot_id=${props.accession}&var_id=${props.variantId}`;

  return (
    <div className="aa-pred">
      <div>Missense3D prediction <a href={m3dUrl} target="_blank" rel="noreferrer" className="ext-link"></a></div>
      <div style={{color: predColor}}>{props.m3dPred.prediction}</div>
      <div title={isTruncated ? formattedText : undefined}>
        {displayText}
      </div>
    </div>
  );
};