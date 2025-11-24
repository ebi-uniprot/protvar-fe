import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { DOWNLOAD, HOME, RESULT } from '../../../constants/BrowserPaths';
import RecentResult from '../../pages/result/RecentResult';
import Spaces from '../../elements/Spaces';
import './DockableSidebar.css';
import {LOCAL_SIDEBAR} from "../../../constants/const";

interface DockableSidebarProps {
  numResults: number;
  numDownloads: number | null;
  onDockChange?: (isDocked: boolean) => void;
}

type SidebarState = 'closed' | 'overlay' | 'docked';

const DockableSidebar: React.FC<DockableSidebarProps> = ({
                                                           numResults,
                                                           numDownloads,
                                                           onDockChange
                                                         }) => {
  const [sidebarState, setSidebarState] = useState<SidebarState>('closed');

  // Load docked state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(LOCAL_SIDEBAR);
    if (savedState === 'docked') {
      setSidebarState('docked');
    }
  }, []);

  // Save docked state to localStorage and notify parent
  useEffect(() => {
    if (sidebarState === 'docked') {
      localStorage.setItem(LOCAL_SIDEBAR, 'docked');
      onDockChange?.(true);
    } else {
      localStorage.removeItem(LOCAL_SIDEBAR);
      onDockChange?.(false);
    }
  }, [sidebarState, onDockChange]);

  const toggleSidebar = () => {
    setSidebarState(prev => {
      if (prev === 'closed') return 'overlay';
      if (prev === 'overlay') return 'closed';
      return 'closed'; // docked stays docked unless explicitly undocked
    });
  };

  const dockSidebar = () => {
    setSidebarState('docked');
  };

  const undockSidebar = () => {
    setSidebarState('overlay');
  };

  const closeSidebar = () => {
    setSidebarState('closed');
  };

  //const isOpen = sidebarState === 'overlay' || sidebarState === 'docked';
  const isDocked = sidebarState === 'docked';

  return (
    <>
      {/* Sidebar Open Button */}
      {sidebarState === 'closed' && (
        <button
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label="Open sidebar"
          title="Open sidebar"
        >
          <i className="bi bi-list"></i>
        </button>
      )}


      {/* Overlay for mobile/overlay mode */}
      {sidebarState === 'overlay' && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarState}`}>
        <div className="sidebar-header">
          <div className="sidebar-controls">
            {!isDocked && (
              <button
                className="sidebar-control-btn dock-btn"
                onClick={dockSidebar}
                title="Dock sidebar"
              >
                <i className="bi bi-pin-angle"></i>
                <span>Dock</span>
              </button>
            )}

            {isDocked && (
              <button
                className="sidebar-control-btn undock-btn"
                onClick={undockSidebar}
                title="Undock sidebar"
              >
                <i className="bi bi-pin"></i>
                <span>Undock</span>
              </button>
            )}

            <button
              className="sidebar-control-btn close-btn"
              onClick={closeSidebar}
              title="Close sidebar"
            >
              <i className="bi bi-x-lg"></i>
              {isDocked && <span>Close</span>}
            </button>
          </div>
        </div>

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
                <i className="bi bi-clock-history"></i>
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

export default DockableSidebar;