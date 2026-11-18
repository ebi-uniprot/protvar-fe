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
import { Icon } from '../elements/Icon';

/** Grid column between the app sidebar and the page content; a page portals a side panel into it. */
export const SIDE_PANEL_ID = 'page-side-panel'

interface DefaultPageLayoutProps {
  content: React.JSX.Element
}

const bannerText = (
  <>
    <span className="banner-lead">
      <Icon name="rocket-takeoff-fill" className="banner-new-icon" /> ProtVar 3.0 — UniProt 2026_02 data,
      AlphaGenome Variant Impact (AVI) and Pangolin splice scores, UniProt variant IDs (VAR_) as input, and you can
      now filter and sort your own uploaded variants. See
      the{' '}<Link to={`${RELEASE}?tab=notes`}>release notes</Link> for details.
    </span>{' '}
    Questions or feedback? Email{' '}
    <a href="mailto:protvar@ebi.ac.uk">protvar@ebi.ac.uk</a>.
    <div>
      <Icon name="stars" className="banner-new-icon" />{' '}
      Explore what's new:{' '}
      <Link to={`${HELP}#browse`}>Filter your uploads</Link>{' · '}
      <Link to={`${HELP}#predictions`}>AVI &amp; Pangolin scores</Link>{' · '}
      <Link to={`${HELP}#results`}>Choose result columns</Link>{' · '}
      <Link to={`${HELP}#semantic-search`}>Semantic search models</Link>{' · '}
      <Link to={RELEASE}>Statistics</Link>
    </div>
  </>
);

function DefaultPageLayout({ content }: DefaultPageLayoutProps) {
  // Read the dismissal up front: each page mounts its own layout, so starting from "shown" and hiding it in an
  // effect would replay the slide-closed animation on every navigation.
  const [showBanner, setShowBanner] = useState(() => bannerText != null && !sessionStorage.getItem(SESSION_BANNER));
  const { getHistory, getDownloads, getPrefs } = useStorage()
  const [isExpanded, setIsExpanded] = useState(() => getPrefs().sidebarExpanded)
  const [numResults, setNumResults] = useState<number>(() => getHistory().length)
  const [numDownloads, setNumDownloads] = useState<number>(() => getDownloads().length)

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
        {/* Announcement: full width above the masthead, dismissible for the session */}
        {/* Stays mounted so hiding / showing it can slide (see .banner-slide) */}
        <div className={`banner-slide${showBanner ? ' open' : ''}`}>
          <div className="banner-slide-inner">
            <div className="banner">
              <button className="dismiss-button" onClick={handleDismiss} aria-label="Dismiss">
                <Icon name="x" />
              </button>
              <div className="banner-content">{bannerText}</div>
            </div>
          </div>
        </div>

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

            <div id={SIDE_PANEL_ID} className="page-side-panel"/>

            <DefaultPageContent>
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
