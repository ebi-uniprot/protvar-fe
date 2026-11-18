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
      <SearchPage/>

    </>
  )
}

export const HomePage = () => (
  <DefaultPageLayout content={<HomePageContent />} />
)
export default HomePage
