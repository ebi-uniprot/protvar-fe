import { Route, RouteComponentProps, withRouter} from "react-router-dom";

import ResultPage from "./pages/result/ResultPage";
import NewHomePage from "./pages/home/NewHomePage";
import {useState} from "react";
import {Assembly} from "../constants/CommonTypes";
import {PagedMappingResponse} from "../types/PagedMappingResponse";
import {getResult, postInput} from "../services/ProtVarService";
import {ERROR, INFO, WARN} from "../types/MappingResponse";
import Notify from "./elements/Notify";
import {API_ERROR, SEARCH} from "../constants/BrowserPaths";

interface NewAppProps extends RouteComponentProps {}

export interface NewFormData {
  textInput: string
  file: File | null
  assembly: Assembly
  response: PagedMappingResponse | null
}

const initialFormData = {
  textInput: "",
  file: null,
  assembly: Assembly.AUTO,
  response: null
}

function NewApp(props: NewAppProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<NewFormData>(initialFormData);
  const updateFormData = (name: string, value: any) => {
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [name]: value
      }
    })
  }

  const submitData = () => {
    setLoading(true)
    postInput(formData.textInput)
      .then((response) => {
        updateFormData("response", response.data)
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
        props.history.push(`/v2/result/${resultId}`);
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
      updateFormData("response", response.data)
    })
      .catch((err) => {
        //props.history.push(API_ERROR);
        setLoading(false)
        console.log(err);
      })
      .finally(() => setLoading(false));
  }
  return (
    <>
      <Route
        path="/v2"
        exact
        render={() => (
          <NewHomePage loading={loading} formData={formData} updateFormData={updateFormData} submitData={submitData} />
        )}
      />
      <Route path="/v2/result/:id?" render={() => <ResultPage loading={loading} formData={formData} getData={getData} />} />
    </>
  );
}

export default withRouter(NewApp);
