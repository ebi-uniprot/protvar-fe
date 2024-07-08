import React, {createContext, ReactElement, useState} from "react";
import {Route, Routes} from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import APIErrorPage from "./pages/APIErrorPage";
import AboutPage from "./pages/AboutPage";
import ReleasePage from "./pages/ReleasePage";
import ContactPage from "./pages/ContactPage";
import {ABOUT, API_ERROR, CONTACT, DOWNLOAD, HELP, HOME, QUERY, RELEASE, RESULT} from "../constants/BrowserPaths";
import QueryPage from "./pages/query/QueryPage";
import {Assembly} from "../constants/CommonTypes";
import DownloadPage from "./pages/download/DownloadPage";
import HelpPage from "./pages/help/HelpPage";
import {PagedMappingResponse, ResultType} from "../types/PagedMappingResponse";
import ResultPage from "./pages/result/ResultPage";
import "bootstrap-icons/font/bootstrap-icons.css"
import ResultListPage from "./pages/result/ResultListPage";
import {LocalStorageProvider} from "../context/LocalStorageContext";
import {DEFAULT_PAGE_SIZE} from "../constants/const";

const empty: ReactElement = <></>;

export interface AppState {
  stdColor: boolean
  showModal: boolean
  modalContent: JSX.Element
  // V2
  textInput: string
  file: File | null
  assembly: Assembly
  pageSize: number
  response: PagedMappingResponse | null
  updateState: (key: string, value: any) => void
}

export const initialState = {
  stdColor: true,
  showModal: false,
  modalContent: empty,
  // V2
  textInput: "",
  file: null,
  assembly: Assembly.AUTO,
  pageSize: DEFAULT_PAGE_SIZE, // needs to be localStore, not appState
  response: null,
  updateState: (key: string, value: any) => {}
}

export const AppContext = createContext(initialState)

export const APP_URL =   `${window.location.origin}${process.env.PUBLIC_URL}`

export default function App() {

  const updateState = (key: string, value: any) => {
    setAppState(prevState => {
      return {
        ...prevState,
        [key]: value
      }
    })
  }

  const [appState, setAppState] = useState({
    ...initialState,
    updateState
  });

  return (<AppContext.Provider value={appState}>
    <LocalStorageProvider>
    <Routes>
      <Route path={HOME} element={<HomePage />} />
      <Route path={`${RESULT}`} element={<ResultListPage />} />
      <Route path={`${RESULT}/:id`} element={<ResultPage type={ResultType.SEARCH} />} />
      <Route path={QUERY} element={<QueryPage />} />
      <Route path={API_ERROR} element={<APIErrorPage />} />
      <Route path={ABOUT} element={<AboutPage />} />
      <Route path={RELEASE} element={<ReleasePage />} />
      <Route path={CONTACT} element={<ContactPage />} />
      <Route path={DOWNLOAD} element={<DownloadPage />} />
      <Route path={HELP} element={<HelpPage />} />
      <Route path="/:id" element={<ResultPage  type={ResultType.PROTEIN} />} />
    </Routes>
      </LocalStorageProvider>
    </AppContext.Provider>);
}