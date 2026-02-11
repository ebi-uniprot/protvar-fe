/**
 * Component to create shareable links to specific predictions
 * Adds a small link icon next to prediction names
 */

import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {PredictionType} from "../../../../hooks/usePredictionHighlight";

interface SharePredictionLinkProps {
  predictionType: PredictionType;
  title?: string;
}

export function SharePredictionLink({
                                      predictionType,
                                      title
                                    }: SharePredictionLinkProps) {
  const location = useLocation();
  const [copied, setCopied] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Build query parameters
    const params = new URLSearchParams(location.search);
    params.set('pred', predictionType);

    // Build the full URL
    // Use window.location.href as base and replace query params
    const baseUrl = window.location.href.split('?')[0].split('#')[0];
    const newUrl = `${baseUrl}?${params.toString()}`;

    console.log('Share prediction link:', {
      predictionType,
      baseUrl,
      params: params.toString(),
      fullUrl: newUrl
    });

    // Copy to clipboard
    navigator.clipboard.writeText(newUrl).then(() => {
      setCopied(true);
      console.log('Link copied to clipboard:', newUrl);

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy link:', err);
    });
  };

  return (
    <button
      onClick={handleClick}
      className="share-prediction-link"
      title={title || `Copy link to ${predictionType} prediction`}
      aria-label={`Share ${predictionType} prediction`}
      style={{
        background: 'none',
        border: 'none',
        padding: '0 4px',
        cursor: 'pointer',
        color: copied ? '#4CAF50' : '#666',
        fontSize: '12px',
        marginLeft: '4px',
        transition: 'color 0.2s'
      }}
    >
      <i className={copied ? 'bi bi-check2' : 'bi bi-link-45deg'}></i>
    </button>
  );
}