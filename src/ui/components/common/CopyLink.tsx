import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PredictionType } from '../../../hooks/usePredictionHighlight';

interface CopyLinkProps {
  predictionType: PredictionType;
  title?: string;
}

export function CopyLink({ predictionType, title }: CopyLinkProps) {
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
        className={`copy-link${copied ? ' copy-link--copied' : ''}`}
        title={title || `Copy link to ${predictionType} prediction`}
        aria-label={`Share ${predictionType} prediction`}
      >
        <i className={copied ? 'bi bi-check2' : 'bi bi-link-45deg'} />
      </button>

      {copied && (
        <div className="copy-toast">
          <i className="bi bi-check-circle-fill" /> Link copied to clipboard!
        </div>
      )}
    </>
  );
}
