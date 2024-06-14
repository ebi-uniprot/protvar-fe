import DefaultPageLayout from "../../layout/DefaultPageLayout";
import LegendModal from "../../modal/LegendModal";
import {useParams} from "react-router-dom";
import ResultTable from "./ResultTable";
import {ReactNode, useEffect, useState} from "react";
import {NewPaginationRow} from "../search/PaginationRow";
import {PAGE_SIZE, TITLE} from "../../../constants/const";
import DownloadModal from "../../modal/DownloadModal";
import { useSearchParams } from "react-router-dom";
import {getResult} from "../../../services/ProtVarService";
import {PagedMappingResponse} from "../../../types/PagedMappingResponse";
import Loader from "../../elements/Loader";

function ResultPageContent() {
  const {id} = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page")
  const assembly = searchParams.get("assembly")

  const [data, setData] = useState<PagedMappingResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ReactNode>(<></>);
  const [pageSize, setPageSize] = useState(PAGE_SIZE)

  const loadData = (id: string|undefined,assembly: string|null, page: string|null, pageSize: number) => {
    document.title = `Result - ${TITLE}`;
    setLoading(true)
    if (!id) {
      setError('ID is undefined');
      return;
    }

    setError(null)

    // page null or 1, no param
    // pageSize null or PAGE_SIZE, no param
    // assembly null or DEFAULT, no param

    const p: number | undefined = page ? +page : undefined

    getResult(id, p, pageSize, assembly)
      .then((response) => {
      setData(response.data)
      if (response.data && response.data.content?.inputs) {
        const totalItems = response.data.totalItems
        const pageTitle = totalItems === 1 ?
          response.data.content.inputs[0].inputStr :
          `Result for ${totalItems} inputs`
        document.title = `${pageTitle} - ${TITLE}`;
        /*
response.data.content.messages?.forEach(message => {
  if (message.type === INFO) {
    Notify.info(message.text)
  } else if (message.type === WARN) {
    Notify.warn(message.text)
  } else if (message.type === ERROR) {
    Notify.err(message.text)
  }
});*/
      } else {
        setError(<>No result found for ID {id}{p && ` page ${p}`}.<br/>
          Try searching for variants again or use a different result id.</>)
      }
    })
      .catch((err) => {
        setError('No result found. Try searching for variants again or use a different result id.')
      })

    setLoading(false)
  }//, [id,assembly, page, pageSize])

  useEffect(() => {
    loadData(id,assembly, page, pageSize);
  }, [id,assembly, page, pageSize])


  // TODO review this check
  //if (!rows || rows.length < 1)
  //  return <Redirect to="/" />

  if (loading) return <Loader />
  //if (error) return <div>{error}</div>

  return <div className="search-results">
    <div className="flex justify-content-space-between">
      <NewPaginationRow loading={loading} data={data} loadData={loadData} pageSize={pageSize}
                        setPageSize={setPageSize}/>
      <div className="legend-container">
        <LegendModal/>
        <DownloadModal/>
      </div>

    </div>
    <ResultTable data={data}/>
    <NewPaginationRow loading={loading} data={data} loadData={loadData} pageSize={pageSize}
                      setPageSize={setPageSize}/>
  </div>
}

function ResultPage() {
  return <DefaultPageLayout content={<ResultPageContent />}/>
}

export default ResultPage;