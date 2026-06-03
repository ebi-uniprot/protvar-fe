import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {SESSION_BANNER, STORE_DOWNLOADS, STORE_HISTORY} from '../../constants/storage'
import {HELP, RELEASE} from '../../constants/BrowserPaths'
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
    <span className="banner-lead">
      <i className="bi bi-rocket-takeoff-fill banner-new-icon" /> ProtVar 2.0 is live — new search modes,
      and more ways to filter and explore variants. See the{' '}
      <Link to={RELEASE}>release notes</Link> for details.
    </span>{' '}
    Questions or feedback? Email{' '}
    <a href="mailto:protvar@ebi.ac.uk">protvar@ebi.ac.uk</a>.
    <div>
      <i className="bi bi-stars banner-new-icon" />{' '}
      Explore what's new:{' '}
      <Link to={`${HELP}#browse`}>Advanced Filtering</Link>{' · '}
      <Link to={`${HELP}#semantic-search`}>Semantic Search</Link>{' · '}
      <Link to={`${HELP}#protvar-links`}>ProtVar Links</Link>{' · '}
      <Link to={`${HELP}#predictions`}>Score Radar</Link>{' · '}
      <Link to={`${HELP}#feature-ranking`}>Feature Ranking</Link>{' · '}
      <Link to={`${HELP}#mcp`}>ProtVar MCP</Link>
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
