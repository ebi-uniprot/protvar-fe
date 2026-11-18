import React from 'react';
import { NavLink } from 'react-router-dom';
import { ABOUT, CONTACT, HELP, RELEASE } from '../../../constants/BrowserPaths';
import { API_URL } from '../../../constants/const';
import { Icon } from '../../elements/Icon';

const LINKS = [
  { to: ABOUT, icon: 'info-square', label: 'About' },
  { to: HELP, icon: 'question-circle', label: 'Help' },
  { href: API_URL, icon: 'file-earmark-code', label: 'API Docs' },
  { to: RELEASE, icon: 'tag', label: 'Release' },
  { to: CONTACT, icon: 'envelope', label: 'Contact' },
];

interface SiteLinksProps {
  linkClass: string;        // sidebar-link (sidebar) or navbar-menu-link (narrow-screen menu)
  labelClass?: string;      // sidebar-label, hidden in the icon rail
}

// About / Help / API / Release / Contact. In the sidebar on desktop; in the header's menu on narrow screens,
// where the sidebar is hidden.
const SiteLinks: React.FC<SiteLinksProps> = ({ linkClass, labelClass }) => (
  <>
    {LINKS.map(({ to, href, icon, label }) => {
      const body = <><Icon name={icon} /><span className={labelClass}>{label}</span></>;
      return href
        ? <a key={label} href={href} title={`ProtVar ${label}`} target="_blank" rel="noopener noreferrer"
             className={linkClass}>{body}</a>
        : <NavLink key={label} to={to!} title={`ProtVar ${label}`}
                   className={({ isActive }) => `${linkClass}${isActive ? ' active' : ''}`}>{body}</NavLink>;
    })}
  </>
);

export default SiteLinks;
