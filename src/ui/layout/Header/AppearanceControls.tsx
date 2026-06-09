import React, { useState } from 'react';
import { useStorage } from '../../../context/StorageContext';
import { FontSize, Theme } from '../../../types/UserPrefs';

const FONT_SIZES: { key: FontSize; title: string }[] = [
  { key: 'sm', title: 'Small text' },
  { key: 'md', title: 'Medium text' },
  { key: 'lg', title: 'Large text' },
];

// Theme toggle + AAA text-size controls, shown in the masthead utility cluster
// (next to status + version). Writes to user prefs (persisted) and reflects the
// choice on <html> via data-theme / data-font-size, which drive the CSS
// variables in styles/core/variables.css.
const AppearanceControls: React.FC = () => {
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
        <i className={`bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon'}`} />
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
