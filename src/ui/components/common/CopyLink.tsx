import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PredictionType, PREDICTION_HIGHLIGHT_CLASS } from '../../../hooks/usePredictionHighlight';
import { toast } from '../../toast/toast';

interface CopyLinkProps {
  predictionType: PredictionType;
  title?: string;
}

export function CopyLink({ predictionType, title }: CopyLinkProps) {
  const location = useLocation();
  const [copied, setCopied] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(location.search);
    params.set('pred', predictionType);

    const baseUrl = window.location.href.split('?')[0].split('#')[0];
    const newUrl = `${baseUrl}?${params.toString()}`;

    // Copy the shareable URL only — don't navigate the current page. Flash the
    // row for feedback by toggling the highlight class on the nearest prediction
    // item; no scroll (scroll-into-view is reserved for arriving via a ?pred= URL).
    const item = (e.currentTarget as HTMLElement).closest('.prediction-item');
    if (item) {
      item.classList.add(PREDICTION_HIGHLIGHT_CLASS);
      setTimeout(() => item.classList.remove(PREDICTION_HIGHLIGHT_CLASS), 3000);
    }

    navigator.clipboard.writeText(newUrl).then(() => {
      toast.success('Link copied to clipboard!', 3000);
    }).catch(() => {
      toast.error('Failed to copy link');
    });

    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <button
      onClick={handleClick}
      className={`copy-link${copied ? ' copy-link--copied' : ''}`}
      title={title || `Copy link to ${predictionType} prediction`}
      aria-label={`Copy link to ${predictionType} prediction`}
    >
      <i className={`bi ${copied ? 'bi-check2' : 'bi-link-45deg'}`} />
    </button>
  );
}
