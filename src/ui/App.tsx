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
import {InputType, PagedMappingResponse} from "../types/PagedMappingResponse";
import ResultPage from "./pages/result/ResultPage";
import "bootstrap-icons/font/bootstrap-icons.css"
import ResultListPage from "./pages/result/ResultListPage";
import {LocalStorageProvider} from "../context/LocalStorageContext";
import {DEFAULT_PAGE_SIZE} from "../constants/const";
import NotFoundPage from "./pages/NotFoundPage";
import {MarkdownProvider} from "../context/MarkdownContext";

const empty: ReactElement = <></>;

export interface AppState {
  drawer?: JSX.Element
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
  drawer: undefined,
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
      <MarkdownProvider>
        <Routes>
          <Route path={HOME} element={<HomePage />} />
          <Route path={`${RESULT}`} element={<ResultListPage />} />
          <Route path={`${RESULT}/:id`} element={<ResultPage inputType={InputType.ID} />} />
          <Route path={QUERY} element={<QueryPage queryType="search" />} />
          <Route path={API_ERROR} element={<APIErrorPage />} />
          <Route path={ABOUT} element={<AboutPage />} />
          <Route path={RELEASE} element={<ReleasePage />} />
          <Route path={CONTACT} element={<ContactPage />} />
          <Route path={DOWNLOAD} element={<DownloadPage />} />
          <Route path={HELP} element={<HelpPage />} />

          {/* Dynamic routes for chromosome and protein queries
            - /:chromosome/:position/:ref_allele?/:alt_allele?
            - /:protein_accession/:position/:ref_amino_acid?/:alt_amino_acid?
          */}
          <Route
            path="/:param1/:param2/:param3?/:param4?"
            element={<QueryPage queryType="chromosome_protein" />}
          />
          {/* Route for protein accession */}
          <Route path="/:id" element={<ResultPage  inputType={InputType.PROTEIN_ACCESSION} />} />

          {/* Catch-all route for anything not matched above */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MarkdownProvider>
      </LocalStorageProvider>
    </AppContext.Provider>);
}