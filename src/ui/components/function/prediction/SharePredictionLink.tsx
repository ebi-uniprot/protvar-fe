import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {PredictionType} from "../../../../hooks/usePredictionHighlight";
import './SharePredictionLink.css';

interface SharePredictionLinkProps {
  predictionType: PredictionType;
  title?: string;
}

export function SharePredictionLink({
                                      predictionType,
                                      title
                                    }: SharePredictionLinkProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(location.search);
    params.set('pred', predictionType);

    const baseUrl = window.location.href.split('?')[0].split('#')[0];
    const newUrl = `${baseUrl}?${params.toString()}`;

    navigator.clipboard.writeText(newUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy link:', err);
    });

    // Trigger local highlight via URL — the hook reads this and fires the highlight
    navigate({ search: params.toString() }, { replace: true });
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="share-prediction-link"
        title={title || `Copy link to ${predictionType} prediction`}
        aria-label={`Share ${predictionType} prediction`}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: copied ? '#4CAF50' : '#666',
          fontSize: '12px',
          transition: 'color 0.2s'
        }}
      >
        <i className={copied ? 'bi bi-check2' : 'bi bi-link-45deg'}></i>
      </button>

      {copied && (
        <div className="copy-toast">
          <i className="bi bi-check-circle-fill"></i> Link copied to clipboard!
        </div>
      )}
    </>
  );
}