import DefaultPageLayout from "../../layout/DefaultPageLayout";
import LegendModal from "../../modal/LegendModal";
import {useParams} from "react-router-dom";
import ResultTable from "./ResultTable";
import {useContext, useEffect} from "react";
import {NewPaginationRow} from "../search/PaginationRow";
import {AppContext} from "../../App";
import {TITLE} from "../../../constants/const";
import DownloadModal from "../../modal/DownloadModal";
import { useSearchParams } from "react-router-dom";

interface ResultPageProps {
  loading: boolean
  getData: any
}

function ResultPageContent(props: ResultPageProps) {
  const state = useContext(AppContext)
  const params = useParams();
  const [searchParams] = useSearchParams();
  const { id } = params;
  const { loading, getData } = props

  const page = searchParams.get("page")

  useEffect(() => {
    //getResult(id).then((response) => {
    //  setData(response.data);
    //})
    const titleSummary = state.file ?
      'Results for file input' :
      (state.numTextInput === 1 ?
        state.textInput.replace(/^\s+|\s+$/g, '') :
        `Results for text input (${state.numTextInput})`)
    document.title = titleSummary + ' - ' + TITLE;

    if (state.response === null)
      getData(id, page)

  }, [id, state, getData, page])

  // TODO review this check
  //if (!rows || rows.length < 1)
  //  return <Redirect to="/" />

  if (loading)
    return <>Loading...</>
  else if (state.response == null)
    return <h5>No result to show. Try searching for variants again or use a different result id.</h5>

  return <>
    <div className="search-results">
      <div className="flex justify-content-space-between">
        <NewPaginationRow loading={loading} getData={getData} />
        <div className="legend-container" >
          <LegendModal />
          <DownloadModal />
        </div>

      </div>
      <ResultTable />
      <NewPaginationRow loading={loading} getData={getData} />
    </div>
  </>
}

function ResultPage(props: ResultPageProps) {
  return <DefaultPageLayout content={<ResultPageContent {...props} /> } />
}
export default ResultPage;