import React from 'react';
import { NavLink } from 'react-router-dom';
import { ABOUT, CONTACT, HELP, RELEASE } from '../../../constants/BrowserPaths';
import { API_URL } from '../../../constants/const';
import { Icon } from '../../elements/Icon';

// Help first (the most used; the book is help everywhere in the app), Contact last
const LINKS = [
  { to: HELP, icon: 'book-fill', label: 'Help' },
  { to: ABOUT, icon: 'info-square', label: 'About' },
  { href: API_URL, icon: 'file-earmark-code', label: 'API Docs' },
  { to: RELEASE, icon: 'tag', label: 'Release' },
  { to: CONTACT, icon: 'envelope', label: 'Contact' },
];

interface SiteLinksProps {
  linkClass: string;        // sidebar-link (sidebar) or navbar-menu-link (narrow-screen menu)
  labelClass?: string;      // sidebar-label, hidden in the icon rail
}

// Help / About / API / Release / Contact. In the sidebar on desktop; in the header's menu on narrow screens,
// where the sidebar is hidden.
const SiteLinks: React.FC<SiteLinksProps> = ({ linkClass, labelClass }) => (
  <>
    {LINKS.map(({ to, href, icon, label }) => {
      // the one link that opens a new tab says so (↗), as the app's other external links do
      const body = <><Icon name={icon} /><span className={labelClass}>{label}{href && <span className="ext-arrow" aria-hidden="true">↗</span>}</span></>;
      return href
        ? <a key={label} href={href} title={`ProtVar ${label}`} target="_blank" rel="noopener noreferrer"
             className={linkClass}>{body}</a>
        : <NavLink key={label} to={to!} title={`ProtVar ${label}`}
                   className={({ isActive }) => `${linkClass}${isActive ? ' active' : ''}`}>{body}</NavLink>;
    })}
  </>
);

export default SiteLinks;
