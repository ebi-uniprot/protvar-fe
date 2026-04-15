/**
 * List component for protein-protein interactions
 */

import React from 'react';
import { Interaction } from '../../../../types/Prediction';
import { InteractionCard } from './InteractionCard';
import { EmptyState } from '../common/EmptyState';
import { ExpandableList } from '../../common/ExpandableList';

interface InteractionListProps {
  interactions: Interaction[];
  accession: string;
  expandedSection: string;
  onToggle: (key: string) => void;
  onViewInStructure: (interaction: Interaction) => void;
}

const SECTION_KEY = 'interfaces-0';

export function InteractionList({
                                  interactions,
                                  accession,
                                  expandedSection,
                                  onToggle,
                                  onViewInStructure
                                }: InteractionListProps) {
  if (!interactions || interactions.length === 0) {
    return <EmptyState message="No P-P interaction predicted at variant position" />;
  }

  const isExpanded = expandedSection === SECTION_KEY;

  return (
    <div className="struct-pred-section">
      <button
        type="button"
        className="collapsible"
        onClick={() => onToggle(SECTION_KEY)}
        aria-expanded={isExpanded}
      >
        <i className={`bi bi-chevron-${isExpanded ? 'down' : 'right'} chevron-icon`}></i>
        <span>Protein-protein interfaces containing variant <span className="count-badge">{interactions.length}</span></span>
      </button>

      {isExpanded && (
        <div className="struct-pred-content">
          <p className="struct-pred-description">
            Proteins which are predicted to interact with {accession} where the variant is at the interface:
          </p>

          <div className="interaction-header">
            <div>Protein</div>
            <div>pDockQ</div>
            <div></div>
          </div>

          <ExpandableList
            items={interactions}
            renderItem={(interaction, index) => (
              <InteractionCard
                key={`interaction-${index + 1}`}
                interaction={interaction}
                currentAccession={accession}
                index={index}
                onViewInStructure={onViewInStructure}
              />
            )}
          />

          <p className="struct-pred-help">
            Click on <i className="bi bi-eye" /> to visualise interacting structure in the 3D structure tab.
          </p>
        </div>
      )}
    </div>
  );
}