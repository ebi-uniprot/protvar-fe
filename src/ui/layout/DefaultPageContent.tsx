import { NavLink } from 'react-router-dom'
import { DOWNLOAD, HOME, SEARCH } from '../../constants/BrowserPaths'

const DefaultPageContent = (props: { children: JSX.Element, downloadCount: number }) => {
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
                activeClassName="active"
              >
                {' '}
                Results{' '}
              </NavLink>
            </li>
            <li className="sidebar-menu">
              <NavLink
                
                to={DOWNLOAD}
                activeClassName="active"
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
