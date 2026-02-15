/**
 * Left column - Residue-level annotations
 * Displays features at single positions, amino acid model, and predictions
 */

import React, {useContext} from 'react';
import {Feature, FunctionalInfo} from "../../../types/FunctionalInfo";
import {AmScore, TranslatedSequence} from "../../../types/MappingResponse";
import {EmptyState} from "./common/EmptyState";
import {FeatureList} from "./features/FeatureList";
import AminoAcidModel from "./AminoAcidModel";
import {HelpButton} from "../help/HelpButton";
import {Prediction} from "./prediction/Prediction";
import {HelpContent} from "../help/HelpContent";
import {AppContext} from "../../App";


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
  const state = useContext(AppContext);

  const toggleStdColor = () => {
    state.updateState("stdColor", state.stdColor ? false : true);
  };

  return (
    <div className="residue-annotations">
      <div className="column-header">Variant Residue Position</div>

      <div className="section-title">UniProt Annotations</div>

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

      <div className="predictions-section">
        <div className="predictions-header">
          <span>Predictions</span>
          <HelpButton title="" content={<HelpContent name="predictions" />} />
        </div>

        {/* Color settings before predictions */}
        <div className="colour-toggle">
          <label title="Uncheck to use original source colours">
            <input type="checkbox" checked={state.stdColor} onChange={toggleStdColor} />
            <span>ProtVar standardised colours</span>
          </label>
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