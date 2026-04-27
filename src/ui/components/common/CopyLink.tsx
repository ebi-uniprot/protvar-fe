import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PredictionType } from '../../../hooks/usePredictionHighlight';
import { toast } from '../../toast/toast';

interface CopyLinkProps {
  predictionType: PredictionType;
  title?: string;
}

export function CopyLink({ predictionType, title }: CopyLinkProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(location.search);
    params.set('pred', predictionType);

    const baseUrl = window.location.href.split('?')[0].split('#')[0];
    const newUrl = `${baseUrl}?${params.toString()}`;

    navigator.clipboard.writeText(newUrl).then(() => {
      toast.success('Link copied to clipboard!', 2500);
    }).catch(() => {
      toast.error('Failed to copy link');
    });

    navigate({ search: params.toString() }, { replace: true });
  };

  return (
    <button
      onClick={handleClick}
      className="copy-link"
      title={title || `Copy link to ${predictionType} prediction`}
      aria-label={`Share ${predictionType} prediction`}
    >
      <i className="bi bi-link-45deg" />
    </button>
  );
}
