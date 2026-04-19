import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ACTIVITY, HOME } from '../../../constants/BrowserPaths';
import RecentResult from '../../pages/result/RecentResult';
import { useStorage } from '../../../context/StorageContext';

interface DockableSidebarProps {
  numResults: number;
  numDownloads: number;
  onExpandChange?: (isExpanded: boolean) => void;
}

const DockableSidebar: React.FC<DockableSidebarProps> = ({
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

  useEffect(() => {
    setPrefs({ sidebarExpanded: isExpanded })
    onExpandChange?.(isExpanded)
  }, [isExpanded, onExpandChange, setPrefs])

  const toggleExpanded = () => setIsExpanded(prev => !prev)

  return (
    <>
      {/* Mobile icon strip */}
      <nav className="mobile-nav-strip" aria-label="Mobile navigation">
        <NavLink to={HOME} className="mobile-nav-item">
          <i className="bi bi-search" />
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
              <NavLink to={HOME} className="sidebar-link">
                <i className="bi bi-search" />
                <span className="sidebar-label">Search</span>
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
              {isExpanded && <RecentResult />}
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

export default DockableSidebar;
