/**
 * Card component for displaying pocket information
 * Displays pocket metrics with confidence indicators and link to structure viewer
 */

import React from 'react';
import { Pocket } from '../../../../types/Prediction';
import { formatRange } from '../../../../utills/Util';
import {
  getPocketConfidence,
  getModelConfidence,
  ConfidenceBadge
} from '../utils/confidenceUtils';

interface PocketCardProps {
  pocket: Pocket;
  onViewInStructure: (pocket: Pocket) => void;
}

export function PocketCard({ pocket, onViewInStructure }: PocketCardProps) {
  const pocketConf = getPocketConfidence(pocket.score);
  const modelConf = getModelConfidence(pocket.meanPlddt);

  return (
    <div key={`pocket-${pocket.pocketId}`} className="pocket-card">
      <div className="pocket-grid">
        {/* Pocket ID with view link */}
        <label>Pocket</label>
        <div>
          <button
            onClick={() => onViewInStructure(pocket)}
            className="view-structure-button"
            title="View in 3D structure tab"
          >
            <i className="bi bi-eye"></i> P{pocket.pocketId}
          </button>
        </div>

        {/* Combined score */}
        <label>Combined score</label>
        <div>
          <span className="pocket-score">{pocket.score.toFixed(2)}</span>
          {' '}
          <ConfidenceBadge level={pocketConf} />
        </div>

        {/* Pocket pLDDT mean */}
        <label>Pocket pLDDT mean</label>
        <div>
          <span className="pocket-score">{pocket.meanPlddt.toFixed(2)}</span>
          {' '}
          <ConfidenceBadge level={modelConf} />
        </div>

        {/* Energy per volume */}
        <label>Energy per volume</label>
        <div>{pocket.energyPerVol.toFixed(2)} kcal/mol</div>

        {/* Buriedness */}
        <label>Buriedness</label>
        <div>{pocket.buriedness.toFixed(2)}</div>

        {/* Radius of gyration */}
        <label>Radius of gyration</label>
        <div>{pocket.radGyration.toFixed(2)} Å</div>

        {/* Residues */}
        <label>Residues</label>
        <div>{formatRange(pocket.resid)}</div>
      </div>
    </div>
  );
}