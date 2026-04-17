import React, {createContext, ReactElement, useState} from "react";
import {Route, Routes} from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import APIErrorPage from "./pages/APIErrorPage";
import AboutPage from "./pages/AboutPage";
import ReleasePage from "./pages/ReleasePage";
import ContactPage from "./pages/ContactPage";
import {ABOUT, API_ERROR, CONTACT, DOWNLOAD, G_QUERY, HELP, HOME, P_QUERY, QUERY, RELEASE, RESULT, SEARCH} from "../constants/BrowserPaths";
import DownloadPage from "./pages/download/DownloadPage";
import HelpPage from "./pages/help/HelpPage";
import {PagedMappingResponse} from "../types/PagedMappingResponse";
import ResultPage from "./pages/result/ResultPage";
import "bootstrap-icons/font/bootstrap-icons.css"
import ResultListPage from "./pages/result/ResultListPage";
import {LocalStorageProvider} from "../context/LocalStorageContext";
import {StatsProvider} from "../context/StatsContext";
import {DEFAULT_PAGE_SIZE} from "../constants/const";
import NotFoundPage from "./pages/NotFoundPage";
import {MarkdownProvider} from "../context/MarkdownContext";
import '../styles/new/index.css';

const empty: ReactElement = <></>;

export interface AppState {
  drawer?: React.JSX.Element
  stdColor: boolean
  showModal: boolean
  modalContent: React.JSX.Element
  // V2
  //textInput: string
  //file: File | null
  //assembly: GenomeAssembly
  pageSize: number
  response: PagedMappingResponse | null
  updateState: (key: string, value: any) => void
}

export const initialState = {
  drawer: undefined,
  stdColor: true,
  showModal: false,
  modalContent: empty,
  // V2
  //textInput: '',
  //file: null,
  //assembly: 'auto',
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
      <MarkdownProvider>
        <StatsProvider>
        <Routes>
          <Route path={HOME} element={<HomePage />} />
          <Route path={`${RESULT}`} element={<ResultListPage />} />

          {/* Route for user inputId - result/{inputId} */}
          <Route path={`${RESULT}/:input`} element={<ResultPage />} />

          {/* Primary search route */}
          <Route path={SEARCH} element={<ResultPage mode="query" queryType="search" />} />
          {/* Backward compat: /query → same handler */}
          <Route path={QUERY} element={<ResultPage mode="query" queryType="search" />} />

          {/* Direct genomic path: /g/:chr/:pos[/:ref/:alt] */}
          <Route
            path={`${G_QUERY}/:param1/:param2/:param3?/:param4?`}
            element={<ResultPage mode="query" queryType="genomic" />}
          />
          {/* Direct protein path: /p/:acc/:pos[/:ref/:alt] */}
          <Route
            path={`${P_QUERY}/:param1/:param2/:param3?/:param4?`}
            element={<ResultPage mode="query" queryType="protein" />}
          />

          {/* Backward compat: old /:chr/:pos and /:acc/:pos path forms */}
          <Route
            path="/:param1/:param2/:param3?/:param4?"
            element={<ResultPage mode="query" queryType="chromosome_protein" />}
          />

          <Route path={API_ERROR} element={<APIErrorPage />} />
          <Route path={ABOUT} element={<AboutPage />} />
          <Route path={RELEASE} element={<ReleasePage />} />
          <Route path={CONTACT} element={<ContactPage />} />
          <Route path={DOWNLOAD} element={<DownloadPage />} />
          <Route path={HELP} element={<HelpPage />} />

          {/* Whole-protein / identifier browse: /:accession */}
          <Route path="/:input" element={<ResultPage />} />

          {/* Catch-all route for anything not matched above */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </StatsProvider>
      </MarkdownProvider>
      </LocalStorageProvider>
    </AppContext.Provider>);
}