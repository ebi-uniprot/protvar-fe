import { NavLink } from 'react-router-dom'
import {DOWNLOAD, HOME, RESULT} from '../../constants/BrowserPaths'
import {useEffect, useState} from "react";
import ResultHistory, {ResultRecord} from "../components/result/ResultHistory";
import {LOCAL_RESULTS} from "../../constants/const";
import {useLocalStorageContext} from "../../provider/LocalStorageContextProps";

const DefaultPageContent = (props: {
  children: JSX.Element
  downloadCount: number
}) => {
  const { children, downloadCount } = props
  const { getValue } = useLocalStorageContext();
  const savedRecords = getValue<ResultRecord[]>(LOCAL_RESULTS) || [];
  const [enableLink, setEnableLink] = useState(false)
  const [link, setLink] = useState(RESULT)
  const [resultsCount, setResultsCount] = useState(savedRecords.length)

  // results count not being refreshed when record is deleted from
  // the sidebar
  useEffect(() => {
    if (savedRecords && savedRecords[0]) {
      setLink(`${RESULT}/${savedRecords[0].id}`)
      setEnableLink(true)
      setResultsCount(savedRecords.length)
    }
  }, [savedRecords]);

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
                <NavLink to={link}>Results <div className="download-count">{resultsCount}</div></NavLink> :
                <NavLink to={link} className="disabled">Results <div className="download-count">{resultsCount}</div></NavLink>
              }
              <ResultHistory/>
            </li>
            <li className="sidebar-menu">
              <NavLink to={DOWNLOAD}>Downloads <div className="download-count">{downloadCount}</div></NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <div className="sidebar-content">{children}</div>
    </div>
  )
}

export default DefaultPageContent
