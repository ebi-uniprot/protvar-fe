import DefaultPageLayout from '../../layout/DefaultPageLayout'
import {API_URL, TITLE} from '../../../constants/const'
import SearchVariant from './SearchVariant'
import React, {useEffect} from "react";
import BrowseVariant from "./BrowseVariant";

const HomePageContent = () => {

  useEffect(() => {
    document.title = `Home | ${TITLE}`;
  }, []);

  return (
    <>
      <div>
        <p>
          ProtVar (<strong>Prot</strong>ein <strong>Var</strong>iation) is a
          resource to investigate SNV missense variation (not InDels) in humans by presenting
          annotations which may be relevant to interpretation.
          <br/>
          Variants can be submitted below in genomic or protein formats,
          uploaded or accessed via our <a href={API_URL}
                                          title="ProtVar API" target="_self" className='ref-link'>API</a>.
        </p>
      </div>
      <div className='search-page-layout'>
        <SearchVariant/>
        <br/>
        <BrowseVariant/>
      </div>
    </>
  )
}

export const HomePage = () => (
  <DefaultPageLayout content={<HomePageContent />} />
)
export default HomePage
