/**
 * Compact row for a single protein-protein interaction entry
 */

import React from 'react';
import { Interaction } from '../../../../types/Prediction';
import { getInteractionConfidence, ConfidenceBadge } from '../utils/confidenceUtils';
import { Box } from 'lucide-react';

interface InteractionCardProps {
  interaction: Interaction;
  currentAccession: string;
  index: number;
  onViewInStructure: (interaction: Interaction) => void;
}

export function InteractionCard({ interaction, currentAccession, index, onViewInStructure }: InteractionCardProps) {
  const partnerProtein = currentAccession === interaction.a ? interaction.b : interaction.a;
  const confidence = getInteractionConfidence(interaction.pdockq);

  return (
    <div className="interaction-row">
      <span>
        <button
          onClick={() => onViewInStructure(interaction)}
          className="view-structure-button"
          title="View in 3D structure tab"
        >
          <Box size={14} strokeWidth={1.75} className="structure-icon-sm" aria-hidden="true" /> {partnerProtein}
        </button>
      </span>
      <span className="pdockq-score">{interaction.pdockq.toFixed(3)}</span>
      <span><ConfidenceBadge level={confidence} /></span>
    </div>
  );
}
