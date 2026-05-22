import React from 'react';

// Coloured-bullet category list — used in help content to render the score-band
// legends (AlphaMissense, CADD, ESM, popEVE, conservation, …) and any ad-hoc
// "marker + range + text" list of the same shape.
//
// Each item carries exactly one marker spec:
//   - `stdColor` (+ optional `color` for the source palette) → coloured circular bullet
//   - `icon`     → Bootstrap icon (e.g. pocket/PPI up/down caret); `iconClass`
//                  adds the colour-bearing class (e.g. `pocket-conf vhigh`).
//
// Range and text are laid out as two aligned columns via CSS grid in
// components/help-content.css (no em-dash separator — gap does the work).
//
// The `stdColor` prop on the component flips dot-marker items between the
// standardised palette (attr.stdColor) and the original source palette
// (attr.color, when provided). Icon-marker items ignore the toggle —
// their colour comes from a CSS class.
//
// NOTE: a similar pattern exists in modal/LegendContent.tsx (LegendItems) —
// consolidating the two into one shared component is a deliberate follow-up.

export type HelpCategoryItem = {
  range?: string;
  text: string;
  stdColor?: string;
  color?: string;
  icon?: string;
  iconClass?: string;
};

export const HelpCategories: React.FC<{ attrs: HelpCategoryItem[]; stdColor?: boolean }> = ({
  attrs,
  stdColor = true,
}) => (
  <ul className="help-categories">
    {attrs.map((attr, i) => {
      const bulletColor = stdColor ? attr.stdColor : (attr.color ?? attr.stdColor);
      return (
        <li key={i} className="help-category-item">
          {attr.icon ? (
            <i className={`bi ${attr.icon}${attr.iconClass ? ` ${attr.iconClass}` : ''}`} />
          ) : (
            <span
              className="help-category-bullet"
              style={{ '--bullet-color': bulletColor } as React.CSSProperties}
            />
          )}
          {attr.range ? <em className="help-category-range">{attr.range}</em> : <span />}
          <span className="help-category-text">{attr.text}</span>
        </li>
      );
    })}
  </ul>
);
