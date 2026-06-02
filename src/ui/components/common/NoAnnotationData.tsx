import React from 'react';

interface NoAnnotationDataProps {
  icon: string;
  iconAlt: string;
  title: string;
  message: string;
}

export function NoAnnotationData({ icon, iconAlt, title, message }: NoAnnotationDataProps) {
  return (
    <div className="annotation-data-container">
      <div className="annotation-header">
        <div className="annotation-title">
          <img
            src={icon}
            className="annotation-icon"
            data-fill="0.0"
            alt={iconAlt}
          />
          <h5>{title}</h5>
        </div>
      </div>
      <div className="no-data-message">{message}</div>
    </div>
  );
}
