import React, {useEffect, useState} from 'react'
import {SESSION_BANNER, STORE_DOWNLOADS, STORE_HISTORY} from '../../constants/storage'
import DefaultPageContent from './DefaultPageContent'
import {SideDrawer} from "./Drawer/SideDrawer";
import Sidebar from "./Sidebar/Sidebar";
import Navbar from "./Header/Navbar";
import Footer from "./Footer/Footer";
import {useStorage, STORAGE_CHANGE} from "../../context/StorageContext";

interface DefaultPageLayoutProps {
  content: React.JSX.Element
}

const bannerText = (
  <>
    This version of ProtVar is in active development. Whilst it allows you
    to take advantage of our latest features, it may also be unstable. Please
    email{" "}
    <a href="mailto:protvar@ebi.ac.uk">protvar@ebi.ac.uk</a> with any problems
    or suggestions, and use the{" "}
    <a href="https://www.ebi.ac.uk/ProtVar/">stable ProtVar version</a> if you
    can't retrieve what you need from this one.

    <div>
      <i className="bi bi-stars banner-new-icon"></i>{' '}
      <a href="/ProtVar/help#protvar-links">ProtVar Links</a> Structure Tab
    </div>
  </>
);

function DefaultPageLayout({ content }: DefaultPageLayoutProps) {
  const [showBanner, setShowBanner] = useState(bannerText != null);
  const { getHistory, getDownloads, getPrefs } = useStorage()
  const [isExpanded, setIsExpanded] = useState(() => getPrefs().sidebarExpanded)
  const [numResults, setNumResults] = useState<number>(() => getHistory().length)
  const [numDownloads, setNumDownloads] = useState<number>(() => getDownloads().length)

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_BANNER)) {
      setShowBanner(false)
    }
  }, [])

  useEffect(() => {
    const handleStorageChange = (e: CustomEvent) => {
      if (e.detail === STORE_HISTORY)
        setNumResults(getHistory().length)
      else if (e.detail === STORE_DOWNLOADS)
        setNumDownloads(getDownloads().length)
    }
    window.addEventListener(STORAGE_CHANGE, handleStorageChange as EventListener)
    return () => window.removeEventListener(STORAGE_CHANGE, handleStorageChange as EventListener)
  }, [getHistory, getDownloads])

  const handleDismiss = () => {
    sessionStorage.setItem(SESSION_BANNER, 'true')
    setShowBanner(false)
  }

  return (
    <>
      <div id="content" className="content">
        <div id="masthead" className="masthead">
          <div className="masthead-inner">
            <Navbar />
          </div>
        </div>

        <main role="main">
          <div className={`default-page-layout${isExpanded ? ' sidebar-expanded' : ''}`}>
            <Sidebar
              numResults={numResults}
              numDownloads={numDownloads}
              onExpandChange={setIsExpanded}
            />

            <SideDrawer/>

            <DefaultPageContent banner={showBanner ? { text: bannerText, onDismiss: handleDismiss } : null}>
              {content}
            </DefaultPageContent>
          </div>
        </main>
      </div>
      <Footer/>
    </>
  )
}

export default DefaultPageLayout
