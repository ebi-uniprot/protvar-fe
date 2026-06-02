/**
 * Two-row pocket entry: key metrics + supplementary detail below
 */

import React, { useState } from 'react';
import { Pocket } from '../../../../types/Prediction';
import { formatRange } from '../../../../utills/Util';
import { getPocketConfidence, getModelConfidence, ConfidenceBadge } from '../utils/confidenceUtils';
import structureIcon from '../../../../images/structures-3d.svg';

interface PocketCardProps {
  pocket: Pocket;
  onViewInStructure: (pocket: Pocket) => void;
}

// Pocket residue lists run long (often 30+ positions). Show the count by
// default with an inline chevron to reveal the full formatRange'd list.
function PocketResidues({ resid }: { resid: number[] }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      {resid.length}
      <button
        type="button"
        className="pocket-residues-toggle"
        onClick={() => setExpanded(e => !e)}
        title={expanded ? 'Hide residues' : 'Show residues'}
      >
        <i className={`bi ${expanded ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
      </button>
      {expanded && <span className="pocket-residues-list">{formatRange(resid)}</span>}
    </>
  );
}

export function PocketCard({ pocket, onViewInStructure }: PocketCardProps) {
  const pocketConf = getPocketConfidence(pocket.score);
  const modelConf  = getModelConfidence(pocket.meanPlddt);

  return (
    <div className="pocket-entry">
      {/* Row 1 — identity + key metrics (grid aligned to .pocket-list-col-header) */}
      <div className="pocket-row">
        <button
          onClick={() => onViewInStructure(pocket)}
          className="view-structure-button pocket-id-btn"
          title="View in 3D structure tab"
        >
          <img src={structureIcon} alt="" className="structure-icon-sm" />
          <span>P{pocket.pocketId}</span>
        </button>
        <span className="pocket-metric">
          <span className="pocket-score">{pocket.score.toFixed(0)}</span>
          <ConfidenceBadge level={pocketConf} compact />
        </span>
        <span className="pocket-metric">
          <span className="pocket-score">{pocket.meanPlddt.toFixed(0)}</span>
          <ConfidenceBadge level={modelConf} compact />
        </span>
      </div>

      {/* Row 2 — supplementary metrics */}
      <div className="pocket-details">
        <span><span className="pocket-detail-label">Energy/vol</span>{pocket.energyPerVol.toFixed(2)} kcal/mol</span>
        <span><span className="pocket-detail-label">Buriedness</span>{pocket.buriedness.toFixed(2)}</span>
        <span><span className="pocket-detail-label">Gyration</span>{pocket.radGyration.toFixed(2)} Å</span>
        <span><span className="pocket-detail-label">Residues</span><PocketResidues resid={pocket.resid} /></span>
      </div>
    </div>
  );
}
