/**
 * Card component for displaying protein-protein interaction
 * Shows partner protein with confidence score and link to structure viewer
 */

import React from 'react';
import { Interaction } from '../../../../types/Prediction';
import { getInteractionConfidence, ConfidenceBadge } from '../utils/confidenceUtils';

interface InteractionCardProps {
  interaction: Interaction;
  currentAccession: string;
  index: number;
  onViewInStructure: (interaction: Interaction) => void;
}

export function InteractionCard({
                                  interaction,
                                  currentAccession,
                                  index,
                                  onViewInStructure
                                }: InteractionCardProps) {
  // Determine which protein is the interaction partner
  const partnerProtein = currentAccession === interaction.a
    ? interaction.b
    : interaction.a;

  const confidence = getInteractionConfidence(interaction.pdockq);

  return (
    <div key={`interaction-${index + 1}`} className="interaction-grid">
      {/* Partner protein with view link */}
      <div>
        <button
          onClick={() => onViewInStructure(interaction)}
          className="view-structure-button"
          title="View in 3D structure tab"
        >
          <i className="bi bi-eye" /> {partnerProtein}
        </button>
      </div>

      {/* pDockQ score */}
      <div className="pdockq-score">
        {interaction.pdockq.toFixed(3)}
      </div>

      {/* Confidence badge */}
      <div>
        <ConfidenceBadge level={confidence} />
      </div>
    </div>
  );
}