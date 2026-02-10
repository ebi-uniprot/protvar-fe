/**
 * Custom hook for navigating to structure tab with specific features highlighted
 * Handles URL parameter management and row number preservation
 */

import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {Interaction, Pocket} from "../types/Prediction";

/**
 * Extract row number from annotation parameter
 * Examples: "fun-2" → "-2", "functional-3" → "-3", "str" → ""
 */
function extractRowNumber(annotation: string | null): string {
  if (!annotation) return '';
  const match = annotation.match(/-(\d+)$/);
  return match ? `-${match[1]}` : '';
}

/**
 * Smooth scroll to top of page
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function useStructureNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Navigate to structural tab with pocket highlighted
   * Preserves current row number when switching from other annotation tabs
   */
  const openPocketInStructure = useCallback((pocket: Pocket) => {
    const params = new URLSearchParams(location.search);
    const rowNumber = extractRowNumber(params.get('annotation'));

    // Set annotation to structural tab (preserving row number)
    params.set('annotation', `str${rowNumber}`);

    // Set structure to AlphaFold prediction
    params.set('structure', 'prediction');

    // Highlight the specific pocket
    params.set('highlight_pocket', `p${pocket.pocketId}`);

    // Navigate and scroll
    const newUrl = `${location.pathname}?${params.toString()}`;
    navigate(newUrl, { replace: true });
    //scrollToTop();
  }, [location, navigate]);

  /**
   * Navigate to structural tab with protein interaction highlighted
   * Preserves current row number when switching from other annotation tabs
   */
  const openInteractionInStructure = useCallback((interaction: Interaction) => {
    const params = new URLSearchParams(location.search);
    const rowNumber = extractRowNumber(params.get('annotation'));
    const interactionId = `${interaction.a}_${interaction.b}`;

    // Set annotation to structural tab (preserving row number)
    params.set('annotation', `str${rowNumber}`);

    // Set structure to specific interaction
    params.set('structure', `interaction:${interactionId}`);

    // Highlight the interface
    params.set('highlight_interface', '');

    // Navigate and scroll
    const newUrl = `${location.pathname}?${params.toString()}`;
    navigate(newUrl, { replace: true });
    //scrollToTop();
  }, [location, navigate]);

  return {
    openPocketInStructure,
    openInteractionInStructure,
  };
}