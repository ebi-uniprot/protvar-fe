import DefaultPageLayout from "../../layout/DefaultPageLayout";
import LegendModal from "../../modal/LegendModal";
import {useLocation, useParams, useSearchParams} from "react-router-dom";
import ResultTable from "./ResultTable";
import React, {useCallback, useEffect, useState} from "react";
import PaginationRow from "./PaginationRow";
import {DEFAULT_PAGE, DEFAULT_PAGE_SIZE, LOCAL_RESULTS, PERMITTED_PAGE_SIZES, TITLE} from "../../../constants/const";
import DownloadModal from "../../modal/DownloadModal";
import {getResult} from "../../../services/ProtVarService";
import {InputType, PagedMappingResponse} from "../../../types/PagedMappingResponse";

import {ResultRecord} from "../../../types/ResultRecord";
import useLocalStorage from "../../../hooks/useLocalStorage";
import {APP_URL} from "../../App";
import {HelpButton} from "../../components/help/HelpButton";
import {HelpContent} from "../../components/help/HelpContent";
import {ShareLink} from "../../components/common/ShareLink";
import Spaces from "../../elements/Spaces";

function ResultPageContent(props: ResultPageProps) {
  const location = useLocation();
  const {id} = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();
  const [title, setTitle] = useState('')
  const [paginate, setPaginate] = useState(false)

  // components that alter search params:
  // 1) PaginationRow
  // 2) ShareAnnotation
  // ?
  // change in page,pageSize,assembly - requires reload
  // change in annotation - toggleAnnotation
  // maybe map searchParams into an interface for expected params where all fields will be optional?

  const page = parseInt(searchParams.get('page') || `${DEFAULT_PAGE}`, 10);
  const pageSize = parseInt(searchParams.get('pageSize') || `${DEFAULT_PAGE_SIZE}`, 10);
  const assembly = searchParams.get("assembly")

  const [data, setData] = useState<PagedMappingResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { getItem, setItem } = useLocalStorage();

  const viewedRecord = useCallback((id: string, url: string) => {
    const now = new Date().toISOString();
    let savedRecords = getItem<ResultRecord[]>(LOCAL_RESULTS) || [];

    // Find the index of the record to update
    const index = savedRecords.findIndex(record => record.id === id);

    if (index !== -1) {
      // Update the record in the array
      // update url to current page view
      savedRecords[index] = {...savedRecords[index], url, lastViewed: now};
      // Move the updated record to the beginning of the array
      const [movedRecord] = savedRecords.splice(index, 1);
      savedRecords.unshift(movedRecord);
    } else { // if no matching record is found
      // add new record to beginning of array
      savedRecords = [{ id, url, lastViewed: now }, ...savedRecords]
    }
    setItem(LOCAL_RESULTS, savedRecords);
  }, [getItem, setItem]);

  const loadData = useCallback((inputType: InputType, id: string|undefined
    , page: number, pageSize: number, assembly: string|null) => {
    document.title = `${title} - ${TITLE}`;
    if (!id) {
      return;
    }
    setLoading(true)
    const pageIsValid = !isNaN(page) && page > 0;
    const pageSizeIsValid = !isNaN(pageSize) && PERMITTED_PAGE_SIZES.includes(pageSize);

    if (!pageIsValid) {
      setError(`Invalid page, using default (page ${DEFAULT_PAGE})`)
      //Notify.warn('hey')
      page = DEFAULT_PAGE
    }

    if (!pageSizeIsValid) {
      setError(`Invalid page size, using default (page size ${DEFAULT_PAGE_SIZE})`)
      pageSize = DEFAULT_PAGE_SIZE
    }


    // page null or 1, no param
    // pageSize null or PAGE_SIZE, no param
    // assembly null or DEFAULT, no param

    getResult(inputType, id, page, pageSize, assembly)
      .then((response) => {
        // checks each level of response obj hierarchy exists and if inputs is non-empty.
        // if any part of the chain is null or undefined, the entire expr short-circuits
        // returns false.

        if (page > (response?.data?.totalPages ?? 0)) {
          // Handle case where page exceeds totalPages
          setError('Page number exceeds total pages, no results')
          //page = response.data.totalPages
          // navigate to last page?
        }

      if (response?.data?.content?.inputs?.length > 0) {
        setData(response.data)
        viewedRecord(response.data.id, location.pathname + location.search)

        if (inputType === InputType.PROTEIN_ACCESSION) {
          setTitle(`${id} (${Math.trunc(response.data.totalItems/3)} AA)`)
        } else {
          const totalItems = response.data.totalItems
          const pageTitle = totalItems === 1 ?
            response.data.content.inputs[0].inputStr :
            `${response.data.content.inputs[0].inputStr} ...+${totalItems-1} more `
          setTitle(pageTitle)
        }

        if (response?.data?.totalPages > 1) {
          setPaginate(true)
        }
        document.title = `${title} - ${TITLE}`;
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
  }, [viewedRecord, location])


  useEffect(() => {
    setError('')
    loadData(props.inputType, id, page, pageSize, assembly);
  }, [props.inputType, id, page, pageSize, assembly, loadData]) // listening for change in id, and searchParams


  const shareUrl = `${APP_URL}${location.pathname}${location.search}`

  return <div className="search-results">
    <div>
      <h5 className="page-header">Result <i className="bi bi-chevron-compact-right"></i> {title}</h5>
      <span className="help-icon">
      <HelpButton title="" content={<HelpContent name="result-page" />}/>
        </span>
    </div>

    <div style={{display: 'flex', justifyContent: paginate ? 'space-between' : 'flex-end', width: '100%'}}>
      {paginate && <PaginationRow loading={loading} data={data}/>}
      <span style={{alignSelf: 'flex-end'}}>
          {data &&
            <div className="legend-container">
              <ShareLink url={shareUrl} linkText="Share Results"/>
              <Spaces count={2}/>
              <LegendModal/>
              <DownloadModal inputType={props.inputType} id={id}/>
            </div>
          }
      </span>
    </div>
    {error && (
      <span className="padding-left-1x">
                      <i className="file-warning bi bi-exclamation-triangle-fill"></i>{' '}
        {error}
                      </span>
    )}
    <ResultTable loading={loading} data={data}/>
    {paginate &&
      <PaginationRow loading={loading} data={data}/>
    }
  </div>
}

interface ResultPageProps {
  inputType: InputType
}

function ResultPage(props: ResultPageProps) {
  return <DefaultPageLayout content={<ResultPageContent {...props} />}/>
}

export default ResultPage;