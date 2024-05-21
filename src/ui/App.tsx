import React, {createContext, ReactElement, useState} from "react";
import {useNavigate, Route, Routes} from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import SearchResultsPage from "./pages/search/SearchResultPage";
import APIErrorPage from "./pages/APIErrorPage";
import {ERROR, INFO, WARN} from "../types/MappingResponse";
import {convertApiMappingToTableRecords, MappingRecord,} from "../utills/Convertor";
import {firstPage, Page} from "../utills/AppHelper";
import AboutPage from "./pages/AboutPage";
import ReleasePage from "./pages/ReleasePage";
import ContactPage from "./pages/ContactPage";
import {ABOUT, API_ERROR, CONTACT, DOWNLOAD, HOME, QUERY, SEARCH, HELP, RELEASE} from "../constants/BrowserPaths";
import Notify from "./elements/Notify";
import QueryPage from "./pages/query/QueryPage";
import {Assembly} from "../constants/CommonTypes";
import {mappings} from "../services/ProtVarService";
import DownloadPage from "./pages/download/DownloadPage";
import HelpPage from "./pages/help/HelpPage";
import {FormData, initialFormData} from "../types/FormData";

const empty: ReactElement = <></>;

const initialSettings = {
  stdColor: true,
  showModal: false,
  modalContent: empty
}

export const AppContext = createContext({
  ...initialSettings,
  toggleStdColor: () => {},
  toggleModal: () => {},
  setModalContent: (elem: JSX.Element) => {}
})

export default function App() {
  const toggleStdColor = () => {
    setSettings(prevSettings => ({...prevSettings,
      stdColor: prevSettings.stdColor ? false : true
    }));
  }

  const toggleModal = () => {
    setSettings(prevSettings => ({...prevSettings,
      showModal: prevSettings.showModal ? false : true
    }));
  }

  const setModalContent = (newContent: JSX.Element) => {
    setSettings(prevSettings => ({...prevSettings,
      modalContent: newContent
    }));
  }

  const [settings, setSettings] = useState({
    ...initialSettings,
    toggleStdColor,
    toggleModal,
    setModalContent
  })

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [page, setPage] = useState<Page>(firstPage(0));
  const [searchResults, setSearchResults] = useState<MappingRecord[][][]>([]);
  const navigate = useNavigate();



  // MappingRecord 3d array -> [][][] list of mappings/genes/isoforms
    // mappings : [
    //     ...
    //     genes: [
    //        ...
    //        isoforms: [ -> for can, all fields; for non-can, no INPUT & GENOMIC fields, only PROTEIN fields
    //           ...
    //            ]
    //     ]
    // ]
    // e.g.
    // input 1   gene 1   isoform1 (can)
    //                    isoform2 (non-can)
    // input 2   gene 1   isoform 1 (can)
    //                    isoform 2 (non-can)
    //                    ...
    //           gene 2  isoform 1 (can)
    //                   isoform 2 (non-can)
    //                   ...
    //           ...
    // ...

  const fetchPage = (page: Page) => {
    setLoading(true);
    if (formData.file) {
      fetchFromFile(page, formData.file);
    } else if (formData.userInputs) {
      handleSearch(page, formData.userInputs);
    }
  };

  function updateAssembly(assembly: Assembly) {
      formData.assembly = assembly;
      setFormData(formData);
  }

  function fetchPasteResult(userInputString: string) {
    const userInputs = userInputString.split("\n");
    formData.userInputs = userInputs;
    formData.file = null;
    setFormData(formData);
    setLoading(true);
    handleSearch(firstPage(userInputs.length), userInputs);
  }

  const handleSearch = (page: Page, inputArr: string[]) => {
    const PAGE_SIZE = page.itemsPerPage;
    var skipRecord = (page.currentPage - 1) * PAGE_SIZE;
    if (inputArr.length <= skipRecord) return;

    var inputSubArray;
    const isNextPage = inputArr.length > skipRecord + PAGE_SIZE;
    if (isNextPage) {
      inputSubArray = inputArr.slice(skipRecord, skipRecord + PAGE_SIZE);
    } else {
      inputSubArray = inputArr.slice(skipRecord);
    }

    setPage({ ...page, nextPage: isNextPage });
    mappingApiCall(inputSubArray);
  };

  function fetchFileResult(file: File) {
    setLoading(true);
    formData.file = file;
    formData.userInputs = [];
    setFormData(formData);
    file
      .text()
      .then((text) => fetchFromFile(firstPage(text.split("\n").length), file));
  }

  const fetchFromFile = (page: Page, uploadedFile: File) => {
    const pageSize = page.itemsPerPage;
    const skipRecord = (page.currentPage - 1) * pageSize;

    uploadedFile
      .text()
      .then((text) => text.split("\n"))
      .then((lines) => {
        let count = 0,
          recordsProcessed = 0;
        const inputText: string[] = [];
        for (const newInput of lines) {
          if (recordsProcessed >= pageSize) {
            break;
          }
          if (
            count > skipRecord &&
            newInput.length > 0 &&
            !newInput.startsWith("#")
          ) {
            recordsProcessed++;
            inputText.push(newInput);
          } else {
            count++;
          }
        }
        setPage({ ...page, nextPage: recordsProcessed >= pageSize });
        return inputText;
      })
      .then((inputs) => mappingApiCall(inputs));
  };

  function mappingApiCall(inputSubArray: string[]) {
    mappings(inputSubArray, formData.assembly.toString())
      .then((response) => {
        const records = convertApiMappingToTableRecords(response.data);
        setSearchResults(records);
        response.data.messages.forEach(message => {
            if (message.type === INFO) {
                Notify.info(message.text)
            } else if (message.type === WARN) {
                Notify.warn(message.text)
            } else if (message.type === ERROR) {
                Notify.err(message.text)
            }
        });
        navigate(SEARCH);
      })
      .catch((err) => {
        navigate(API_ERROR);
        console.log(err);
      })
      .finally(() => setLoading(false));
  }

  return (<AppContext.Provider value={settings}>
    <Routes>
      <Route
        path={HOME}
        element={<HomePage
            loading={loading}
            formData={formData}
            updateAssembly={updateAssembly}
            fetchPasteResult={fetchPasteResult}
            fetchFileResult={fetchFileResult}
            searchResults={searchResults}
          />} />
      <Route
        path={SEARCH}
        element={<SearchResultsPage
            rows={searchResults}
            page={page}
            formData={formData}
            fetchNextPage={fetchPage}
            loading={loading}
          />} />
      <Route path={QUERY} element={<QueryPage />} />
      <Route path={API_ERROR} element={<APIErrorPage />} />
      <Route path={ABOUT} element={<AboutPage />} />
      <Route path={RELEASE} element={<ReleasePage />} />
      <Route path={CONTACT} element={<ContactPage />} />
      <Route path={DOWNLOAD} element={<DownloadPage searchResults={searchResults}/>} />
      <Route path={HELP} element={<HelpPage />} />
    </Routes>
    </AppContext.Provider>);
}
