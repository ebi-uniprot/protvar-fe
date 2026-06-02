/**
 * Hook to manage prediction highlighting from URL parameters
 * Supports linking to specific predictions via ?pred=m3d, ?pred=cadd, etc.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type PredictionType =
  | 'm3d'
  | 'conserv'
  | 'foldx'
  | 'cadd'
  | 'alphamissense'
  | 'eve'
  | 'popeve'
  | 'esm';

const VALID_PREDS: PredictionType[] = [
  'm3d', 'conserv', 'foldx', 'cadd',
  'alphamissense', 'eve', 'popeve', 'esm'
];

export function usePredictionHighlight() {
  const location = useLocation();
  const navigate = useNavigate();
  const [highlightedPrediction, setHighlightedPrediction] = useState<PredictionType | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const triggerHighlight = useCallback((pred: PredictionType) => {
    setHighlightedPrediction(pred);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setHighlightedPrediction(null);
    }, 3000);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const predParam = params.get('pred');

    if (predParam) {
      const normalizedPred = predParam.toLowerCase() as PredictionType;
      if (VALID_PREDS.includes(normalizedPred)) {
        triggerHighlight(normalizedPred);
        // Remove param from URL so refresh doesn't re-trigger
        params.delete('pred');
        navigate({ search: params.toString() }, { replace: true });
      }
    }
  }, [location.search, navigate, triggerHighlight]);

  // Clear any pending highlight timer on unmount only. (Keeping this in the
  // effect above would cancel the 3s auto-clear the moment we strip ?pred=,
  // since that changes location.search and re-runs the effect.)
  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  return { highlightedPrediction, triggerHighlight };
}