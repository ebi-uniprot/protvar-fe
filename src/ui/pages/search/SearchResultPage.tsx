import ResultTable from "../../components/search/ResultTable";
import DefaultPageLayout from "../../layout/DefaultPageLayout";
import PaginationRow from "./PaginationRow";
import { Redirect } from 'react-router-dom'
import { NextPageFun, Page } from "../../../utills/AppHelper";
import { MappingRecord } from "../../../utills/Convertor";
import { ParsedInput } from "../../../types/MappingResponse";
import DownloadModal from "../../modal/DownloadModal";
import { MAX_IN_PLACE_DOWNLOAD_WITHOUT_EMAIL } from "../../../constants/const";
import CaddLegendColors from "../../components/search/CaddLegendColors";
import ResultTableButtonsLegend from "../../components/search/ResultTableButtonsLegend";
import EveScoreColors from "../../components/search/EveScoreColors";

interface SearchResultPageProps {
  pastedInputs: string[]
  file: File | null
  page: Page
  fetchNextPage: NextPageFun
  rows: MappingRecord[][][]
  invalidInputs: Array<ParsedInput>
  loading: boolean
}

function SearchResultsPageContent(props: SearchResultPageProps) {
  const { pastedInputs, file, page, invalidInputs, rows, fetchNextPage, loading } = props;
  if (!rows || rows.length < 1)
    return <Redirect to="/" />

  return <>
    <div className="search-results">
      <div className="flex justify-content-space-between">
        <PaginationRow page={page} fetchNextPage={fetchNextPage} loading={loading} />
        <DownloadModal pastedInputs={pastedInputs} file={file} sendEmail={page.totalItems > MAX_IN_PLACE_DOWNLOAD_WITHOUT_EMAIL} />
        <ResultTableButtonsLegend />
      </div>
      <ResultTable invalidInputs={invalidInputs} mappings={rows} />
      <PaginationRow page={page} fetchNextPage={fetchNextPage} loading={loading} />
      <CaddLegendColors />
      <EveScoreColors />
    </div>
  </>
}

function SearchResultPage(props: SearchResultPageProps) {
  return <DefaultPageLayout content={<SearchResultsPageContent {...props} />} />
}
export default SearchResultPage;