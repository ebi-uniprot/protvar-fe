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

export function PredictionWrapper({
                                    predictionType,
                                    isHighlighted,
                                    children
                                  }: PredictionWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHighlighted && wrapperRef.current) {
      // Smooth scroll to highlighted prediction
      setTimeout(() => {
        wrapperRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);
    }
  }, [isHighlighted]);

  return (
    <div
      ref={wrapperRef}
      data-prediction={predictionType}
      className={`prediction-item ${isHighlighted ? 'prediction-highlighted' : ''}`}
      style={{
        transition: 'all 0.3s ease',
        padding: isHighlighted ? '8px' : '0',
        margin: isHighlighted ? '4px 0' : '0',
        borderRadius: isHighlighted ? '4px' : '0',
        backgroundColor: isHighlighted ? 'rgba(255, 235, 59, 0.2)' : 'transparent',
        border: isHighlighted ? '2px solid #FFC107' : '2px solid transparent',
      }}
    >
      {children}
    </div>
  );
}