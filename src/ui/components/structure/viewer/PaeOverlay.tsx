import React from "react";
import {HelpButton} from "../../help/HelpButton";
import {AlphaFoldHelp} from "../../help/content/PredictionsHelp";

interface PaeOverlayProps {
  paeImageUrl: string;
  onClose: () => void;
}

/**
 * AlphaFold Predicted Aligned Error, floating over the 3D viewer (opened from
 * the PAE toggle under it), so opening it never shifts the page.
 */
export const PaeOverlay: React.FC<PaeOverlayProps> = ({ paeImageUrl, onClose }) => (
  <div className="pae-overlay" role="dialog" aria-label="Predicted Aligned Error">
    <div className="pae-overlay-title">
      Predicted Aligned Error <HelpButton variant="inline" title="AlphaFold help" content={<AlphaFoldHelp />} />
      <button className="pae-overlay-close" onClick={onClose} title="Close" aria-label="Close">×</button>
    </div>
    <div className="pae-image-container">
      <div className="pae-y-axis">Aligned residue</div>
      <div className="pae-image-wrap">
        <img src={paeImageUrl} alt="Predicted Aligned Error" />
        <div className="pae-x-axis">Scored residue</div>
      </div>
    </div>
  </div>
);
