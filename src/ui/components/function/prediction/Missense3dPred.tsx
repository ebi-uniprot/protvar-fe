import React from "react";
import {FunctionalInfo} from "../../../../types/FunctionalInfo";
import {aminoAcid3to1Letter} from "../../../../utills/Util";
import {SharePredictionLink} from "./SharePredictionLink";

const M3D_BASE_URL = "https://missense3d.bc.ic.ac.uk/~missense3d2/results-details.html";

interface Missense3dPredProps {
  functionalData: FunctionalInfo
  refAA: string
  variantAA: string
}

export const Missense3dPred = ({functionalData, refAA, variantAA}: Missense3dPredProps) => {
  if (!functionalData.m3dPred) return null;

  const variantId = functionalData.m3dPred && refAA && variantAA
    ? `${aminoAcid3to1Letter(refAA)?.toUpperCase()}${functionalData.position}${aminoAcid3to1Letter(variantAA)?.toUpperCase()}`
    : '';

  const predColor = functionalData.m3dPred.prediction === "Damaging" ? "red" : "blue";
  const formattedText = functionalData.m3dPred.damagingFeature?.split('|')
    .map(str => str.trim().replace(/_/g, ' '))
    .join(', ');

  const maxLength = 30;
  const isTruncated = formattedText.length > maxLength;
  const displayText = isTruncated ? `${formattedText.slice(0, maxLength)}...` : formattedText;
  const m3dUrl = `${M3D_BASE_URL}?uniprot_id=${functionalData.accession}&var_id=${variantId}`;

  return (
    <div className="aa-pred">
      <div>Missense3D prediction
        <SharePredictionLink predictionType="m3d" />
        <a href={m3dUrl} target="_blank" rel="noreferrer" className="ext-link" aria-label="View in Missense3D (opens in new tab)"></a>
      </div>
      <div style={{color: predColor}}>{functionalData.m3dPred.prediction}</div>
      <div title={isTruncated ? formattedText : undefined}>
        {displayText}
      </div>
    </div>
  );
};