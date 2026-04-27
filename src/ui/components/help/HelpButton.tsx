import React, { useContext } from 'react';
import { AppContext } from '../../App';

interface HelpBtnProps {
  title: string;
  content: React.JSX.Element;
  variant?: 'inline';
}

export const HelpButton: React.FC<HelpBtnProps> = ({ title, content, variant }) => {
  const state = useContext(AppContext);

  if (variant === 'inline') {
    return (
      <i
        className="bi bi-question-circle help-icon-inline"
        onClick={() => state.updateState('drawer', content)}
        title={title || 'Help'}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => state.updateState('drawer', content)}
      className="help-icon"
      title={title || 'Help'}
    >
      {title && <>{title}{' '}</>}
      <i className="bi bi-question-circle" />
    </button>
  );
};
