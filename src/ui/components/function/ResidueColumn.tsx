/**
 * Left column - Residue-level annotations
 * Displays features at single positions, amino acid model, and predictions
 */

import React from 'react';
import {Feature, FunctionalInfo} from "../../../types/FunctionalInfo";
import {AmScore, TranslatedSequence} from "../../../types/MappingResponse";
import {aminoAcid3to1Letter} from "../../../utills/Util";
import {EmptyState} from "./common/EmptyState";
import {FeatureList} from "./features/FeatureList";
import AminoAcidModel from "./AminoAcidModel";
import {Missense3dPred} from "./prediction/Missense3dPred";
import {HelpButton} from "../help/HelpButton";
import {Prediction} from "./prediction/Prediction";
import {HelpContent} from "../help/HelpContent";


interface ResidueColumnProps {
  residues: Feature[];
  functionalData: FunctionalInfo;
  refAA: string;
  variantAA: string;
  expandedSection: string;
  onToggleSection: (key: string) => void;
  ensg: string;
  ensp: TranslatedSequence[];
  caddScore: string;
  amScore: AmScore;
}

export function ResidueColumn(props: ResidueColumnProps) {
  const variantId = props.functionalData.m3dPred && props.refAA && props.variantAA
    ? `${aminoAcid3to1Letter(props.refAA)?.toUpperCase()}${props.functionalData.position}${aminoAcid3to1Letter(props.variantAA)?.toUpperCase()}`
    : '';

  return (
    <div className="residue-annotations">
      <b>Annotations from UniProt</b>

      {props.residues.length === 0 ? (
        <EmptyState message="No functional data for the variant position" />
      ) : (
        <FeatureList
          features={props.residues}
          expandedSection={props.expandedSection}
          onToggle={props.onToggleSection}
          keyPrefix="residue"
        />
      )}

      <AminoAcidModel refAA={props.refAA} variantAA={props.variantAA} />

      <Missense3dPred
        m3dPred={props.functionalData.m3dPred}
        accession={props.functionalData.accession}
        variantId={variantId}
      />

      <strong>
        <HelpButton title="Predictions" content={<HelpContent name="predictions" />} />
      </strong>

      <Prediction
        functionalData={props.functionalData}
        refAA={props.refAA}
        variantAA={props.variantAA}
        ensg={props.ensg}
        ensp={props.ensp}
        caddScore={props.caddScore}
        amScore={props.amScore}
      />
    </div>
  );
}