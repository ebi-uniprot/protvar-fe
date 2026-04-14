import React, { useContext, useState } from 'react';
import { AppContext } from '../../App';

interface HelpBtnProps {
  title: string;
  content: React.JSX.Element;
  variant?: 'inline';
}

export const HelpButton: React.FC<HelpBtnProps> = ({ title, content, variant }) => {
  const state = useContext(AppContext);
  const [mouseOver, setMouseOver] = useState(false);

  if (variant === 'inline') {
    return (
      <i
        className="bi bi-info-circle-fill help-icon-inline"
        onClick={() => state.updateState('drawer', content)}
        title={title || 'Help'}
      />
    );
  }

  return (
    <span
      onClick={() => state.updateState('drawer', content)}
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
      className="help-icon"
    >
      {title}{' '}
      <i
        className={`bi bi-info-circle${mouseOver ? `-fill` : ''}`}
        style={{ verticalAlign: 'super', fontSize: '13px' }}
      />
    </span>
  );
};
