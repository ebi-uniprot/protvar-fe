import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { HOME } from '../../../constants/BrowserPaths';
import SearchBox from "../../components/search/SearchBox";
import AppearanceControls from './AppearanceControls';
import DisplayMenu from './DisplayMenu';
import SiteLinks from './SiteLinks';

interface NavbarProps {
  onShowBanner?: () => void;
}

// One slim row: logo + tagline, search in the middle, display settings on the right. The site links live in the
// sidebar (on narrow screens, behind the menu button); status and versions in the footer.
const Navbar: React.FC<NavbarProps> = ({ onShowBanner }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close on navigation, a click outside, or Escape
  useEffect(() => setMenuOpen(false), [location]);
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <nav className="navbar">
      <Link to={HOME} title="ProtVar homepage" className="brand-link">
        <img src={"ProtVar_logo.svg"} alt="ProtVar logo" height="40" className="brand-logo" />
      </Link>
      <span className="brand-tagline">Contextualising human<br />missense variation</span>

      <SearchBox className="navbar-search" />

      <div className="navbar-end" ref={menuRef}>
        {/* Wide screens: display settings (theme, text size) */}
        <DisplayMenu />
        {/* Narrow screens only: the sidebar's site links and display controls, in a menu */}
        <button type="button" className="navbar-menu-btn" onClick={() => setMenuOpen(o => !o)}
                aria-expanded={menuOpen} aria-label={menuOpen ? 'Close menu' : 'Menu'}>
          {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
        {menuOpen && (
          <div className="navbar-menu">
            <SiteLinks linkClass="navbar-menu-link" />
            <div className="navbar-menu-foot">
              <AppearanceControls />
            </div>
          </div>
        )}
      </div>

      {onShowBanner && (
        <button className="navbar-banner-restore" onClick={onShowBanner}>
          Show banner
        </button>
      )}
    </nav>
  );
};

export default Navbar;
