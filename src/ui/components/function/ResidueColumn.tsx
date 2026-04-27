/**
 * Left column - Residue-level annotations
 * Displays features at single positions, amino acid model, and predictions
 */

import React from 'react';
import {Feature, FunctionalInfo} from "../../../types/FunctionalInfo";
import {AmScore, TranslatedSequence} from "../../../types/MappingResponse";
import {EmptyState} from "./common/EmptyState";
import {FeatureList} from "./features/FeatureList";
import AminoAcidModel from "./AminoAcidModel";
import {HelpButton} from "../help/HelpButton";
import {Prediction} from "./prediction/Prediction";
import {HelpContent} from "../help/HelpContent";


interface ResidueColumnProps {
  residues: Feature[];
  functionalData: FunctionalInfo;
  refAA: string;
  variantAA: string;
  expandedSections: Set<string>;
  onToggleSection: (key: string) => void;
  ensg: string;
  ensp: TranslatedSequence[];
  caddScore: string;
  amScore: AmScore;
}

export function ResidueColumn(props: ResidueColumnProps) {
  return (
    <div className="residue-annotations">
      <div className="column-header">Variant Residue Position</div>

      <div className="section-title">
        <span>
          UniProt Annotations
          {props.residues.length > 0 && (
            <span className="count-badge" style={{ marginLeft: 6 }}>{props.residues.length}</span>
          )}
        </span>
        <HelpButton variant="inline" title="" content={<HelpContent name="uniprot-feature-ranking" />} />
      </div>

      {props.residues.length === 0 ? (
        <EmptyState message="No functional data for the variant position" />
      ) : (
        <FeatureList
          features={props.residues}
          expandedSections={props.expandedSections}
          onToggle={props.onToggleSection}
          keyPrefix="residue"
        />
      )}

      <AminoAcidModel refAA={props.refAA} variantAA={props.variantAA} />

      <div className="predictions-section">
        <div className="section-title">
          <span>Predictions</span>
          <HelpButton variant="inline" title="" content={<HelpContent name="predictions" />} />
        </div>

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
    </div>
  );
}