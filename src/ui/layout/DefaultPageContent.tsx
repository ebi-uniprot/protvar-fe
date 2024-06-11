import { NavLink } from 'react-router-dom'
import { DOWNLOAD, HOME } from '../../constants/BrowserPaths'
import {useContext, useEffect, useState} from "react";
import {AppContext, AppState} from "../App";

const DefaultPageContent = (props: {
  children: JSX.Element
  downloadCount: number
}) => {
  const state: AppState = useContext(AppContext)
  const { children, downloadCount } = props
  const [enableLink, setEnableLink] = useState(false)
  const [link, setLink] = useState("/home/result")

  useEffect(() => {
    if (state.response && state.response.resultId) {
      setLink("/home/result/" + state.response.resultId)
      setEnableLink(true)
    }
  }, [state]);

  return (
    <div className="default-page-content">
      <div className="sidebar">
        <nav>
          <ul>
            <li className="sidebar-menu">
              <NavLink to={HOME}>Search</NavLink>
            </li>
            <li className="sidebar-menu">
              {enableLink ?
                <NavLink to={link}>Results</NavLink> :
                <NavLink to={link} className="disabled">Results</NavLink>
              }
            </li>
            <li className="sidebar-menu">
              <NavLink to={DOWNLOAD}>Downloads ({downloadCount})</NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <div className="sidebar-content">{children}</div>
    </div>
  )
}

export default DefaultPageContent
