import {useState} from "react";
import {Route, RouteComponentProps, withRouter} from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import SearchResultsPage from "./pages/search/SearchResultPage";
import APIErrorPage from "./pages/APIErrorPage";
import {ERROR, INFO, WARN} from "../types/MappingResponse";
import {convertApiMappingToTableRecords, MappingRecord,} from "../utills/Convertor";
import {firstPage, Page} from "../utills/AppHelper";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import {ABOUT, API_ERROR, CONTACT, HOME, QUERY, SEARCH,} from "../constants/BrowserPaths";
import Notify from "./elements/Notify";
import QueryPage from "./pages/query/QueryPage";
import {Assembly, DEFAULT_ASSEMBLY} from "../constants/CommonTypes";
import {mappings} from "../services/ProtVarService";

interface AppProps extends RouteComponentProps {}

function App(props: AppProps) {
  const [loading, setLoading] = useState(false);
  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [searchResults, setSearchResults] = useState<MappingRecord[][][]>([]);
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


  const [page, setPage] = useState<Page>(firstPage(0));
  const [assembly, setAssembly] = useState(DEFAULT_ASSEMBLY)

  const fetchPage = (page: Page) => {
    setLoading(true);
    if (file) {
      fetchFromFile(page, file);
    } else if (userInputs) {
      handleSearch(page, userInputs);
    }
  };

  function updateAssembly(assembly: Assembly) {
    setAssembly(assembly);
  }

  function fetchPasteResult(userInputString: string) {
    const userInputs = userInputString.split("\n");
    setUserInputs(userInputs);
    setLoading(true);
    setFile(null);
    handleSearch(firstPage(userInputs.length), userInputs);
  }

  const handleSearch = (page: Page, inputArr: string[]) => {
    const PAGE_SIZE = page.itemsPerPage;
    var skipRecord = (page.currentPage - 1) * PAGE_SIZE;
    if (inputArr.length <= skipRecord) return;

    var inputSubArray = [];
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
    setFile(file);
    setUserInputs([]);
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
      console.log("in mappingApiCall " + assembly)
    mappings(inputSubArray, assembly.toString())
      .then((response) => {
        const records = convertApiMappingToTableRecords(response.data.inputs);
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
        props.history.push(SEARCH);
      })
      .catch((err) => {
        props.history.push(API_ERROR);
        console.log(err);
      })
      .finally(() => setLoading(false));
  }

  return (
    <>
      <Route
        path={HOME}
        exact
        render={() => (
          <HomePage
            loading={loading}
            assembly={assembly}
            updateAssembly={updateAssembly}
            fetchPasteResult={fetchPasteResult}
            fetchFileResult={fetchFileResult}
          />
        )}
      />
      <Route
        path={SEARCH}
        render={() => (
          <SearchResultsPage
            rows={searchResults}
            file={file}
            page={page}
            pastedInputs={userInputs}
            fetchNextPage={fetchPage}
            loading={loading}
          />
        )}
      />
      <Route path={QUERY} render={() => <QueryPage />} />
      <Route path={API_ERROR} render={() => <APIErrorPage />} />
      <Route path={ABOUT} render={() => <AboutPage />} />
      <Route path={CONTACT} render={() => <ContactPage />} />
    </>
  );
}

export default withRouter(App);
