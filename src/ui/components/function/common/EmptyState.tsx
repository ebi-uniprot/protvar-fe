/**
 * Reusable empty state component for displaying "no data" messages
 */

import React from 'react';

interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return <div className="empty-state">{message}</div>;
}