import React, { useContext } from 'react';
import { CircleHelp } from 'lucide-react';
import { AppContext } from '../../App';
import { Icon } from '../../elements/Icon';

interface HelpBtnProps {
  title: string;
  content: React.JSX.Element;
  variant?: 'inline';
}

export const HelpButton: React.FC<HelpBtnProps> = ({ title, content, variant }) => {
  const state = useContext(AppContext);

  if (variant === 'inline') {
    return (
      <Icon
        name="question-circle"
        className="help-icon-inline"
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
      aria-label={title || 'Help'}
    >
      {title && <>{title}{' '}</>}
      <CircleHelp size={15} strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
};
