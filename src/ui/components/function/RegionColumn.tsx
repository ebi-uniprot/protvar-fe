/**
 * Right column - Region-level annotations
 * Displays features spanning ranges, pockets, and protein interactions
 */

import React from 'react';
import {Feature} from "../../../types/FunctionalInfo";
import {Interaction, Pocket} from "../../../types/Prediction";
import {EmptyState} from "./common/EmptyState";
import {FeatureList} from "./features/FeatureList";
import { HelpButton } from "../help/HelpButton";
import { HelpContent } from "../help/HelpContent";
import {PocketList} from "./pockets/PocketList";
import {InteractionList} from "./interactions/InteractionList";


interface RegionColumnProps {
  regions: Feature[];
  accession: string;
  pockets: Pocket[];
  interactions: Interaction[];
  expandedSections: Set<string>;
  onToggleSection: (key: string) => void;
  onViewPocket: (pocket: Pocket) => void;
  onViewInteraction: (interaction: Interaction) => void;
}

export function RegionColumn(props: RegionColumnProps) {
  return (
    <div className="region-annotations">
      <div className="column-header">Region Containing Variant Position</div>

      <div className="section-title">
        <span>
          UniProt Annotations
          {props.regions.length > 0 && (
            <span className="count-badge" style={{ marginLeft: 6 }}>{props.regions.length}</span>
          )}
        </span>
        <HelpButton variant="inline" title="" content={<HelpContent name="feature-ranking" />} />
      </div>

      {props.regions.length === 0 ? (
        <EmptyState message="No functional data for the region" />
      ) : (
        <FeatureList
          features={props.regions}
          expandedSections={props.expandedSections}
          onToggle={props.onToggleSection}
          keyPrefix="region"
        />
      )}

      <div className="section-title">
        <span>Structure Predictions</span>
        <HelpButton variant="inline" title="" content={<HelpContent name="predictions" />} />
      </div>

      <PocketList
        pockets={props.pockets}
        expandedSections={props.expandedSections}
        onToggle={props.onToggleSection}
        onViewInStructure={props.onViewPocket}
      />

      <InteractionList
        interactions={props.interactions}
        accession={props.accession}
        expandedSections={props.expandedSections}
        onToggle={props.onToggleSection}
        onViewInStructure={props.onViewInteraction}
      />
    </div>
  );
}