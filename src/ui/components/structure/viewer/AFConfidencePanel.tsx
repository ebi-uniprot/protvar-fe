import React from "react";
import {HelpButton} from "../../help/HelpButton";
import {AlphaFoldHelp} from "../../help/content/PredictionsHelp";

interface AFConfidencePanelProps {
  isOpen: boolean;
  paeImageUrl: string;
  onClose: () => void;
}

export const AFConfidencePanel: React.FC<AFConfidencePanelProps> = ({ isOpen, paeImageUrl, onClose }) => {
  return (
    <div className={`pae-panel ${isOpen ? 'open' : ''}`}>
      <button className="pae-panel-close" onClick={onClose} title="Close">×</button>
      <div className="pae-panel-content">
        {/* Model Confidence Legend */}
        <div className="pae-section">
          <div className="pae-section-title">Model Confidence</div>
          <div className="confidence-legend">
            <div className="confidence-item">
              <div className="af-conf very-high"></div>
              <span className="confidence-label">Very high (&gt; 90)</span>
            </div>
            <div className="confidence-item">
              <div className="af-conf high"></div>
              <span className="confidence-label">Confident (90–70)</span>
            </div>
            <div className="confidence-item">
              <div className="af-conf low"></div>
              <span className="confidence-label">Low (70–50)</span>
            </div>
            <div className="confidence-item">
              <div className="af-conf very-low"></div>
              <span className="confidence-label">Very low (&lt; 50)</span>
            </div>
          </div>
        </div>

        {/* PAE Image */}
        <div className="pae-section">
          <div className="pae-section-title">
            Predicted Aligned Error <HelpButton variant="inline" title="AlphaFold help" content={<AlphaFoldHelp />} />
          </div>
          <div className="pae-image-container">
            <div className="pae-y-axis">Aligned residue</div>
            <div className="pae-image-wrap">
              <img src={paeImageUrl} alt="Predicted Aligned Error" />
              <div className="pae-x-axis">Scored residue</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
