import React, {createContext, ReactElement, useState} from "react";
import {Route, Routes} from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import APIErrorPage from "./pages/APIErrorPage";
import AboutPage from "./pages/AboutPage";
import ReleasePage from "./pages/ReleasePage";
import ContactPage from "./pages/ContactPage";
import {ABOUT, ACTIVITY, API_ERROR, CONTACT, DOWNLOAD, G_QUERY, HELP, HOME, ID_ENSEMBL, ID_GENE, ID_PDB, ID_REFSEQ, P_QUERY, QUERY, RELEASE, RESULT, SEARCH} from "../constants/BrowserPaths";
import DownloadPage from "./pages/download/DownloadPage";
import HelpPage from "./pages/help/HelpPage";
import {PagedMappingResponse} from "../types/PagedMappingResponse";
import ResultPage from "./pages/result/ResultPage";
import "bootstrap-icons/font/bootstrap-icons.css"
import ResultListPage from "./pages/result/ResultListPage";
import ActivityPage from "./pages/activity/ActivityPage";
import {StorageProvider} from "../context/StorageContext";
import {StatsProvider} from "../context/StatsContext";
import {DEFAULT_PAGE_SIZE} from "../constants/const";
import NotFoundPage from "./pages/NotFoundPage";
import {MarkdownProvider} from "../context/MarkdownContext";
import '../styles/index.css';
import { ToastContainer } from './toast/ToastContainer';

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
    <StorageProvider>
      <MarkdownProvider>
        <StatsProvider>
        <ToastContainer />
        <Routes>
          <Route path={HOME} element={<HomePage />} />
          <Route path={`${RESULT}`} element={<ResultListPage />} />

          {/* Route for user inputId - result/{inputId} */}
          <Route path={`${RESULT}/:input`} element={<ResultPage />} />

          {/* /search — mode auto-detected: ?q= → variant query, ?id= → multi-id browse, neither → filter-only */}
          <Route path={SEARCH} element={<ResultPage queryType="search" />} />
          {/* Backward compat: /query → same handler */}
          <Route path={QUERY} element={<ResultPage queryType="search" />} />

          {/* Type-prefixed identifier browse */}
          <Route path={`${ID_GENE}/:id`} element={<ResultPage idType="gene" />} />
          <Route path={`${ID_PDB}/:id`} element={<ResultPage idType="pdb" />} />
          <Route path={`${ID_ENSEMBL}/:id`} element={<ResultPage idType="ensembl" />} />
          <Route path={`${ID_REFSEQ}/:id`} element={<ResultPage idType="refseq" />} />

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
          <Route path={ACTIVITY} element={<ActivityPage />} />
          <Route path={DOWNLOAD} element={<DownloadPage />} />
          <Route path={HELP} element={<HelpPage />} />

          {/* Whole-protein / identifier browse: /:accession */}
          <Route path="/:input" element={<ResultPage />} />

          {/* Catch-all route for anything not matched above */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </StatsProvider>
      </MarkdownProvider>
      </StorageProvider>
    </AppContext.Provider>);
}