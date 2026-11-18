import React, { useEffect, useRef, useState } from 'react';
import { Moon, Sun, SunMoon } from 'lucide-react';
import { FONT_SIZES, useAppearance } from './AppearanceControls';

// Header, top right: one button opening the display settings (light / dark, text size). People set these once,
// so they sit behind a button rather than always on show.
const DisplayMenu: React.FC = () => {
  const { theme, fontSize, applyTheme, applyFontSize } = useAppearance();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="display-menu" ref={ref}>
      <button type="button" className="display-menu-btn" onClick={() => setOpen(o => !o)}
              aria-expanded={open} aria-label="Display settings" title="Display settings">
        <SunMoon size={20} strokeWidth={1.75} aria-hidden="true" />
      </button>
      {open && (
        <div className="display-menu-panel" role="dialog" aria-label="Display settings">
          <div className="display-menu-label">Theme</div>
          <div className="display-menu-options" role="group" aria-label="Theme">
            <button type="button" aria-pressed={theme !== 'dark'} className={theme !== 'dark' ? 'active' : ''}
                    onClick={() => applyTheme('light')}>
              <Sun size={15} strokeWidth={1.75} aria-hidden="true" /> Light
            </button>
            <button type="button" aria-pressed={theme === 'dark'} className={theme === 'dark' ? 'active' : ''}
                    onClick={() => applyTheme('dark')}>
              <Moon size={15} strokeWidth={1.75} aria-hidden="true" /> Dark
            </button>
          </div>
          <div className="display-menu-label">Text size</div>
          <div className="display-menu-options" role="group" aria-label="Text size">
            {FONT_SIZES.map(({ key, title }) => (
              <button key={key} type="button" aria-pressed={fontSize === key} aria-label={title} title={title}
                      className={`display-menu-font font-${key}${fontSize === key ? ' active' : ''}`}
                      onClick={() => applyFontSize(key)}>
                A
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayMenu;
