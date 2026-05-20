import React from 'react';

// Coloured-bullet category list — used in help content to render the score-band
// legends (AlphaMissense, CADD, ESM, popEVE, conservation, …) and any ad-hoc
// "bullet + range — text" list of the same shape.
//
// The bullet colour is per-item data, so it's passed via the inline `--bullet-color`
// custom property; everything else (layout, sizing, default colour) lives in
// components/help-content.css.
//
// NOTE: a similar pattern exists in modal/LegendModal.tsx (CircleItems /
// SquareItems) with slight format differences — consolidating the three into
// one shared component is a deliberate follow-up; see review notes.

export type HelpCategoryItem = {
  stdColor: string;
  range?: string;
  text: string;
};

export const HelpCategories: React.FC<{ attrs: HelpCategoryItem[] }> = ({ attrs }) => (
  <ul className="help-categories">
    {attrs.map((attr, i) => (
      <li key={i} className="help-category-item">
        <span
          className="help-category-bullet"
          style={{ '--bullet-color': attr.stdColor } as React.CSSProperties}
        />
        {attr.range ? (
          <>
            <em>{attr.range}</em> — {attr.text}
          </>
        ) : (
          attr.text
        )}
      </li>
    ))}
  </ul>
);
