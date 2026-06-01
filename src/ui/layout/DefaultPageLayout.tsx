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

const BASE = process.env.PUBLIC_URL ?? '';

const bannerText = (
  <>
    ProtVar 2 is live — new search modes, and more ways to filter and explore variants.
    Questions or feedback? Email{' '}
    <a href="mailto:protvar@ebi.ac.uk">protvar@ebi.ac.uk</a>.
    <div>
      <i className="bi bi-stars banner-new-icon" />{' '}
      Explore what's new:{' '}
      <a href={`${BASE}/help#browse`}>Advanced Filtering</a>{' · '}
      <a href={`${BASE}/help#semantic-search`}>Semantic Search</a>{' · '}
      <a href={`${BASE}/help#protvar-links`}>ProtVar Links</a>{' · '}
      <a href={`${BASE}/help#predictions`}>Score Radar</a>{' · '}
      <a href={`${BASE}/help#feature-ranking`}>Feature Ranking</a>{' · '}
      <a href={`${BASE}/help#mcp`}>ProtVar MCP</a>
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
            <Navbar onShowBanner={!showBanner ? () => { sessionStorage.removeItem(SESSION_BANNER); setShowBanner(true); } : undefined} />
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
      <Footer />
    </>
  )
}

export default DefaultPageLayout
