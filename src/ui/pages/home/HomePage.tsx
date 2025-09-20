import DefaultPageLayout from '../../layout/DefaultPageLayout'
import {API_URL, TITLE} from '../../../constants/const'
import SearchPage from "./SearchPage";
import React, {useEffect} from "react";
import './HomePage.css'

const HomePageContent = () => {

  useEffect(() => {
    document.title = `Home | ${TITLE}`;
  }, []);

  return (
    <>
      <div>
        <p style={{fontSize: '1rem'}}>
          ProtVar (<strong>Prot</strong>ein <strong>Var</strong>iation) helps you explore human missense
          single‑nucleotide variants (SNVs)
          by bringing together annotations to support variant interpretation. {/*It does not cover insertions
          or deletions (indels).*/}
        </p>

        <a href={API_URL} style={{justifyContent: 'center', display: 'flex', alignItems: 'center'}}
           title="ProtVar API" target="_self" className="api-button">
          <i className="bi bi-box"></i>
          API Docs
        </a>


      </div>

      <SearchPage/>

    </>
  )
}

export const HomePage = () => (
  <DefaultPageLayout content={<HomePageContent />} />
)
export default HomePage
