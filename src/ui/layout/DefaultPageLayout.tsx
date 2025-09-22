import '../../styles/index.scss';
import React, {useEffect, useState} from 'react'
import {LOCAL_BANNER, LOCAL_DOWNLOADS, LOCAL_RESULTS, LOCAL_SIDEBAR} from '../../constants/const'
import DefaultPageContent from './DefaultPageContent'
import {SideDrawer} from "./Drawer/SideDrawer";
import DockableSidebar from "./Sidebar/DockableSidebar";
import Navbar from "./Header/Navbar";
import Footer from "./Footer/Footer";
import VersionInfo from "./VersionInfo";
import useLocalStorage from "../../hooks/useLocalStorage";
import {SET_ITEM} from "../../context/LocalStorageContext";

interface DefaultPageLayoutProps {
  content: React.JSX.Element
}

const bannerText = null

function DefaultPageLayout(props: DefaultPageLayoutProps) {
  const [showBanner, setShowBanner] = useState(bannerText != null);
  // to re-enable banner, uncomment state above, and the lines within
  // the handleDismiss function
  //const showBanner = false
  const [isDocked, setIsDocked] = useState(false);
  const { getItem } = useLocalStorage();
  const [numResults, setNumResults] = useState<number>((getItem<any[]>(LOCAL_RESULTS) || []).length)
  const [numDownloads, setNumDownloads] = useState<number | null>((getItem<any[]>(LOCAL_DOWNLOADS) || []).length)

  useEffect(() => {
    const win: any = window
    if (win.ebiFrameworkInvokeScripts) {
      win.ebiFrameworkInvokeScripts()
    }

    const bannerDismissed = sessionStorage.getItem(LOCAL_BANNER);
    if (bannerDismissed) {
      setShowBanner(false);
    }

    // Check if sidebar was docked on page load
    const savedState = localStorage.getItem(LOCAL_SIDEBAR);
    if (savedState === 'docked') {
      setIsDocked(true);
    }
  }, [])

  useEffect(() => {
    const handleStorageChange = (e: CustomEvent) => {
      if (e.detail === LOCAL_RESULTS)
        setNumResults((getItem<any[]>(LOCAL_RESULTS) || []).length);
      else if (e.detail === LOCAL_DOWNLOADS)
        setNumDownloads((getItem<any[]>(LOCAL_DOWNLOADS) || []).length)
    };

    window.addEventListener(SET_ITEM, handleStorageChange as EventListener);
    return () => {
      window.removeEventListener(SET_ITEM, handleStorageChange as EventListener);
    };
  }, [getItem]);

  const {content} = props;

  const handleDismiss = () => {
    sessionStorage.setItem(LOCAL_BANNER, 'true');
    setShowBanner(false);
  }

  const handleDockChange = (docked: boolean) => {
    setIsDocked(docked);
  }

  return (
    <>
      <VersionInfo />

      <div id="content" className="content">
        <div id="masthead" className="masthead">
          <div className="masthead-inner row">
            <Navbar />
          </div>
        </div>

        <main className={`row ${isDocked ? 'layout-with-docked-sidebar' : 'layout-without-docked-sidebar'}`} role="main">
          {showBanner && (
            <div className="banner">
              <button className="dismiss-button" onClick={handleDismiss}>
                ×
              </button>
              <div className="banner-content">{bannerText}</div>
            </div>
          )}

          <div className="default-page-layout">
            {/* Dockable left sidebar for navigation */}
            <DockableSidebar
              numResults={numResults}
              numDownloads={numDownloads}
              onDockChange={handleDockChange}
            />

            {/* Right drawer for dynamic content */}
            <SideDrawer/>

            <DefaultPageContent isDocked={isDocked}>{content}</DefaultPageContent>
          </div>
        </main>
      </div>
      <Footer/>
    </>
  )
}

export default DefaultPageLayout