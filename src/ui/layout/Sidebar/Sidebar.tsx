import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ACTIVITY, HOME } from '../../../constants/BrowserPaths';
import RecentActivity from '../../pages/result/RecentActivity';
import { useStorage } from '../../../context/StorageContext';
import SiteLinks from '../Header/SiteLinks';
import { Icon } from '../../elements/Icon';

interface SidebarProps {
  numResults: number;
  numDownloads: number;
  onExpandChange?: (isExpanded: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  numResults,
  numDownloads,
  onExpandChange,
}) => {
  const { getPrefs, setPrefs } = useStorage()
  const [isExpanded, setIsExpanded] = useState(() => getPrefs().sidebarExpanded)
  const location = useLocation()

  // Both history and downloads live under /activity — distinguish by tab param
  const onActivity = location.pathname === ACTIVITY
  const isDownloadsTab = new URLSearchParams(location.search).get('tab') === 'downloads'
  const historyActive = onActivity && !isDownloadsTab
  const downloadsActive = onActivity && isDownloadsTab

  // The home page: where every search starts (its mode bar has Annotate / Browse / Semantic Search)
  const onHome = location.pathname === HOME

  useEffect(() => {
    setPrefs({ sidebarExpanded: isExpanded })
    onExpandChange?.(isExpanded)
  }, [isExpanded, onExpandChange, setPrefs])

  // The sidebar sticks to the top, but at the top of the page the banner + masthead sit above it. Fit it to the
  // visible height so its bottom (site links, display controls) is always on screen.
  const sidebarRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = sidebarRef.current
    const masthead = document.getElementById('masthead')
    if (!el || !masthead) return
    let frame = 0
    const fit = () => {
      frame = 0
      el.style.height = `${window.innerHeight - Math.max(0, masthead.getBoundingClientRect().bottom)}px`
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(fit) }
    fit()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    const observer = new ResizeObserver(schedule)   // banner sliding open / closed moves the masthead
    if (masthead.parentElement) observer.observe(masthead.parentElement)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])

  const toggleExpanded = () => setIsExpanded(prev => !prev)

  return (
    <>
      {/* Mobile icon strip */}
      <nav className="mobile-nav-strip" aria-label="Mobile navigation">
        <NavLink to={HOME} aria-label="New search" title="New search"
                 className={() => `mobile-nav-item${onHome ? ' active' : ''}`}>
          <Icon name="search" />
        </NavLink>
        <NavLink
          to={ACTIVITY}
          className={() => `mobile-nav-item${historyActive ? ' active' : ''}`}
        >
          <Icon name="clock-history" />
          {numResults > 0 && (
            <span className="mobile-nav-badge">{numResults}</span>
          )}
        </NavLink>
        <NavLink
          to={`${ACTIVITY}?tab=downloads`}
          className={() => `mobile-nav-item${downloadsActive ? ' active' : ''}`}
        >
          <Icon name="download" />
          {numDownloads > 0 && (
            <span className="mobile-nav-badge">{numDownloads}</span>
          )}
        </NavLink>
      </nav>

      {/* Desktop sidebar */}
      <div ref={sidebarRef} className={`sidebar${isExpanded ? ' expanded' : ''}`}>
        <button
          className="sidebar-rail-toggle"
          onClick={toggleExpanded}
          title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <Icon name={isExpanded ? 'chevron-left' : 'chevron-right'} />
        </button>

        <nav className="sidebar-nav">
          <ul className="sidebar-menu-list">
            {/* New search: back to the home page (its mode bar has Annotate / Browse / Semantic Search) */}
            <li className="sidebar-menu-item">
              <NavLink to={HOME} title="New search"
                       className={() => `sidebar-link${onHome ? ' active' : ''}`}>
                <Icon name="search" />
                <span className="sidebar-label">New search</span>
              </NavLink>
            </li>

            <li className="sidebar-menu-item">
              <NavLink
                to={ACTIVITY}
                className={() => `sidebar-link${historyActive ? ' active' : ''}`}
              >
                <Icon name="clock-history" />
                <span className="sidebar-label">
                  History
                  <span className={`record-count ${numResults === 0 ? 'gray-bg' : ''}`}>
                    {numResults}
                  </span>
                </span>
              </NavLink>
              {isExpanded && <RecentActivity />}
            </li>

            <li className="sidebar-menu-item">
              <NavLink
                to={`${ACTIVITY}?tab=downloads`}
                className={() => `sidebar-link${downloadsActive ? ' active' : ''}`}
              >
                <Icon name="download" />
                <span className="sidebar-label">
                  Downloads
                  <span className={`record-count ${numDownloads === 0 ? 'gray-bg' : ''}`}>
                    {numDownloads}
                  </span>
                </span>
              </NavLink>
            </li>
          </ul>

          <div className="sidebar-site-links">
            <SiteLinks linkClass="sidebar-link" labelClass="sidebar-label" />
          </div>
        </nav>

      </div>
    </>
  );
};

export default Sidebar;
