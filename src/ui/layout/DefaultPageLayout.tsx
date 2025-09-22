import '../../styles/index.scss';
import React, {useEffect, useState} from 'react'
import {LOCAL_BANNER} from '../../constants/const'
import DefaultPageContent from './DefaultPageContent'
import {SideDrawer} from "./Drawer/SideDrawer";
import Navbar from "./Header/Navbar";
import Footer from "./Footer/Footer";
import VersionInfo from "./VersionInfo";

interface DefaultPageLayoutProps {
  content: React.JSX.Element
}


const bannerText = null

function DefaultPageLayout(props: DefaultPageLayoutProps) {
  const [showBanner, setShowBanner] = useState(bannerText != null);
  // to re-enable banner, uncomment state above, and the lines within
  // the handleDismiss function
  //const showBanner = false

  useEffect(() => {
    const win: any = window
    if (win.ebiFrameworkInvokeScripts) {
      win.ebiFrameworkInvokeScripts()
    }

    const bannerDismissed = sessionStorage.getItem(LOCAL_BANNER);
    if (bannerDismissed) {
      setShowBanner(false);
    }
  }, [])

  const {content} = props;

  const handleDismiss = () => {
    sessionStorage.setItem(LOCAL_BANNER, 'true');
    setShowBanner(false);
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

        <main className="row" role="main">
          {showBanner && (
            <div className="banner">
              <button className="dismiss-button" onClick={handleDismiss}>
                ×
              </button>
              <div className="banner-content">{bannerText}</div>
            </div>
          )}

          <div className="default-page-layout">
            <SideDrawer/>
            <DefaultPageContent>{content}</DefaultPageContent>
          </div>
        </main>
      </div>
      <Footer/>
    </>
  )
}

export default DefaultPageLayout
