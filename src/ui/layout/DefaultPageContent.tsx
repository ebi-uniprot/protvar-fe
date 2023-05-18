import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom'
import { DOWNLOAD, HOME, SEARCH } from '../../constants/BrowserPaths'

const DefaultPageContent = (props: { children: JSX.Element, downloadCount: number }) => {
  const { pathname } = useLocation();
  const { children, downloadCount } = props;

  return (
    <div className="default-page-content">
      <div className="sidebar">
        <nav>
          <ul>
            <li className="sidebar-menu">
              <NavLink
                to={HOME}
                exact
                activeClassName="active"
              >
                Search
              </NavLink>
            </li>
            <li className="sidebar-menu">
              <NavLink
                to={SEARCH}
                activeClassName={`${pathname === HOME ? '' : 'active' }`}
                className={`${pathname === HOME ? 'disabled' : '' }`}
                // className={`${initialLoading ? 'disabled': ''}`}
              >
                {' '}
                Results{' '}
              </NavLink>
            </li>
            <li className="sidebar-menu">
              <NavLink
                to={DOWNLOAD}
                activeClassName="active"
                className={`${downloadCount ? '': 'disabled'}`}
              >
                {' '}
                My Downloads{' '}({downloadCount})
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <div className="sidebar-content">{children}</div>
    </div>
  )
}

export default DefaultPageContent
