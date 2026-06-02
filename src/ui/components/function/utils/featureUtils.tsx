/**
 * Utilities for feature filtering and formatting
 */

import React from 'react';
import {Feature} from "../../../../types/FunctionalInfo";

/**
 * Filter features by variant position into residues and regions
 */
export function filterFeaturesByPosition(
  features: Feature[],
  position: number
): { residues: Feature[]; regions: Feature[] } {
  const residues: Feature[] = [];
  const regions: Feature[] = [];

  features.forEach((feature) => {
    // Skip VARIANTS category
    if (feature.category === 'VARIANTS') return;

    const begin = Number(feature.begin);
    const end = Number(feature.end);

    if (begin === end) {
      // Single position = residue
      residues.push(feature);
    } else if (shouldIncludeRegion(feature, position, begin, end)) {
      // Range = region (if variant is within range)
      regions.push(feature);
    }
  });

  return { residues, regions };
}

/**
 * Determine if a region should be included based on variant position
 */
function shouldIncludeRegion(
  feature: Feature,
  position: number,
  begin: number,
  end: number
): boolean {
  if (feature.type === 'DISULFID') {
    // DISULFID: position must match start OR end exactly
    // TODO: This filtering should be done on the API side
    return position === begin || position === end;
  }

  // Other regions: position must be within range
  return position >= begin && position <= end;
}

/**
 * Format position label for display
 */
export function getPositionLabel(begin: string, end: string, type: string): JSX.Element {
  const beginNum = Number(begin);
  const endNum = Number(end);

  if (beginNum === endNum) {
    return (
      <>
        <b>Position:</b> {begin}
      </>
    );
  }

  if (type === 'DISULFID') {
    // TODO: This display format should be handled by the API
    return (
      <>
        <b>Disulfide bond:</b> C{begin}-S-S-C{end}
      </>
    );
  }

  return (
    <>
      <b>Range:</b> {begin} - {end}
    </>
  );
}