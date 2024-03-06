import DefaultPageLayout from "../../layout/DefaultPageLayout";
import LegendModal from "../../modal/LegendModal";
import {useParams} from "react-router-dom";
import NewResultTable from "../../components/result/NewResultTable";
import {useEffect} from "react";
import {AppState} from "../../App";
import {NewPaginationRow} from "../search/PaginationRow";
import {TITLE} from "../../../constants/const";
import DownloadModal from "../../modal/DownloadModal";


export const PAGE_SIZES:Array<number> = [25,50,100]
export const DEFAULT_PAGE_SIZE: number = PAGE_SIZES[0]

function ResultPageContent(props: ResultPageProps) {

  const params = useParams<{ id: string }>();
  const { id } = params;
  const { loading, state, getData } = props

  useEffect(() => {
    const titleSummary = state.file ?
      'Results for file input' :
      (state.numTextInput === 1 ?
        state.textInput.replace(/^\s+|\s+$/g, '') :
        `Results for text input (${state.numTextInput})`)
    document.title = titleSummary + ' - ' + TITLE;

    if (state.response == null)
      getData(id)

  }, [state, getData, id]);

  // TODO review this check
  //if (!rows || rows.length < 1)
  //  return <Redirect to="/" />

  if (loading)
    return <>Loading...</>
  else if (state.response == null)
    return <h5>No result found. Try search for variants again or use a different result id.</h5>

  return <>
    <div className="search-results">
      <div className="flex justify-content-space-between">
        <NewPaginationRow loading={loading}  state={state} getData={getData} />
        <div className="legend-container" >
          <LegendModal />
          <DownloadModal state={state} />
        </div>

      </div>
      <NewResultTable state={state} />
      <NewPaginationRow loading={loading}  state={state} getData={getData} />
    </div>
  </>
}

interface ResultPageProps {
  loading: boolean
  state: AppState
  getData: any
}

function ResultPage(props: ResultPageProps) {
  return <DefaultPageLayout content={<ResultPageContent {...props} /> } />
}
export default ResultPage;