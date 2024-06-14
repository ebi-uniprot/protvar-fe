import React, {createContext, ReactElement, useState} from "react";
import {Route, Routes} from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import APIErrorPage from "./pages/APIErrorPage";
import AboutPage from "./pages/AboutPage";
import ReleasePage from "./pages/ReleasePage";
import ContactPage from "./pages/ContactPage";
import {ABOUT, API_ERROR, CONTACT, DOWNLOAD, HOME, QUERY, RESULT, HELP, RELEASE} from "../constants/BrowserPaths";
import QueryPage from "./pages/query/QueryPage";
import {Assembly} from "../constants/CommonTypes";
import {submitInput} from "../services/ProtVarService";
import DownloadPage from "./pages/download/DownloadPage";
import HelpPage from "./pages/help/HelpPage";
import {PagedMappingResponse} from "../types/PagedMappingResponse";
import ResultPage from "./pages/result/ResultPage";
import {PAGE_SIZE} from "../constants/const";
import {LocalStorageProvider} from "../provider/LocalStorageContextProps";

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
  pageSize: PAGE_SIZE, // needs to be localStore, not appState
  response: null,
  updateState: (key: string, value: any) => {}
}

export const AppContext = createContext(initialState)

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

  // TODO - no need to cache this. use a diff singleInput endpoint maybe?
  const getQueryData = (input: string) => {
    submitInput(input)
      .then((response) => {
        updateState("response", response.data)
      })
      .catch((err) => {
        console.log(err);
        throw err;
      })
  }
  // <V2

  return (<AppContext.Provider value={appState}>
    <LocalStorageProvider>
    <Routes>
      <Route path={HOME} element={<HomePage />} />
      <Route path={`${RESULT}/:id`} element={<ResultPage />} />
      <Route path={QUERY} element={<QueryPage getQueryData={getQueryData} />} />
      <Route path={API_ERROR} element={<APIErrorPage />} />
      <Route path={ABOUT} element={<AboutPage />} />
      <Route path={RELEASE} element={<ReleasePage />} />
      <Route path={CONTACT} element={<ContactPage />} />
      <Route path={DOWNLOAD} element={<DownloadPage />} />
      <Route path={HELP} element={<HelpPage />} />
    </Routes>
      </LocalStorageProvider>
    </AppContext.Provider>);
}