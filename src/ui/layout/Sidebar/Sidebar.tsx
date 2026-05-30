import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ACTIVITY, HOME } from '../../../constants/BrowserPaths';
import RecentActivity from '../../pages/result/RecentActivity';
import { useStorage } from '../../../context/StorageContext';

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

  // The home page hosts three search modes, mirrored in ?tab= (see SearchPage)
  const onHome = location.pathname === HOME
  const homeTab = new URLSearchParams(location.search).get('tab')
  const annotateActive = onHome && (!homeTab || homeTab === 'annotate')
  const browseActive = onHome && homeTab === 'browse'
  const semanticActive = onHome && homeTab === 'semantic'

  useEffect(() => {
    setPrefs({ sidebarExpanded: isExpanded })
    onExpandChange?.(isExpanded)
  }, [isExpanded, onExpandChange, setPrefs])

  const toggleExpanded = () => setIsExpanded(prev => !prev)

  return (
    <>
      {/* Mobile icon strip */}
      <nav className="mobile-nav-strip" aria-label="Mobile navigation">
        <NavLink
          to={HOME}
          className={() => `mobile-nav-item${annotateActive ? ' active' : ''}`}
        >
          <i className="bi bi-clipboard-data" />
        </NavLink>
        <NavLink
          to={`${HOME}?tab=browse`}
          className={() => `mobile-nav-item${browseActive ? ' active' : ''}`}
        >
          <i className="bi bi-card-list" />
        </NavLink>
        <NavLink
          to={`${HOME}?tab=semantic`}
          className={() => `mobile-nav-item${semanticActive ? ' active' : ''}`}
        >
          <i className="bi bi-body-text" />
        </NavLink>
        <NavLink
          to={ACTIVITY}
          className={() => `mobile-nav-item${historyActive ? ' active' : ''}`}
        >
          <i className="bi bi-clock-history" />
          {numResults > 0 && (
            <span className="mobile-nav-badge">{numResults}</span>
          )}
        </NavLink>
        <NavLink
          to={`${ACTIVITY}?tab=downloads`}
          className={() => `mobile-nav-item${downloadsActive ? ' active' : ''}`}
        >
          <i className="bi bi-download" />
          {numDownloads > 0 && (
            <span className="mobile-nav-badge">{numDownloads}</span>
          )}
        </NavLink>
      </nav>

      {/* Desktop sidebar */}
      <div className={`sidebar${isExpanded ? ' expanded' : ''}`}>
        <button
          className="sidebar-rail-toggle"
          onClick={toggleExpanded}
          title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <i className={`bi ${isExpanded ? 'bi-chevron-left' : 'bi-chevron-right'}`} />
        </button>

        <nav className="sidebar-nav">
          <ul className="sidebar-menu-list">
            <li className="sidebar-menu-item">
              <NavLink
                to={HOME}
                className={() => `sidebar-link${annotateActive ? ' active' : ''}`}
              >
                <i className="bi bi-clipboard-data" />
                <span className="sidebar-label">Annotate</span>
              </NavLink>
            </li>

            <li className="sidebar-menu-item">
              <NavLink
                to={`${HOME}?tab=browse`}
                className={() => `sidebar-link${browseActive ? ' active' : ''}`}
              >
                <i className="bi bi-card-list" />
                <span className="sidebar-label">Browse</span>
              </NavLink>
            </li>

            <li className="sidebar-menu-item">
              <NavLink
                to={`${HOME}?tab=semantic`}
                className={() => `sidebar-link${semanticActive ? ' active' : ''}`}
              >
                <i className="bi bi-body-text" />
                <span className="sidebar-label">Semantic Search</span>
              </NavLink>
            </li>

            <li className="sidebar-menu-item">
              <NavLink
                to={ACTIVITY}
                className={() => `sidebar-link${historyActive ? ' active' : ''}`}
              >
                <i className="bi bi-clock-history" />
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
                <i className="bi bi-download" />
                <span className="sidebar-label">
                  Downloads
                  <span className={`record-count ${numDownloads === 0 ? 'gray-bg' : ''}`}>
                    {numDownloads}
                  </span>
                </span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
