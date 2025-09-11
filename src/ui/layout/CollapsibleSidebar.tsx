import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { DOWNLOAD, HOME, RESULT } from '../../constants/BrowserPaths';
import RecentResult from '../pages/result/RecentResult';
import Spaces from '../elements/Spaces';
import './CollapsibleSidebar.css';

interface CollapsibleSidebarProps {
  numResults: number;
  numDownloads: number|null;
}

const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({
                                                                 numResults,
                                                                 numDownloads
                                                               }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        className={`sidebar-toggle ${isOpen ? 'open' : ''}`}
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
        title={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        <i className={`bi ${isOpen ? 'bi-x' : 'bi-list'}`}></i>
      </button>

      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <nav className="sidebar-nav">
          <ul className="sidebar-menu-list">
            <li className="sidebar-menu-item">
              <NavLink to={HOME} className="sidebar-link">
                <i className="bi bi-search"></i>
                <Spaces count={2} />
                Search
              </NavLink>
            </li>
            <li className="sidebar-menu-item">
              <NavLink to={RESULT} className="sidebar-link">
                <i className="bi bi-files"></i>
                <Spaces count={2}/>
                Search History
                <div className={`record-count ${numResults === 0 ? 'gray-bg' : ''}`}>
                  {numResults}
                </div>
              </NavLink>
              <RecentResult />
            </li>
            <li className="sidebar-menu-item">
              <NavLink to={DOWNLOAD} className="sidebar-link">
                <i className="bi bi-download"></i>
                <Spaces count={2}/>
                Downloads
                <div className={`record-count ${numDownloads === 0 ? 'gray-bg' : ''}`}>
                  {numDownloads}
                </div>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default CollapsibleSidebar;