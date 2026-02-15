import React from "react";
import {FunctionalInfo} from "../../../../types/FunctionalInfo";
import {aminoAcid3to1Letter} from "../../../../utills/Util";
import {SharePredictionLink} from "./SharePredictionLink";
import Spaces from "../../../elements/Spaces";
import {STD_BENIGN_COLOR, STD_PATHOGENIC_COLOR} from "./PredConstants";

const M3D_BASE_URL = 'https://missense3d.bc.ic.ac.uk/~missense3d2/results-details.html';

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

  const predText = functionalData.m3dPred.prediction.toLowerCase();
  const predColor = predText === 'damaging' ? STD_PATHOGENIC_COLOR : STD_BENIGN_COLOR;
  const formattedText = functionalData.m3dPred.damagingFeature?.split('|')
    .map(str => str.trim().replace(/_/g, ' '))
    .join(', ');

  const maxLength = 30;
  const isTruncated = formattedText.length > maxLength;
  const displayText = isTruncated ? `${formattedText.slice(0, maxLength)}...` : formattedText;
  const m3dUrl = `${M3D_BASE_URL}?uniprot_id=${functionalData.accession}&var_id=${variantId}`;

  return (
    <div className="aa-pred">
      <div><SharePredictionLink predictionType="m3d" /> Missense3D</div>
      <div></div>
      <div>
        <i className="bi bi-circle-fill" style={{color: predColor}}></i>
        <Spaces/>{predText}
        <a
          href={m3dUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="View in Missense3D"
          aria-label="View in Missense3D"
          className="ext-pred-link-inline"
        >
          <i className="bi bi-box-arrow-up-right"></i>
        </a>
        {displayText !== '-' && (
          <div title={isTruncated ? formattedText : undefined}>
            {displayText}
          </div>
        )}
      </div>
    </div>
  );
};