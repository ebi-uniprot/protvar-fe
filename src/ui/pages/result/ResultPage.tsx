import DefaultPageLayout from "../../layout/DefaultPageLayout";
import LegendModal from "../../modal/LegendModal";
import {useLocation, useParams} from "react-router-dom";
import ResultTable from "./ResultTable";
import {useCallback, useEffect, useState} from "react";
import {NewPaginationRow} from "../search/PaginationRow";
import {LOCAL_RESULTS, TITLE} from "../../../constants/const";
import DownloadModal from "../../modal/DownloadModal";
import {getResult} from "../../../services/ProtVarService";
import {PagedMappingResponse, ResultType} from "../../../types/PagedMappingResponse";
import {useLocalStorageContext} from "../../../provider/LocalStorageContextProps";

import {ResultRecord} from "../../../types/ResultRecord";

function ResultPageContent(props: ResultPageProps) {
  const location = useLocation()
  const {id} = useParams<{ id?: string }>();

  const [data, setData] = useState<PagedMappingResponse | null>(null)
  const [loading, setLoading] = useState(true)
  //const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const { getValue, setValue } = useLocalStorageContext();

  // TODO, update to consider user may be viewing this
  // the first time, after link is shared!
  /*
  const viewedRecord = (id: string) => {
    const updatedRecords = savedRecords.map(record =>
      record.id === id ? { ...record, lastViewed: new Date().toLocaleString() } : record
    );
    setValue(LOCAL_RESULTS, updatedRecords);
  };*/

  const viewedRecord = useCallback((id: string, url: string) => {
    const now = new Date().toLocaleString();
    const savedRecords = getValue<ResultRecord[]>(LOCAL_RESULTS) || [];

    // map records and update record if matching id is found.
    const updatedRecords = savedRecords.map(record =>
      record.id === id ? { ...record, url: url, lastViewed: now } : record
    );
    // if no matching record is found (checked using some), add new record
    // to beginning of array
    if (!updatedRecords.some(record => record.id === id)) {
      updatedRecords.unshift({ id, url: url, lastViewed: now });
    }
    setValue(LOCAL_RESULTS, updatedRecords);
  }, [getValue, setValue]);

  const loadData = useCallback((type: ResultType, location: any, id: string|undefined) => {
    document.title = `Result - ${TITLE}`;
    if (!id) {
      return;
    }
    setLoading(true)

    const searchParams = new URLSearchParams(location.search);
    const page = searchParams.get("page")
    const pageSize = searchParams.get("pageSize")
    const assembly = searchParams.get("assembly")

    // page null or 1, no param
    // pageSize null or PAGE_SIZE, no param
    // assembly null or DEFAULT, no param

    const p: number | undefined = page ? +page : undefined
    const ps: number | undefined = pageSize ? +pageSize : undefined

    getResult(type, id, p, ps, assembly)
      .then((response) => {
      setData(response.data)
      if (response.data && response.data.content?.inputs) {

        viewedRecord(response.data.id, location.pathname)
        //const savedRecords = getValue<ResultRecord[]>(LOCAL_RESULTS) || [];
        //const updatedRecords = savedRecords.map(record =>
        //  record.id === id ? { ...record, lastViewed: new Date().toLocaleString() } : record
        //);
        //setValue(LOCAL_RESULTS, updatedRecords);

        if (type === ResultType.PROTEIN) {
          document.title = `${id} - ${TITLE}`;
        } else {
          const totalItems = response.data.totalItems
          const pageTitle = totalItems === 1 ?
            response.data.content.inputs[0].inputStr :
            `Result (${totalItems} inputs)`
          document.title = `${pageTitle} - ${TITLE}`;
        }
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
      }
    })
      .catch((err) => {
        console.log(err)
      }).finally(() => {
      setLoading(false)
    })
  }, [viewedRecord])


  useEffect(() => {
    loadData(props.type, location, id);
  }, [props.type, location, id, loadData])

  const shareUrl = `${window.location.origin}${process.env.PUBLIC_URL}${location.pathname}`

  return <div className="search-results">
    <div className="flex justify-content-space-between">
      <NewPaginationRow loading={loading} data={data} />
      <div className="legend-container">
        <button title="Share" style={{fontSize: '20px', color: 'gray'}} onClick={() => {
          navigator.clipboard.writeText(shareUrl);
          alert(`Copy URL: ${shareUrl}`)
        }} className="bi bi-share result-op-btn"></button>
        <LegendModal/>
        <DownloadModal/>
      </div>

    </div>
    <ResultTable loading={loading} data={data}/>
    <NewPaginationRow loading={loading} data={data} />
  </div>
}

interface ResultPageProps {
  type: ResultType
}
function ResultPage(props: ResultPageProps) {
  return <DefaultPageLayout content={<ResultPageContent {...props} />}/>
}

export default ResultPage;