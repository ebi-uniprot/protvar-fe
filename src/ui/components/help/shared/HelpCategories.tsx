import React from 'react';

// Coloured-bullet category list — used in help content to render the score-band
// legends (AlphaMissense, CADD, ESM, popEVE, conservation, …) and any ad-hoc
// "marker + range + text" list of the same shape.
//
// Each item carries exactly one marker spec:
//   - `stdColor` → coloured circular bullet (most predictions)
//   - `icon`     → Bootstrap icon (e.g. pocket/PPI up/down caret); `iconClass`
//                  adds the colour-bearing class (e.g. `pocket-conf vhigh`).
//
// Range and text are laid out as two aligned columns via CSS grid in
// components/help-content.css (no em-dash separator — gap does the work).
//
// NOTE: a similar pattern exists in modal/LegendModal.tsx (CircleItems /
// SquareItems) with slight format differences — consolidating the three into
// one shared component is a deliberate follow-up; see review notes.

export type HelpCategoryItem = {
  range?: string;
  text: string;
  stdColor?: string;
  icon?: string;
  iconClass?: string;
};

export const HelpCategories: React.FC<{ attrs: HelpCategoryItem[] }> = ({ attrs }) => (
  <ul className="help-categories">
    {attrs.map((attr, i) => (
      <li key={i} className="help-category-item">
        {attr.icon ? (
          <i className={`bi ${attr.icon}${attr.iconClass ? ` ${attr.iconClass}` : ''}`} />
        ) : (
          <span
            className="help-category-bullet"
            style={{ '--bullet-color': attr.stdColor } as React.CSSProperties}
          />
        )}
        {attr.range ? <em className="help-category-range">{attr.range}</em> : <span />}
        <span className="help-category-text">{attr.text}</span>
      </li>
    ))}
  </ul>
);
