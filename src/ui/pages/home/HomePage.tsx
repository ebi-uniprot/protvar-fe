import DefaultPageLayout from '../../layout/DefaultPageLayout'
import {TITLE} from '../../../constants/const'
import SearchPage from "./SearchPage";
import React, {useEffect} from "react";

const HomePageContent = () => {

  useEffect(() => {
    document.title = `Home | ${TITLE}`;
  }, []);

  return (
    <>
      <div>
        <p style={{fontSize: '1rem'}}>
          ProtVar (<strong>Prot</strong>ein <strong>Var</strong>iation) helps you explore human missense single‑nucleotide variants (SNVs) by bringing together structural, functional, population, and disease annotations to support variant interpretation.
          Submit variants in genomic or protein notation, browse proteins by identifier, or find proteins by biological description.
        </p>
      </div>

      <SearchPage/>

    </>
  )
}

export const HomePage = () => (
  <DefaultPageLayout content={<HomePageContent />} />
)
export default HomePage
