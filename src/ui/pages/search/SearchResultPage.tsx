import ResultTable from "../../components/search/ResultTable";
import DefaultPageLayout from "../../layout/DefaultPageLayout";
import PaginationRow from "./PaginationRow";
import { Redirect } from 'react-router-dom'
import { NextPageFun, Page } from "../../../utills/AppHelper";
import { MappingRecord } from "../../../utills/Convertor";
import DownloadModal from "../../modal/DownloadModal";
import LegendModal from "../../modal/LegendModal";

interface SearchResultPageProps {
  pastedInputs: string[]
  file: File | null
  page: Page
  fetchNextPage: NextPageFun
  rows: MappingRecord[][][]
  loading: boolean
}

function SearchResultsPageContent(props: SearchResultPageProps) {
  const { pastedInputs, file, page, rows, fetchNextPage, loading } = props;
  if (!rows || rows.length < 1)
    return <Redirect to="/" />

  return <>
    <div className="search-results">
      <div className="flex justify-content-space-between">
        <PaginationRow page={page} fetchNextPage={fetchNextPage} loading={loading} />
        <div className="legend-container" >
        <LegendModal />
        <DownloadModal pastedInputs={pastedInputs} file={file} />
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