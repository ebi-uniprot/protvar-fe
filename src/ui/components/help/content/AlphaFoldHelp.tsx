import React from "react";
import {v1 as uuidv1} from "uuid";

export const ALPHAFOLD_CONF = [
  {color: 'rgb(0, 83, 214)', text: 'Very high (pLDDT > 90)', shortText: 'V.High'},
  {color: 'rgb(101, 203, 243)', text: 'High (90 > pLDDT > 70)', shortText: 'High' },
  {color: 'rgb(255, 219, 19)', text: 'Low (70 > pLDDT > 50)', shortText: 'Low' },
  {color: 'rgb(255, 125, 69)', text: 'Very low (pLDDT < 50)', shortText: 'V.Low' }
]

export const AFLegend = () => {
  return <div className="flex-column">
    {
      Object.values(ALPHAFOLD_CONF).map(c => {
        return <div key={uuidv1()} className="flex">
              <span className="padding-left-right-1x">
                  <i className="bi bi-square-fill" style={{color: c.color}}></i>
                </span>
          <div className="flex1">{c.text}</div>
        </div>;
      })
    }
  </div>
}

export const AFLegendShortText = () => {
  return <div style={{padding: '5px'}}>
    {
      Object.values(ALPHAFOLD_CONF).map(c => {
        return <div key={uuidv1()}>
          <i className="bi bi-square-fill" style={{color: c.color}}></i> {c.shortText}
        </div>;
      })
    }
  </div>
}

export const AlphaFoldHelp = () => {
  return <div className="help">
    <h4 id="alphafold">AlphaFold</h4>

    <h5>Model Confidence</h5>
    <p>AlphaFold produces a per-residue confidence score (pLDDT) between 0 and 100. Some regions with
      low pLDDT may be unstructured in isolation.</p>
    <p>
    <AFLegend />
    </p>
    <h5>Predicted Align Error (PAE)</h5>
    <p>The colour at position (x, y) indicates AlphaFold's expected position error at residue x, when the
      predicted and true structures are aligned on residue y. This is useful for assessing inter-domain
    accuracy.</p>
  </div>
}