/**
 * Hook to manage prediction highlighting from URL parameters
 * Supports linking to specific predictions via ?pred=m3d, ?pred=cadd, etc.
 */

import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export type PredictionType =
  | 'm3d'
  | 'conserv'
  | 'foldx'
  | 'cadd'
  | 'alphamissense'
  | 'eve'
  | 'popeve'
  | 'esm';

export function usePredictionHighlight() {
  const location = useLocation();
  const [highlightedPrediction, setHighlightedPrediction] = useState<PredictionType | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const predParam = params.get('pred');

    if (predParam) {
      const normalizedPred = predParam.toLowerCase() as PredictionType;

      // Validate prediction type
      const validPreds: PredictionType[] = [
        'm3d', 'conserv', 'foldx', 'cadd',
        'alphamissense', 'eve', 'popeve', 'esm'
      ];

      if (validPreds.includes(normalizedPred)) {
        setHighlightedPrediction(normalizedPred);

        // Clear highlight after 3 seconds
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          setHighlightedPrediction(null);
        }, 3000);
      }
    } else {
      setHighlightedPrediction(null);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [location.search]);

  return highlightedPrediction;
}