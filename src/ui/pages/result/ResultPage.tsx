import DefaultPageLayout from "../../layout/DefaultPageLayout";
import LegendModal from "../../modal/LegendModal";
import {useParams} from "react-router-dom";
import ResultTable from "./ResultTable";
import {ReactNode, useEffect, useState} from "react";
import {NewPaginationRow} from "../search/PaginationRow";
import {LOCAL_RESULTS, PAGE_SIZE, TITLE} from "../../../constants/const";
import DownloadModal from "../../modal/DownloadModal";
import { useSearchParams } from "react-router-dom";
import {getResult} from "../../../services/ProtVarService";
import {PagedMappingResponse} from "../../../types/PagedMappingResponse";
import Loader from "../../elements/Loader";
import {useLocalStorageContext} from "../../../provider/LocalStorageContextProps";
import {ResultRecord} from "../../components/result/ResultHistory";
import {RESULT} from "../../../constants/BrowserPaths";

function ResultPageContent() {
  const {id} = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page")
  const assembly = searchParams.get("assembly")

  const [data, setData] = useState<PagedMappingResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ReactNode>(<></>);
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const { getValue, setValue } = useLocalStorageContext();
  const savedRecords = getValue<ResultRecord[]>(LOCAL_RESULTS) || [];

  // TODO, update to consider user may be viewing this
  // the first time, after link is shared!
  const updateResultHistory = (id: string) => {
    const updatedRecords = savedRecords.map(record =>
      record.id === id ? { ...record, lastViewed: new Date().toLocaleString() } : record
    );
    setValue(LOCAL_RESULTS, updatedRecords);
  };

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
        updateResultHistory(response.data.id)
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
        console.log(err)
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

  const shareUrl = `${window.location.origin}${process.env.PUBLIC_URL}${RESULT}`

  return <div className="search-results">
    <div className="flex justify-content-space-between">
      <NewPaginationRow loading={loading} data={data} loadData={loadData} pageSize={pageSize}
                        setPageSize={setPageSize}/>
      <div className="legend-container">
        <button title="Share" style={{fontSize: '20px', color: 'gray'}} onClick={() => {
          let url = `${shareUrl}/${id}`;
          navigator.clipboard.writeText(url);
          alert(`Copy URL: ${url}`)
        }} className="bi bi-share result-op-btn"></button>
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