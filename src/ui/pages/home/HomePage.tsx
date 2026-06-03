import DefaultPageLayout from '../../layout/DefaultPageLayout'
import {TITLE} from '../../../constants/const'
import {HELP} from '../../../constants/BrowserPaths'
import SearchPage from "./SearchPage";
import React, {useEffect} from "react";
import {Link} from "react-router-dom";

const HomePageContent = () => {

  useEffect(() => {
    document.title = `Home | ${TITLE}`;
  }, []);

  return (
    <>
      <div className="home-hero">
        <h1 className="home-hero-title">
          <strong>Prot</strong>ein <strong>Var</strong>iation
        </h1>
        <p className="home-hero-lead">
          A resource to investigate SNV missense variation in humans by bringing together
          structural, functional, population, and disease annotations.
        </p>
        <p className="home-hero-sub">
          Submit variants, browse by protein or gene, or search by biological description.
        </p>
      </div>

      <SearchPage/>

      <p className="home-links-pointer">
        Direct-access URL patterns for linking to variants, proteins, and searches are
        documented on the <Link to={HELP}>Help</Link> page.
      </p>

    </>
  )
}

export const HomePage = () => (
  <DefaultPageLayout content={<HomePageContent />} />
)
export default HomePage
