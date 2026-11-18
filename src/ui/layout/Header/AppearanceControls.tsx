import React, { useState } from 'react';
import { useStorage } from '../../../context/StorageContext';
import { FontSize, Theme } from '../../../types/UserPrefs';
import { Icon } from '../../elements/Icon';

export const FONT_SIZES: { key: FontSize; title: string }[] = [
  { key: 'sm', title: 'Small text' },
  { key: 'md', title: 'Medium text' },
  { key: 'lg', title: 'Large text' },
];

// Theme + text size: user prefs (persisted), reflected on <html> via data-theme / data-font-size, which drive the
// CSS variables in styles/core/variables.css. Used by the header's display menu and the narrow-screen menu.
export function useAppearance() {
  const { getPrefs, setPrefs } = useStorage();
  const [theme, setTheme] = useState<Theme>(() => getPrefs().theme);
  const [fontSize, setFontSize] = useState<FontSize>(() => getPrefs().fontSize);

  const applyTheme = (next: Theme) => {
    setTheme(next);
    setPrefs({ theme: next });
    document.documentElement.setAttribute('data-theme', next);
  };

  const applyFontSize = (next: FontSize) => {
    setFontSize(next);
    setPrefs({ fontSize: next });
    document.documentElement.setAttribute('data-font-size', next);
  };

  return { theme, fontSize, applyTheme, applyFontSize };
}

// Compact theme toggle + AAA text size (the narrow-screen menu)
const AppearanceControls: React.FC = () => {
  const { theme, fontSize, applyTheme, applyFontSize } = useAppearance();
  const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';

  return (
    <div className="navbar-appearance">
      <button
        type="button"
        className="navbar-appearance-btn theme-toggle"
        onClick={() => applyTheme(nextTheme)}
        title={`Switch to ${nextTheme} theme`}
        aria-label={`Switch to ${nextTheme} theme`}
      >
        <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
      </button>

      <span className="navbar-appearance-sep" aria-hidden="true" />

      <div className="navbar-font-sizes" role="group" aria-label="Text size">
        {FONT_SIZES.map(({ key, title }) => (
          <button
            key={key}
            type="button"
            className={`navbar-appearance-btn navbar-font-btn font-${key}${fontSize === key ? ' active' : ''}`}
            onClick={() => applyFontSize(key)}
            title={title}
            aria-label={title}
            aria-pressed={fontSize === key}
          >
            A
          </button>
        ))}
      </div>
    </div>
  );
};

export default AppearanceControls;
