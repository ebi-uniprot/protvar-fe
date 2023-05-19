import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { DOWNLOAD, HOME, SEARCH } from '../../constants/BrowserPaths'
import { MappingRecord } from '../../utills/Convertor'

const DefaultPageContent = (props: {
  children: JSX.Element
  downloadCount: number
  searchResults: MappingRecord[][][]
}) => {
  const [enableResults, setEnableResults] = useState(false)
  const { children, downloadCount, searchResults } = props
  useEffect(() => {
    if (searchResults?.length) {
      setEnableResults(true)
    }
  }, [searchResults])

  return (
    <div className="default-page-content">
      <div className="sidebar">
        <nav>
          <ul>
            <li className="sidebar-menu">
              <NavLink to={HOME} exact activeClassName="active">
                Search
              </NavLink>
            </li>
            <li className="sidebar-menu">
              {enableResults ? (
                <NavLink to={SEARCH} activeClassName="active">
                  {' '}
                  Results{' '}
                </NavLink>
              ) : (
                <NavLink
                  to={SEARCH}
                  className={'disabled'}
                >
                  {' '}
                  Results{' '}
                </NavLink>
              )}
            </li>
            <li className="sidebar-menu">
              <NavLink
                to={DOWNLOAD}
                activeClassName="active"
              >
                {' '}
                My Downloads ({downloadCount})
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
