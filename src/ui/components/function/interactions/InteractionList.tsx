/**
 * List component for protein-protein interactions
 */

import React, { Fragment } from 'react';
import { Interaction } from '../../../../types/Prediction';
import { ReactComponent as ChevronDownIcon } from '../../../../images/chevron-down.svg';
import { InteractionCard } from './InteractionCard';
import { EmptyState } from '../common/EmptyState';

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

  return (
    <Fragment key={SECTION_KEY}>
      <button
        type="button"
        className="collapsible"
        onClick={() => onToggle(SECTION_KEY)}
      >
        Protein-protein interfaces containing variant
        <ChevronDownIcon className="chevronicon" />
      </button>

      {expandedSection === SECTION_KEY && (
        <div className="struct-pred">
          <p>
            Proteins which are predicted to interact with {accession} where the variant is at the interface:
          </p>

          <div className="interaction-grid">
            <div>Protein</div>
            <div>pDockQ</div>
            <div></div>
          </div>

          {interactions.map((interaction, index) => (
            <InteractionCard
              key={`interaction-${index + 1}`}
              interaction={interaction}
              currentAccession={accession}
              index={index}
              onViewInStructure={onViewInStructure}
            />
          ))}

          <p>
            Click on <i className="bi bi-eye" /> to visualise interacting structure in the 3D structure tab.
          </p>
        </div>
      )}
    </Fragment>
  );
}