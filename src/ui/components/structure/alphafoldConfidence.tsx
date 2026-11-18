import React from 'react';
import { Icon } from '../../elements/Icon';

// AlphaFold pLDDT confidence bands — the colour + label pairs for the
// per-residue model confidence legend. Single source of truth for the
// Predictions help (AlphaFold section) and the structure-viewer legend
// (which uses the short labels).
export const ALPHAFOLD_CONF = [
  {color: 'rgb(0, 83, 214)',   text: 'Very high (pLDDT > 90)', short: '>90'},
  {color: 'rgb(101, 203, 243)', text: 'High (90 > pLDDT > 70)', short: '90–70'},
  {color: 'rgb(255, 219, 19)',  text: 'Low (70 > pLDDT > 50)', short: '70–50'},
  {color: 'rgb(255, 125, 69)',  text: 'Very low (pLDDT < 50)', short: '<50'},
];

// Per-residue model confidence (pLDDT) legend — square markers in the
// standardised AlphaFold colours. Reused by the Predictions help (AlphaFold
// section) and the structure-viewer AF confidence panel.
export const AFConfidenceLegend: React.FC = () => (
  <div className="flex-column">
    {ALPHAFOLD_CONF.map(c => (
      <div key={c.text} className="flex">
        <span className="padding-left-right-1x"><Icon name="square-fill" style={{color: c.color}} /></span>
        <div className="flex1">{c.text}</div>
      </div>
    ))}
  </div>
);
