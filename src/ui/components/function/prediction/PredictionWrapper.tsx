/**
 * Wrapper component for individual predictions
 * Handles highlighting and scrolling when prediction is linked via URL
 */

import React, { useRef, useEffect } from 'react';
import {PredictionType} from "../../../../hooks/usePredictionHighlight";

interface PredictionWrapperProps {
  predictionType: PredictionType;
  isHighlighted: boolean;
  children: React.ReactNode;
}

export function PredictionWrapper({ predictionType, isHighlighted, children }: PredictionWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHighlighted && wrapperRef.current) {
      setTimeout(() => {
        wrapperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [isHighlighted]);

  return (
    <div
      ref={wrapperRef}
      data-prediction={predictionType}
      className={`prediction-item${isHighlighted ? ' prediction-highlighted' : ''}`}
    >
      {children}
    </div>
  );
}
