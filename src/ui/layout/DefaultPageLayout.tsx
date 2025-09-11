import '../../styles/index.scss';
import React, {useEffect, useState} from 'react'
import {LOCAL_BANNER} from '../../constants/const'
import DefaultPageContent from './DefaultPageContent'
import {SideDrawer} from "../components/drawer/SideDrawer";
import ReleaseDropdown from "./ReleaseDropdown";
import Navbar from "./Navbar";
import Footer from "./Footer";

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
      <div id="skip-to">
        <a href="#content">Skip to main content</a>
      </div>

      {/* Below is the EBI master header content. Restore it if there are any concerns */}
      {/* <header id="masthead-black-bar" className="clearfix masthead-black-bar">
      <nav className="row">
        <ul id="global-nav" className="menu global-nav text-right">
          <li key="logo" className="home-mobile">
            <a href="//www.ebi.ac.uk">EMBL-EBI</a>
          </li>
          <li key="home" className="home">
            <a href="//www.ebi.ac.uk">EMBL-EBI</a>
          </li>
          <li key="services" className="services">
            <a href="//www.ebi.ac.uk/services">Services</a>
          </li>
          <li key="research" className="research">
            <a href="//www.ebi.ac.uk/research">Research</a>
          </li>
          <li key="training" className="training">
            <a href="//www.ebi.ac.uk/training">Training</a>
          </li>
          <li key="about" className="about">
            <a href="//www.ebi.ac.uk/about">About us</a>
          </li>
          <li
            id="embl-selector"
            className="float-right show-for-medium embl-selector embl-ebi active"
          >
            <button className="button float-right">&nbsp;</button>
          </li>
        </ul>
      </nav>
    </header> */}
      <ReleaseDropdown />

      <div id="content" className="content">
        <div data-sticky-container>
          <div
            id="masthead"
            className="masthead"
            data-sticky
            data-sticky-on="large"
            data-top-anchor="main-content-area:top"
            data-btm-anchor="main-content-area:bottom"
          >
            <div className="masthead-inner row">
              <Navbar />
            </div>
          </div>
        </div>

        <section className="row" role="main">
          <div id="main-content-area" className="main-content-area row">
            <div className="small-12 columns">
              {showBanner && (
                <div className="banner">
                  <button
                    className="dismiss-button"
                    onClick={handleDismiss}
                  >
                    X
                  </button>

                  <div className="banner-content">
                    {bannerText}
                  </div>
                </div>
              )}

              <div className="default-page-layout">
                <SideDrawer/>
                <DefaultPageContent>
                  {content}
                </DefaultPageContent>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}

export default DefaultPageLayout
