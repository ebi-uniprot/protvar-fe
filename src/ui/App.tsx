import {Redirect, Route, RouteComponentProps, withRouter} from "react-router-dom";

import ResultPage from "./pages/result/ResultPage";
import {createContext, useState} from "react";
import {Assembly} from "../constants/CommonTypes";
import {PagedMappingResponse} from "../types/PagedMappingResponse";
import {getResult, postInput} from "../services/ProtVarService";
import {ERROR, INFO, WARN} from "../types/MappingResponse";
import Notify from "./elements/Notify";
import {
  ABOUT,
  API_ERROR,
  CONTACT,
  DOWNLOAD,
  HELP,
  HOME,
  QUERY,
  RELEASE,
  RESULT
} from "../constants/BrowserPaths";
import HomePage from "./pages/home/HomePage";
import QueryPage from "./pages/query/QueryPage";
import APIErrorPage from "./pages/APIErrorPage";
import AboutPage from "./pages/AboutPage";
import ReleasePage from "./pages/ReleasePage";
import ContactPage from "./pages/ContactPage";
import DownloadPage from "./pages/download/DownloadPage";
import HelpPage from "./pages/help/HelpPage";

interface AppProps extends RouteComponentProps {}

export interface AppState {
  textInput: string
  numTextInput: number
  file: File | null
  assembly: Assembly
  response: PagedMappingResponse | null
}

export const initialState = {
  textInput: "",
  numTextInput: 0,
  file: null,
  assembly: Assembly.AUTO,
  response: null
}

export const AppContext = createContext<AppState>(initialState);

function App(props: AppProps) {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<AppState>(initialState);
  const updateState = (name: string, value: any) => {
    setState(prevState => {
      return {
        ...prevState,
        [name]: value
      }
    })
  }

  const submitData = () => {
    setLoading(true)
    postInput(state.textInput)
      .then((response) => {
        updateState("response", response.data)
        const resultId = response.data.resultId
        response.data.content.messages.forEach(message => {
          if (message.type === INFO) {
            Notify.info(message.text)
          } else if (message.type === WARN) {
            Notify.warn(message.text)
          } else if (message.type === ERROR) {
            Notify.err(message.text)
          }
        });
        props.history.push(RESULT + "/" + resultId);
      })
      .catch((err) => {
        props.history.push(API_ERROR);
        console.log(err);
      })
      .finally(() => setLoading(false));
  }

  const getData = (id: string, pageNo?: number, pageSize?: number) => {
    setLoading(true)
    getResult(id).then((response) => {
      updateState("response", response.data)
    })
      .catch((err) => {
        //props.history.push(API_ERROR);
        setLoading(false)
        console.log(err);
      })
      .finally(() => setLoading(false));
  }

  return (
    <AppContext.Provider value={state}>
      <Route
        path={HOME}
        exact
        render={() => (
          <HomePage loading={loading} state={state} updateState={updateState} submitData={submitData} />
        )}
      />
      <Route
        path={RESULT + "/:id?"}
        render={() => (
          <ResultPage loading={loading} state={state} getData={getData} />
        )}
      />
      <Route path={QUERY} render={() => <QueryPage />} />
      <Route path={API_ERROR} render={() => <APIErrorPage />} />
      <Route path={ABOUT} render={() => <AboutPage />} />
      <Route path={RELEASE} render={() => <ReleasePage />} />
      <Route path={CONTACT} render={() => <ContactPage />} />
      <Route path={DOWNLOAD} render={() => <DownloadPage />} />
      <Route path={HELP} render={() => <HelpPage />} />

      <Route exact path="/test">
        <Redirect push to={"/test.html"} />
      </Route>
    </AppContext.Provider>
  );

}

export default withRouter(App);