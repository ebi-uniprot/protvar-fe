import {useContext, useEffect, useState} from 'react'
import { NavLink } from 'react-router-dom'
import { DOWNLOAD, HOME, RESULT } from '../../constants/BrowserPaths'
import {AppContext} from "../App";

const DefaultPageContent = (props: {
  children: JSX.Element
  downloadCount: number
}) => {
  const state = useContext(AppContext);
  const [enableResults, setEnableResults] = useState(false)
  const [resultLink, setResultLink] = useState(RESULT)
  const { children, downloadCount } = props

  useEffect(() => {
    if (state.response?.resultId) {
      setResultLink( RESULT + '/' + state.response?.resultId)
      setEnableResults(true)
    }
  }, [state])

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
                <NavLink to={resultLink} activeClassName="active">
                  {' '}
                  Results{' '}
                </NavLink>
              ) : (
                <NavLink
                  to={resultLink}
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
