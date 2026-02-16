import React from "react";

interface ViewerControlsProps {
  actions: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'reset';
  }[];
}

export const ViewerControls: React.FC<ViewerControlsProps> = ({ actions }) => {
  if (actions.length === 0) return null;

  return (
    <div className="viewer-controls">
      {actions.map((action, idx) => (
        <button
          key={idx}
          className={`viewer-control-btn ${action.variant ? `btn-${action.variant}` : ''}`}
          onClick={action.onClick}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
};