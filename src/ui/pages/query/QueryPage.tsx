import React, {useCallback, useEffect, useState} from 'react'
import {useLocation, useParams, useSearchParams} from 'react-router-dom'
import ResultTable from '../result/ResultTable'
import DefaultPageLayout from '../../layout/DefaultPageLayout'
import DownloadModal from '../../modal/DownloadModal'
import LegendModal from '../../modal/LegendModal'
import {TITLE} from "../../../constants/const";
import {mappings} from "../../../services/ProtVarService";
import {InputType, PagedMappingResponse, toPagedMappingResponse} from "../../../types/PagedMappingResponse";
import {APP_URL} from "../../App";
import {HelpButton} from "../../components/help/HelpButton";
import {HelpContent} from "../../components/help/HelpContent";
import {ShareLink} from "../../components/common/ShareLink";
import Spaces from "../../elements/Spaces";
import Loader from "../../elements/Loader";
import {NO_DATA, NO_RESULT, UNEXPECTED_ERR} from "../result/ResultPage";

const INVALID_QUERY = 'Invalid search query'

const chromosomeRegex = /^chr([1-9]|1[0-9]|2[0-2]|X|Y|MT)$/;
// Uniprot accession regular expression:
// https://www.uniprot.org/help/accession_numbers
const proteinAccessionRegex = /^([OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2})$/;
const positionRegex = /^\d+$/;

const buildQueryString = (param1: string, param2: string, param3: string | null | undefined, param4: string | null | undefined): string =>
  `${param1} ${param2}${param3 ? ` ${param3}${param4 ? ` ${param4}` : ''}` : ''}`;

function splitString(input: string | null): string | undefined {
  if (input === null) {
    return undefined;
  }
  const parts = input.split(/[\n,|]/);
  return parts.length > 0 ? parts[0] : undefined;
}

const QueryPageContent = (props: QueryPageProps) => {
  const location = useLocation()
  const [searchParams] = useSearchParams();
  const {param1, param2, param3, param4} = useParams();
  const [query, setQuery] = useState<string | undefined>()
  const [data, setData] = useState<PagedMappingResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [warning, setWarning] = useState('')

  const loadData = useCallback((queryType: string, searchParams: URLSearchParams, param1?: string, param2?: string, param3?: string, param4?: string) => {
    setLoading(true)
    let q;
    if (queryType === 'search' && searchParams.get('search')) {
      // free text search
      q = splitString(searchParams.get('search'))
    } else if (queryType === 'search' && searchParams.get('chromosome') && searchParams.get('genomic_position')) {
      // chromosome query with search parameters
      // for chromosome and protein queries with search parameters, validate on the server-side
      q = buildQueryString(
        searchParams.get('chromosome')!,
        searchParams.get('genomic_position')!,
        searchParams.get('reference_allele'),
        searchParams.get('alternative_allele'))
    } else if (queryType === 'search' && searchParams.get('accession') && searchParams.get('protein_position')) {
      // protein query with search parameters
      q = buildQueryString(
        searchParams.get('accession')!,
        searchParams.get('protein_position')!,
        searchParams.get('reference_AA'),
        searchParams.get('variant_AA'))
    } else if (queryType === 'chromosome_protein' && chromosomeRegex.test(param1!) && positionRegex.test(param2!)) {
      // chromosome query
      // extra check for path params to ensure valid, and chromosome or protein url
      q = buildQueryString(param1!.substring(3), param2!, param3, param4)
    } else if (queryType === 'chromosome_protein' && proteinAccessionRegex.test(param1!) && positionRegex.test(param2!)) {
      // protein query
      q = buildQueryString(param1!, param2!, param3, param4)
    }

    const assembly = searchParams.get('assembly');
    //console.log('query', q)
    if (q) {
      setQuery(q)
      mappings([q], assembly ?? undefined)
        .then((response) => {
          if (response.data) {
            if (response.data.inputs?.length > 0) {
              const mappingResponse = toPagedMappingResponse(response.data)
              if (mappingResponse.content?.inputs?.length > 0) {
                setData(mappingResponse)
              } else {
                setWarning(NO_RESULT)
              }
            }
          } else {
            setWarning(NO_DATA)
          }
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 404) {
              setWarning(NO_RESULT);
            } else {
              setWarning(`Error ${err.response.status}: ${err.response.statusText}`);
            }
          } else {
            setWarning(UNEXPECTED_ERR);
          }
        }).finally(() => {
        setLoading(false)
      })
    } else {
      setWarning(INVALID_QUERY)
    }
    setLoading(false)
  }, []);


  useEffect(() => {
    setWarning('')
    loadData(props.queryType, searchParams, param1, param2, param3, param4)
  }, [props.queryType, searchParams, param1, param2, param3, param4, loadData]);

  document.title = query ? `${query} | ${TITLE}` : TITLE

  const shareUrl = `${APP_URL}${location.pathname}${location.search}`

  return <div className="search-results">
    <div>
      <h5 className="page-header">Query <i className="bi bi-chevron-compact-right"></i> {query}</h5>
      <span className="help-icon">
    <HelpButton title="" content={<HelpContent name="direct-queries"/>}/>
      </span>
    </div>

    {data &&
      <div style={{display: 'flex', justifyContent: 'flex-end', width: '100%'}}>
      <span style={{alignSelf: 'flex-end'}}>
        <div className="legend-container">
          <ShareLink url={shareUrl} linkText="Share Results"/>
          <Spaces count={2}/>
          <LegendModal/>
          <DownloadModal inputType={InputType.SINGLE_VARIANT} query={query}/>
        </div>
      </span>
      </div>}

    {warning && (<div className="result-warning">
      <i className="file-warning bi bi-exclamation-triangle-fill"></i>{' '}
      {warning}
    </div>)}
    {!data && loading && <Loader/>}
    <ResultTable data={data}/>
  </div>
}

interface QueryPageProps {
  queryType: string
}

function QueryPage(props: QueryPageProps) {
  return <DefaultPageLayout content={<QueryPageContent {...props} />}/>
}

export default QueryPage