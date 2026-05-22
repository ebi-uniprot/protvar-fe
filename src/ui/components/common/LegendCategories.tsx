import React from 'react';

// Score-category legend used in both the legend drawer (LegendContent) and
// the predictions help (PredictionsHelp). One row per item: marker · range
// · text. Within one list the marker / range / text columns auto-align across
// rows so ranges of different widths still read cleanly.
//
// Markers come in two variants:
//   - dot: filled circle coloured from `stdColor` (or `color` when the toggle
//     is off and a separate source palette is provided).
//   - icon: a Bootstrap icon with an optional colour-bearing class (e.g. the
//     pocket / PPI up/down caret styled via `.pocket-conf.vhigh`). Icon-marker
//     items ignore the stdColor toggle — colour comes from the CSS class.

export type LegendCategory = {
  range?: string;
  text: string;
  // Dot marker:
  stdColor?: string;
  color?: string;
  // Icon marker (mutually exclusive with the dot fields above):
  icon?: string;
  iconClass?: string;
};

export const LegendCategories: React.FC<{
  attrs: LegendCategory[];
  stdColor?: boolean;
}> = ({ attrs, stdColor = true }) => (
  <ul className="legend-categories">
    {attrs.map((attr, i) => {
      const dotColor = stdColor ? attr.stdColor : (attr.color ?? attr.stdColor);
      return (
        <li key={i} className="legend-category">
          {attr.icon ? (
            <i className={`bi ${attr.icon}${attr.iconClass ? ` ${attr.iconClass}` : ''}`} />
          ) : (
            <i className="bi bi-circle-fill" style={{ color: dotColor }} />
          )}
          {attr.range ? <em className="legend-category-range">{attr.range}</em> : <span />}
          <span>{attr.text}</span>
        </li>
      );
    })}
  </ul>
);
