import { NavLink } from 'react-router-dom'
import {DOWNLOAD, HOME, RESULT} from '../../constants/BrowserPaths'
import {useEffect, useState} from "react";
import ResultHistory from "../components/result/ResultHistory";
import {LOCAL_DOWNLOADS, LOCAL_RESULTS} from "../../constants/const";
import {LOCAL_STORAGE_SET, useLocalStorageContext} from "../../provider/LocalStorageContextProps";

const DefaultPageContent = (props: {
  children: JSX.Element
}) => {
  const { children } = props

  const { getValue } = useLocalStorageContext();
  const [numResults, setNumResults] = useState<number>((getValue<any[]>(LOCAL_RESULTS) || []).length)
  const [numDownloads, setNumDownloads] = useState<number | null>((getValue<any[]>(LOCAL_DOWNLOADS) || []).length)

  useEffect(() => {
    const handleStorageChange = (e: CustomEvent) => {
      if (e.detail === LOCAL_RESULTS)
        setNumResults((getValue<any[]>(LOCAL_RESULTS) || []).length);
      else if (e.detail === LOCAL_DOWNLOADS)
        setNumDownloads((getValue<any[]>(LOCAL_DOWNLOADS) || []).length)
    };

    // Listen for changes in localStorage
    window.addEventListener(LOCAL_STORAGE_SET, handleStorageChange as EventListener);

    return () => {
      // Clean up the listener
      window.removeEventListener(LOCAL_STORAGE_SET, handleStorageChange as EventListener);
    };
  }, [getValue]);

  return (
    <div className="default-page-content">
      <div className="sidebar">
        <nav>
          <ul>
            <li className="sidebar-menu">
              <NavLink to={HOME}>Search</NavLink>
            </li>
            <li className="sidebar-menu">
              <NavLink to={RESULT}>Results <div className={`record-count ${numResults === 0 ? `gray-bg` : ``}`}>{numResults}</div></NavLink>
              <ResultHistory/>
            </li>
            <li className="sidebar-menu">
              <NavLink to={DOWNLOAD}>Downloads <div className={`record-count ${numDownloads === 0 ? `gray-bg` : ``}`}>{numDownloads}</div></NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <div className="sidebar-content">{children}</div>
    </div>
  )
}

export default DefaultPageContent
