import { NavLink } from 'react-router-dom'
import {DOWNLOAD, HOME, RESULT} from '../../constants/BrowserPaths'
import {useEffect, useState} from "react";
import ResultHistory from "../pages/result/ResultHistory";
import {LOCAL_DOWNLOADS, LOCAL_RESULTS} from "../../constants/const";
import useLocalStorage from "../../hooks/useLocalStorage";
import {SET_ITEM} from "../../context/LocalStorageContext";

const DefaultPageContent = (props: {
  children: JSX.Element
}) => {
  const { children } = props
  const { getItem } = useLocalStorage();
  const [numResults, setNumResults] = useState<number>((getItem<any[]>(LOCAL_RESULTS) || []).length)
  const [numDownloads, setNumDownloads] = useState<number | null>((getItem<any[]>(LOCAL_DOWNLOADS) || []).length)

  useEffect(() => {
    const handleStorageChange = (e: CustomEvent) => {
      if (e.detail === LOCAL_RESULTS)
        setNumResults((getItem<any[]>(LOCAL_RESULTS) || []).length);
      else if (e.detail === LOCAL_DOWNLOADS)
        setNumDownloads((getItem<any[]>(LOCAL_DOWNLOADS) || []).length)
    };

    // Listen for changes in localStorage
    window.addEventListener(SET_ITEM, handleStorageChange as EventListener);

    return () => {
      // Clean up the listener
      window.removeEventListener(SET_ITEM, handleStorageChange as EventListener);
    };
  }, [getItem]);

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
