import React from 'react';

// An open panel with nothing to show: just the message (the tab names the panel)
export function NoAnnotationData({ message }: { message: string }) {
  return (
    <div className="annotation-data-container">
      <div className="no-data-message">{message}</div>
    </div>
  );
}
