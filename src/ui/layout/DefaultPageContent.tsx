import { NavLink } from 'react-router-dom'
import {DOWNLOAD, HOME, RESULT} from '../../constants/BrowserPaths'
import {useEffect, useState} from "react";
import ResultHistory from "../components/result/ResultHistory";
import {LOCAL_DOWNLOADS, LOCAL_RESULTS} from "../../constants/const";
import {LOCAL_STORAGE_SET, useLocalStorageContext} from "../../provider/LocalStorageContextProps";
import {DownloadRecord} from "../../types/DownloadRecord";
import {ResultRecord} from "../../types/ResultRecord";

const DefaultPageContent = (props: {
  children: JSX.Element
}) => {
  const { children } = props
  const { getValue } = useLocalStorageContext();
  const [results, setResults] = useState<ResultRecord[]>(getValue(LOCAL_RESULTS) || [])
  const [downloads, setDownloads] = useState<DownloadRecord[]>(getValue(LOCAL_DOWNLOADS) || [])

  useEffect(() => {
    const handleStorageChange = (e: CustomEvent) => {
      if (e.detail === LOCAL_RESULTS)
        setResults(getValue(LOCAL_RESULTS) || []);
      else if (e.detail === LOCAL_DOWNLOADS)
        setDownloads(getValue(LOCAL_DOWNLOADS) || [])
    };

    // Listen for changes in localStorage
    window.addEventListener(LOCAL_STORAGE_SET, handleStorageChange as EventListener);

    return () => {
      // Clean up the listener
      window.removeEventListener(LOCAL_STORAGE_SET, handleStorageChange as EventListener);
    };
  }, [results, getValue]);

  return (
    <div className="default-page-content">
      <div className="sidebar">
        <nav>
          <ul>
            <li className="sidebar-menu">
              <NavLink to={HOME}>Search</NavLink>
            </li>
            <li className="sidebar-menu">
              <NavLink to={RESULT}>Results <div className={`record-count ${results.length === 0 ? `gray-bg` : ``}`}>{results.length}</div></NavLink>
              <ResultHistory/>
            </li>
            <li className="sidebar-menu">
              <NavLink to={DOWNLOAD}>Downloads <div className={`record-count ${downloads.length === 0 ? `gray-bg` : ``}`}>{downloads.length}</div></NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <div className="sidebar-content">{children}</div>
    </div>
  )
}

export default DefaultPageContent
