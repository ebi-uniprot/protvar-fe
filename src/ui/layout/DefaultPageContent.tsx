import { NavLink } from 'react-router-dom'
import {DOWNLOAD, HOME, RESULT} from '../../constants/BrowserPaths'
import {useEffect, useState} from "react";
import ResultHistory, {ResultRecord} from "../components/result/ResultHistory";
import {LOCAL_DOWNLOADS, LOCAL_RESULTS} from "../../constants/const";
import {useLocalStorageContext} from "../../provider/LocalStorageContextProps";
import {DownloadResponse} from "../../types/DownloadResponse";

const DefaultPageContent = (props: {
  children: JSX.Element
  downloadCount: number
}) => {
  const { children, downloadCount } = props
  const { getValue } = useLocalStorageContext();
  const [results, setResults] = useState<ResultRecord[]>(getValue(LOCAL_RESULTS) || [])
  const [downloads, setDownloads] = useState<DownloadResponse[]>(getValue(LOCAL_DOWNLOADS) || [])

  useEffect(() => {
    const handleStorageChange = () => {
      console.log('Storage changed!');
      setResults(getValue(LOCAL_RESULTS) || []);
      setDownloads(getValue(LOCAL_DOWNLOADS) || [])
    };

    // Listen for changes in localStorage
    window.addEventListener('storage', handleStorageChange);

    return () => {
      // Clean up the listener
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [results, getValue]); // Empty dependency array ensures this effect runs once on mount

  return (
    <div className="default-page-content">
      <div className="sidebar">
        <nav>
          <ul>
            <li className="sidebar-menu">
              <NavLink to={HOME}>Search</NavLink>
            </li>
            <li className="sidebar-menu">
              {results && results.length > 0 ?
                <NavLink to={`${RESULT}/${results[0].id}`}>Results <div className="download-count">{results.length}</div></NavLink> :
                <NavLink to={RESULT} className="disabled">Results <div className="download-count">{results.length}</div></NavLink>
              }
              <ResultHistory/>
            </li>
            <li className="sidebar-menu">
              <NavLink to={DOWNLOAD}>Downloads-{downloads.length}  <div className="download-count">{downloadCount}</div></NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <div className="sidebar-content">{children}</div>
    </div>
  )
}

export default DefaultPageContent
