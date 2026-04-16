/**
 * List component for protein-protein interactions
 */

import React from 'react';
import { Interaction } from '../../../../types/Prediction';
import { InteractionCard } from './InteractionCard';
import { EmptyState } from '../common/EmptyState';
import { ExpandableList } from '../../common/ExpandableList';
import structureIcon from '../../../../images/structures-3d.svg';

interface InteractionListProps {
  interactions: Interaction[];
  accession: string;
  expandedSections: Set<string>;
  onToggle: (key: string) => void;
  onViewInStructure: (interaction: Interaction) => void;
}

const SECTION_KEY = 'interfaces-0';

export function InteractionList({ interactions, accession, expandedSections, onToggle, onViewInStructure }: InteractionListProps) {
  if (!interactions || interactions.length === 0) {
    return <EmptyState message="No P-P interaction predicted at variant position" />;
  }

  const isExpanded = expandedSections.has(SECTION_KEY);

  return (
    <div className="struct-pred-section">
      <button
        type="button"
        className="collapsible"
        onClick={() => onToggle(SECTION_KEY)}
        aria-expanded={isExpanded}
      >
        <i className={`bi bi-chevron-${isExpanded ? 'down' : 'right'} chevron-icon`} />
        <span>Protein-protein interfaces containing variant <span className="count-badge">{interactions.length}</span></span>
      </button>

      {isExpanded && (
        <div className="struct-pred-content">
          <p className="struct-pred-description">
            Proteins predicted to interact with {accession} where the variant is at the interface:
          </p>

          <div className="structure-col-header interaction-col-header">
            <span>Partner</span>
            <span>pDockQ</span>
            <span>Confidence</span>
          </div>

          <ExpandableList
            items={interactions}
            renderItem={(interaction, index) => (
              <InteractionCard
                key={`interaction-${index}`}
                interaction={interaction}
                currentAccession={accession}
                index={index}
                onViewInStructure={onViewInStructure}
              />
            )}
          />

          <p className="struct-pred-help">
            Click <img src={structureIcon} alt="3D structure" className="structure-icon-sm" /> to visualise the interacting structure in the structure tab.
          </p>
        </div>
      )}
    </div>
  );
}
