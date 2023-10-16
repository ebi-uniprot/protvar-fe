import ResultTable from "../../components/search/ResultTable";
import DefaultPageLayout from "../../layout/DefaultPageLayout";
import PaginationRow from "./PaginationRow";
import { Redirect } from 'react-router-dom'
import { NextPageFun, Page } from "../../../utills/AppHelper";
import { MappingRecord } from "../../../utills/Convertor";
import DownloadModal from "../../modal/DownloadModal";
import LegendModal from "../../modal/LegendModal";
import {FormData} from '../../../types/FormData'
import {useEffect} from "react";
import {TITLE} from "../../../constants/const";

interface SearchResultPageProps {
  formData: FormData
  page: Page
  fetchNextPage: NextPageFun
  rows: MappingRecord[][][]
  loading: boolean
}

function SearchResultsPageContent(props: SearchResultPageProps) {
  const { formData, page, rows, fetchNextPage, loading } = props;

  useEffect(() => {
    const titleSummary = props.formData.file ? 'Showing results for file input' : (props.formData.userInputs.length === 1 ? props.formData.userInputs[0].trim() : 'Showing results for ' + props.formData.userInputs.length + ' user inputs')
    document.title = titleSummary + ' - ' + TITLE;
  }, [props]);

  if (!rows || rows.length < 1)
    return <Redirect to="/" />

  return <>
    <div className="search-results">
      <div className="flex justify-content-space-between">
        <PaginationRow page={page} fetchNextPage={fetchNextPage} loading={loading} />
        <div className="legend-container" >
        <LegendModal />
        <DownloadModal formData={formData} />
        </div>
        
      </div>
      <ResultTable mappings={rows} />
      <PaginationRow page={page} fetchNextPage={fetchNextPage} loading={loading} />
    </div>
  </>
}

function SearchResultPage(props: SearchResultPageProps) {
  return <DefaultPageLayout content={<SearchResultsPageContent {...props} /> } searchResults={props.rows} />
}
export default SearchResultPage;