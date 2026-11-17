import React from "react";
import {ALPHAFOLD_CONF} from "../alphafoldConfidence";

export interface LegendItem {
  label: string;
  /** CSS background for the swatch (a colour or a gradient). */
  swatch: string;
}

interface ViewerLegendProps {
  items: LegendItem[];
}

/** The structure viewer's colour key: what each colour on screen means, on one line. */
export const ViewerLegend: React.FC<ViewerLegendProps> = ({ items }) => {
  if (items.length === 0) return null;
  return (
    <div className="viewer-legend" aria-label="Colour key">
      {items.map((item) => (
        <span key={item.label} className="viewer-legend-item">
          <span className="viewer-legend-swatch" style={{ background: item.swatch }} aria-hidden="true" />
          {item.label}
        </span>
      ))}
    </div>
  );
};

/**
 * AlphaFold pLDDT bands, floating at the bottom centre of the 3D view while
 * the model is painted by confidence.
 */
export const ConfidenceKey: React.FC = () => (
  <div className="pv-confidence-key" aria-label="AlphaFold per-residue model confidence">
    <span className="pv-confidence-key-label">Confidence (pLDDT)</span>
    {ALPHAFOLD_CONF.map((c) => (
      <span key={c.short} className="viewer-legend-item" title={c.text}>
        <span className="viewer-legend-swatch" style={{ background: c.color }} aria-hidden="true" />
        {c.short}
      </span>
    ))}
  </div>
);
