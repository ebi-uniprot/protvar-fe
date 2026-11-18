import React from "react";
import { Icon } from '../../../elements/Icon';

export interface ViewerOption {
  id: string;
  label: string;
  /** Tooltip, e.g. the full name behind a short label. */
  title?: string;
  onSelect: () => void;
}

/** A labelled set of mutually exclusive options, e.g. Show: Variant | Chain B | Chain D. */
export interface ViewerSegment {
  label: string;
  options: ViewerOption[];
  active: string;
}

/** An on/off extra next to zoom/reset, e.g. the PAE overlay. */
export interface ViewerToggle {
  label: string;
  icon: string;
  title: string;
  active: boolean;
  onToggle: () => void;
}

interface ViewerControlsProps {
  segments: ViewerSegment[];
  toggles?: ViewerToggle[];
  onZoom: () => void;
  onReset: () => void;
}

/**
 * Controls under the structure viewer: segmented groups for what is shown
 * (the active option is filled), and one-off actions (zoom, reset) on the right.
 */
export const ViewerControls: React.FC<ViewerControlsProps> = ({ segments, toggles = [], onZoom, onReset }) => (
  <div className="pv-viewer-controls">
    <div className="pv-viewer-segments">
      {segments.filter(s => s.options.length > 1).map((s) => (
        <div key={s.label} className="pv-viewer-segment" role="group" aria-label={s.label}>
          <span className="pv-viewer-segment-label">{s.label}</span>
          <div className="pv-segmented">
            {s.options.map((o) => (
              <button
                key={o.id}
                type="button"
                className={o.id === s.active ? "active" : ""}
                aria-pressed={o.id === s.active}
                title={o.title}
                onClick={o.onSelect}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
    <div className="pv-viewer-actions">
      {toggles.map((t) => (
        <button key={t.label} type="button" className={`pv-viewer-action${t.active ? " active" : ""}`}
                aria-pressed={t.active} onClick={t.onToggle} title={t.title}>
          <Icon name={t.icon} /> {t.label}
        </button>
      ))}
      <button type="button" className="pv-viewer-action icon-only" onClick={onZoom}
              title="Zoom to what is shown: the variant, chain, pocket or interface" aria-label="Zoom">
        <Icon name="zoom-in" aria-hidden="true" />
      </button>
      <button type="button" className="pv-viewer-action icon-only" onClick={onReset}
              title="Reset the view and highlight" aria-label="Reset">
        <Icon name="arrow-counterclockwise" aria-hidden="true" />
      </button>
    </div>
  </div>
);
